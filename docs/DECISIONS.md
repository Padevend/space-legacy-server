# Architecture & Technical Decisions Record (DECISIONS.md)

Ce document consigne l'ensemble des décisions normatives et techniques prises dans le cadre du recadrage MVP de **SPACE LEGACY**.

---

### D1 : Conservation de la pile Hono + Prisma + PostgreSQL 16
- **Décision :** Conserver la pile technique actuelle (Hono v4, Prisma v7/v8, PostgreSQL 16 sous conteneur Docker, TypeScript strict avec `noUncheckedIndexedAccess` et `exactOptionalPropertyTypes`).
- **Justification :** Cette pile offre une exécution ultra-rapide (faible latence, consommation mémoire minime), un typage de bout en bout et une intégration native OpenAPI/Zod.
- **Organisation :** Architecture MVC modulaire inspirée d'AdonisJS v6 (`app/modules/<module>/` avec `controllers`, `models`, `repositories`, `services`, `validators`, `routes`, `listeners`).

### D2 : Réduction du périmètre à 7 modules et 19 modèles de données
- **Décision :** Purge des 6 modules hors MVP (`people`, `media`, `measurements`, `archive`, `catalog`, `audit`).
- **Nouveau découpage (7 modules) :**
  1. `celestial-bodies` : Référentiel des corps célestes (Lune et Mars).
  2. `machines` : Engins spatiaux et leurs sous-ressources (`MachineSource`, `MachineFact`, `MachineEvent`, `MachineImage`).
  3. `logbook` : Journal de bord de la machine (`LogbookEntry` : article Markdown et vidéo).
  4. `games` : Quiz, questions, options, tentatives et badges (`Quiz`, `Badge`, etc.).
  5. `identity` : Visiteurs anonymes, comptes réels et sessions (`Visitor`, `Account`, `Session`).
  6. `ingestion` : Validation et intégration de lots d'archives ZIP (`IngestionBatch`).
  7. `generation` : Gestion des requêtes de génération asynchrone vidéo et texte (`GenerationJob`).
- **Justification :** Élimination de 20 tables de jointure inutiles au profit d'un schéma simple, direct, performant et immédiatement compréhensible pour les développeurs et les contributeurs.

### D3 : Gestion d'identité par jeton opaque (Bearer Session)
- **Décision :** Utiliser des jetons de session opaques de 32 octets aléatoires générés cryptographiquement (`crypto.randomBytes(32)`), transmis via `Authorization: Bearer <token>` et stockés sous forme de condensat SHA-256 en base de données (`Session.tokenHash`).
- **Durée de vie :** 90 jours glissants pour une session anonyme, 30 jours pour un compte enregistré.
- **Fusion de progression :**
  - À l'inscription (`POST /auth/register`), le compte est directement rattaché au `visitorId` existant sans copie de données.
  - À la connexion (`POST /auth/login`), si le visiteur anonyme possède des tentatives ou badges, l'événement `VisitorMerged` est émis dans la même transaction : les tentatives et badges sont fusionnés vers le visiteur du compte, le visiteur anonyme est supprimé, et un nouveau jeton de compte est délivré.

### D4 : Suppression définitive et réelle des données (N8)
- **Décision :** L'endpoint `DELETE /me` (nécessitant le mot de passe et la confirmation textuelle `"DELETE"`) effectue un `DELETE` SQL en cascade sur le modèle `Visitor`.
- **Justification :** Aucune conservation résiduelle, aucun soft-delete (`deletedAt`), aucune anonymisation partielle. La suppression efface physiquement toutes les lignes associées (`Account`, `Session`, `QuizAttempt`, `QuizAnswer`, `VisitorBadge`).

### D5 : Règle stricte des modifications ciblées en PATCH (N5)
- **Décision :** Toutes les routes de modification d'entité sont des requêtes `PATCH` partielles validées par Zod (`.strict()`).
- **Justification :** Interdiction des requêtes "PUT" réécrivant des graphes complets d'objets. Chaque sous-ressource (`sources`, `facts`, `events`, `images`) dispose de ses propres routes REST dédiées (`POST`, `PATCH`, `DELETE`).

### D6 : Traçabilité absolue des faits et coordonnées (N7)
- **Décision :** Aucun fait (`MachineFact`) ni événement (`MachineEvent`) ne peut exister sans référence étrangère vers une source (`MachineSource`).
- **Contrôle d'hôte :** Les URLs de sources doivent obligatoirement appartenir à la liste blanche `ALLOWED_SOURCE_HOSTS` (domaines officiels `nasa.gov`, `jpl.nasa.gov`, etc.).

### D7 : Découplage de la génération et faux service Python pour les tests (N11)
- **Décision :** Le backend Space Legacy n'embarque aucune logique d'IA ou de rendu vidéo. Il interagit avec le service externe via l'interface `GenerationProvider` et l'adaptateur HTTP.
- **Environnement de test :** Les tests E2E s'exécutent contre un serveur HTTP léger de test (`tests/fake-python-service/`) reproduisant le contrat d'API Python (`POST /jobs` ➔ 202, `GET /jobs/:id` ➔ statut et résultat).

### D8 : Validation de sécurité stricte des ZIP d'ingestion (N6, N8)
- **Décision :** Tout ZIP soumis à `POST /admin/ingestion` est traité en flux avec arrêt immédiat si un seuil de taille ou un ratio de décompression est dépassé (protection Zip Bomb).
- **Contrôles :** Rejet des chemins relatifs avec `..` ou absolus (Zip Slip), rejet des SVG, vérification de la signature binaire (`magic bytes`) des images contre leur extension, et ré-encodage complet (suppression des métadonnées EXIF) avant stockage.

### D9 : Stratégie de migration de schéma (N10)
- **Décision :** Comme l'application n'est pas encore déployée en production publique avec des données utilisateurs réelles, repartir en étape S3 d'une migration initiale propre pour le schéma cible du MVP, permettant un `prisma migrate reset` instantané à froid.

### D10 : Architecture du socle partagé `app/shared/` et communication inter-modules (N4, N12)
- **Décision :** Structurer `app/shared` en 6 piliers isolés :
  1. `enums.ts` : 10 énumérations de domaine alignées sur Prisma Client.
  2. `errors.ts` : Hiérarchie d'erreurs typées respectant le contrat uniforme N12 (`{ error: { code, message, details } }`), sanitisant tout message générique pour exclure chemins de fichiers et fragments SQL.
  3. `http.ts` : Réponses JSON standardisées (`jsonSuccess`, `jsonPaginated`, `jsonError`) et encodage/décodage de curseurs opaques base64url pour la pagination.
  4. `config.ts` : Validation Zod stricte au démarrage avec valeurs par défaut sécurisées.
  5. `events/` : Bus d'événements transactionnel in-memory (`VisitorMerged`, `VisitorDeleted`) transmettant le client de transaction (`Prisma.TransactionClient`) aux listeners pour garantir l'atomicité.
  6. `security/` : Hachage Argon2id (min 10 caractères), jetons de session opaques cryptographiques de 32 octets (condensat SHA-256 en base), durées glissantes (90j visiteur, 30j compte), et validation stricte d'URLs contre les domaines autorisés (`nasa.gov`, `jpl.nasa.gov`).

### D11 : Quarantaine des modules pré-recadrage et seed authentique NASA (N1, N7)
- **Décision :** Déplacement des modules v1/v2 dans `legacy/` via `git mv` afin de préserver l'historique Git sans perturber le typage TypeScript (`tsconfig.json` exclut `legacy/`).
- **Seed conforme N7 :** Seuls la Lune et Mars sont injectés, accompagnés de 7 machines réelles de la NASA dont chaque fait, chiffre et date est relié à une source officielle `nasa.gov` / `jpl.nasa.gov`. Aucune donnée inventée.

### D12 : Pagination par curseur opaque et agrégation de facettes pour le catalogue (N4, N5, N12)
- **Décision :** La pagination des machines utilise un curseur opaque encodé en base64url contenant `{ createdAt, id }` avec un tri déterministe `[createdAt desc, id desc]`. La requête extrait `limit + 1` éléments pour déterminer `hasMore` sans `COUNT(*)` coûteux sur chaque requête.
- **Facettes de filtrage :** Les facettes (`body`, `kind`, `state`) sont calculées en base via `groupBy` sur l'ensemble des machines publiées, permettant au client de disposer des décomptes exacts pour guider la navigation sans dépendre d'un moteur de recherche tiers hors MVP.

### D13 : Isolation du module `logbook` et vérification de la machine parente (N4, N7)
- **Décision :** Conformément à la règle d'isolation N4 et à la suite de tests `tests/unit/module_ownership.spec.ts`, le module `logbook` n'invoque pas le délégué `prisma.machine`. Pour vérifier l'existence et l'état de publication de la machine hôte sans violer les frontières d'isolation, `LogbookRepository` exécute une requête brute ciblée `SELECT id, slug, name FROM machines WHERE slug = $1 AND "isPublished" = true LIMIT 1` via `this.prisma.$queryRaw`.
- **Performance réseau :** La liste de résumé des entrées (`GET /machines/:slug/logbook`) omet le champ verbeux `articleMarkdown` afin d'économiser la bande passante, tandis que le détail (`GET /machines/:slug/logbook/:entry`) retourne l'article intégral et les métadonnées vidéo.

### D14 : Résolution de sessions opaques par injection IoC, timing-safety et suppression physique N8 (N4, N8, N9)
- **Décision :** L'authentification utilise des jetons opaques cryptographiques de 32 octets aléatoires (64 caractères hexadécimaux). Pour préserver l'étanchéité des modules (N4), `auth_middleware` ne connaît pas le module `identity` et délègue la vérification de session au container IoC via l'interface `SessionResolver` (`SESSION_RESOLVER_TOKEN`).
- **Timing-Safety :** Sur `POST /auth/login`, un mot de passe incorrect et un e-mail inexistant renvoient la même erreur 401 avec un temps de réponse équivalent (vérification Argon2id simulée sur un condensat factice) pour empêcher les attaques par canal auxiliaire d'énumération de comptes.
- **Suppression définitive (N8) :** `DELETE /me` exige le mot de passe courant et la confirmation explicite `"DELETE"`. La suppression physique est opérée sur la ligne `Visitor` correspondante, provoquant par cascade SQL irréversible l'effacement de l'ensemble des comptes, sessions, tentatives et badges.

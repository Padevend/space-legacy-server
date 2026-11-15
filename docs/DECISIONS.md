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

### D15 : Évaluation des quiz, masquage des réponses et déverrouillage de badges (N4, N6, N7, N12)
- **Décision :** La consultation d'un quiz (`GET /api/v1/quizzes/:slug`) ne révèle jamais les réponses correctes (`isCorrect: false` sur toutes les options) ni les explications pédagogiques (`explanation: null`). Ce masquage est opéré au niveau du service pour éliminer tout risque de triche ou de fuite dans les réponses HTTP publiques.
- **Soumission et notation (`POST /api/v1/quizzes/:slug/attempts`) :**
  - La notation compare chaque réponse soumise avec les options véridiques en base de données au sein d'une transaction isolée.
  - Les réponses complètes avec `isCorrect` effectif et l'`explanation` scientifique NASA ne sont retournées qu'après la validation de la soumission dans le DTO de résultat.
  - L'évaluation des règles de badges (`QUIZ_COMPLETED_COUNT`, `PERFECT_SCORE_COUNT`, `BODY_ALL_QUIZZES`) s'exécute automatiquement dans la transaction de soumission. Tout nouveau badge décroché est inséré en base et renvoyé dans `newBadges`.
- **Fusion événementielle asynchrone (N4) :** Le module `games` s'abonne à l'événement de domaine `VisitorMerged` via l'EventBus partagé. Lorsque l'utilisateur anonyme s'authentifie, toutes ses tentatives (`QuizAttempt`) et tous ses badges (`VisitorBadge`) sont fusionnés de manière atomique vers le compte connecté sans couplage direct entre les modules `identity` et `games`.

### D16 : Surface d'administration `/api/v1/admin`, modifications ciblées en PATCH et matrice d'accès RBAC (N4, N5, N7, N12)
- **Décision :** La surface d'administration `/api/v1/admin` est protégée au niveau du groupe de routage par la combinaison des middlewares `auth()` (résolution de session opaque via `SessionResolver`) et `requireRole('ADMIN')`.
- **Matrice de contrôle d'accès (E2E-P7) :**
  - Requête non authentifiée : 401 `UNAUTHENTICATED`.
  - Session anonyme : 401 `UNAUTHENTICATED` (ou 403 si session sans compte).
  - Utilisateur authentifié au rôle `USER` : 403 `FORBIDDEN` avec le message normé `"Admin role required to perform this action."`.
  - Compte administrateur (`role: 'ADMIN'`) : Accès autorisé 200/201/204.
- **Règle stricte des modifications ciblées (N5) :** Toutes les routes de mise à jour (`PATCH /bodies/:id`, `PATCH /machines/:id`, `PATCH /machines/:id/{sources,facts,events,images}/:subId`, `PATCH /logbook/:id`) acceptent exclusivement des corps partiels validés par Zod avec `.strict()`. Seuls les champs explicitement fournis sont mis à jour en base.
- **Réflexion publique immédiate :** Tout basculement de `isPublished` ou modification de contenu éditorial est immédiatement visible ou masqué sur les endpoints publics (`/machines`, `/machines/:slug`, `/logbook`, `/bodies`) sans délai ni cache résiduel.
- **Traçabilité des sources (N7) :** L'ajout ou l'édition de `MachineSource` applique la fonction `assertAllowedSourceUrl` contre `ALLOWED_SOURCE_HOSTS` (`nasa.gov`, `jpl.nasa.gov`), interdisant tout hôte non officiel avec une réponse 422 `UNSUPPORTED_SOURCE_HOST`.

### D17 : Ingestion sécurisée par archives ZIP et validation multicouche (N4, N6, N7, N8, N12)
- **Décision :** Implémenter le module `ingestion` permettant l'importation par lots de machines, sources, faits, événements, images et quiz via des archives ZIP soumises à `POST /api/v1/admin/ingestion` (avec simulation dry-run `POST /api/v1/admin/ingestion/validate`).
- **Garanties de sécurité et quotas stricts (Section 8) :**
  - Taille d'archive : 25 Mo max (`ZIP_TOO_LARGE`).
  - Nombre d'entrées : 300 entrées max (`ZIP_TOO_MANY_ENTRIES`).
  - Décompression unitaire : 15 Mo max ; globale : 120 Mo max ; ratio : 50:1 max (`ZIP_BOMB_SUSPECTED`).
  - Interdiction absolue des archives et entrées chiffrées (`ZIP_ENCRYPTED`).
  - Protection Zip Slip stricte interdisant `..`, séparateurs absolus et caractères nuls (`ZIP_PATH_TRAVERSAL`).
  - Rejet des métadonnées système (`__MACOSX/`, `.DS_Store`), profondeur > 4, longueur nom > 120 caractères (`ZIP_FORBIDDEN_ENTRY`).
  - Liste blanche stricte d'extensions : `.json`, `.jpg`, `.jpeg`, `.png`, `.webp` (`FORBIDDEN_EXTENSION`).
  - Validation binaire par signature (magic bytes) et parsing d'en-têtes purs en mémoire (rejet SVG, max 4000x4000 px et 16 Mégapixels) (`SIGNATURE_MISMATCH`, `IMAGE_INVALID`).
  - Manifeste racine obligatoire (`MANIFEST_MISSING`, `MANIFEST_MISMATCH`).
  - Validation Zod stricte de chaque fichier JSON (`SCHEMA_INVALID`).
  - Intégrité référentielle et traçabilité N7 : corps célestes vérifiés en base, sources limitées aux domaines autorisés (`nasa.gov`, `jpl.nasa.gov`), `sourceKey` obligatoires (`REFERENCE_UNKNOWN`, `URL_NOT_ALLOWED`, `SOURCE_MISSING`).
  - Unicité des slugs (`DUPLICATE_SLUG`).
- **Atomicité transactionnelle et sécurité disque :** En cas d'erreur sur une seule entrée ou règle, rejet complet 422 avec enveloppe N12 et aucun enregistrement en base ni fichier sur disque (les écritures d'images et l'upsert SQL ne sont exécutés qu'après la validation totale du lot).
- **Audit et traçabilité :** Chaque lot validé ou rejeté est persisté dans `ingestion_batches` avec son condensat SHA-256, son statut (`VALIDATED`, `COMMITTED`, `REJECTED`) et son rapport d'exécution détaillé.

### D18 : Délégation asynchrone des générations IA au service Python et propagation automatique (N4, N6, N7, N11, N12)
- **Décision :** Implémenter le module `generation` permettant la délégation asynchrone de génération de récits de bord (logbook entries), quiz et faits de machines à un microservice Python dédié via `/api/v1/admin/generation`.
- **Architecture asynchrone & Contrat HTTP (N11, N12) :**
  - La soumission d'une tâche (`POST /api/v1/admin/generation/jobs`) crée un enregistrement en base `GenerationJob` avec l'état `PENDING` et délègue l'exécution au service Python via `POST /api/v1/generate`.
  - La communication est sécurisée par clé API (`x-api-key`), timeout configurable et mécanisme de retry avec backoff exponentiel.
  - La liste blanche d'hôtes autorisés (`PYTHON_ALLOWED_RESULT_HOSTS`) empêche toute redirection malveillante ou SSRF lors du traitement des URLs de résultats.
  - En cas d'indisponibilité ou d'erreur réseau du service Python, une erreur normée 503 `SERVICE_UNAVAILABLE` est renvoyée avec le code d'erreur `GENERATION_SERVICE_UNAVAILABLE`.
- **Synchronisation et propagation automatique :**
  - La synchronisation manuelle ou périodique (`POST /api/v1/admin/generation/jobs/:id/poll`) interroge le service Python (`GET /api/v1/generate/jobs/:id`).
  - Lorsque l'état passe à `COMPLETED`, les métriques d'exécution (`tokensUsed`, `modelName`, `generationTimeMs`) sont persistées et le résultat est automatiquement propagé vers l'entité cible (ex: mise à jour du champ `content` d'une `LogbookEntry` ciblée).
  - L'annulation (`POST /api/v1/admin/generation/jobs/:id/cancel`) transmet la demande d'annulation au service Python et bascule le statut local en `FAILED` avec le message d'erreur `"Generation job cancelled by user."`.
- **Pureté architecturale et isolation des modules (N4) :**
  - Le repository de génération `generation_repository.ts` manipule exclusivement la table `generation_jobs`.
  - Toute interaction avec les entités d'autres modules (vérification de l'existence ou mise à jour de contenu d'entrées de journal) est réalisée via des requêtes SQL brutes isolées (`$queryRaw`, `$executeRaw`), garantissant l'absence de couplage direct avec les délégués Prisma d'autres modules et respectant strictement `tests/unit/module_ownership.spec.ts`.

### D19 : Restructuration du Dashboard d'Administration et Interface Mission Control (N1, N2, N4, N5, N12)
- **Décision :** Implémenter l'interface web d'administration Mission Control (`dashboard/index.html`) servie directement sur `GET /admin` et consommant exclusivement la surface d'administration `/api/v1/admin/*`.
- **Architecture de l'interface en sections autonomes (Section 10) :**
  - **Aperçu (`/overview`) :** Compteurs d'engins (total, publiés, brouillons), corps célestes (Lune et Mars), journal de bord, quiz, statut du dernier lot d'ingestion et alertes de travaux échoués.
  - **Machines & Onglets éditeur :** Navigation avec filtres combinés (corps, statut), table réactive et éditeur découpé en 7 onglets ciblés (Identité, Mission & Histoire, Chiffres clés, Chronologie, Sources, Images & provenance IA, Journal de bord).
  - **Modifications ciblées par onglet (N5) :** Chaque onglet sauvegarde exclusivement ses attributs par requête `PATCH` ciblée, avec garde anti-perte de modifications non enregistrées (`isDirty`).
  - **Quiz & Badges :** Visualisation des défis éducatifs et du catalogue de distinctions.
  - **Ingestion ZIP :** Affichage des quotas Section 8, bouton de téléchargement du ZIP modèle officiel, zone de glisser-déposer, simulation dry-run (`/validate`) et rapport d'exécution avec codes d'erreur explicites.
  - **Générations IA :** Supervision des tâches du microservice Python avec métriques de latence/tokens, synchronisation (`/poll`) et annulation (`/cancel`).
- **Gestion universelle des états :** Tout écran gère les états de chargement, état vide explicite et retour d'erreur formaté selon la norme N12.
- **Sécurité et conformité :** La page frontend est servie de façon statique sécurisée ; toutes les mutations et lectures nécessitent un jeton d'authentification Bearer au rôle `ADMIN`.

### D20 : Durcissement sécuritaire, politique CSP, isolation des origines et caviardage de logs (N6, N9, N11, N12)
- **Décision :** Finaliser et verrouiller le durcissement sécuritaire global du socle backend :
  - **En-têtes sécurisés :** Application systématique de `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, `Cross-Origin-Resource-Policy: cross-origin`, et politique CSP stricte `default-src 'none'; frame-ancestors 'none'; base-uri 'none'` sur toute l'API JSON (avec exemption ciblée pour l'interface Mission Control `/admin`).
  - **CORS strict :** Contrôle rigoureux par liste blanche dynamique d'origines autorisées sans recours aux wildcards permissifs lorsque les identifiants sont acceptés.
  - **Protection CSRF :** Vérification stricte des en-têtes `Origin` et `Host` sur l'ensemble des requêtes mutantes (`POST`, `PUT`, `PATCH`, `DELETE`).
  - **Limitation de débit (Rate Limiting) :** Plafonds par adresse IP avec en-têtes normés `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset` et `Retry-After`.
  - **Caviardage de secrets dans les journaux (N9) :** Masquage irréversible des mots de passe, jetons de session, clés API et en-têtes d'authentification (`authorization`, `cookie`, `apiKey`, `password`) dans Pino pour éliminer tout risque de fuite d'informations sensibles.

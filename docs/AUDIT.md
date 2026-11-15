# Baseline Codebase Audit — SPACE LEGACY

**Date :** 15 Novembre 2026  
**Auteur :** Lead Backend & Security Architect  
**Statut :** Validé (Étape S0 — Baseline)

---

## 1. Contexte & Objectif du Recadrage

Dans le cadre du défi **NASA Space Apps Challenge 2026** (*Abandoned but Not Forgotten*), SPACE LEGACY a pour mission de raconter l'histoire des engins spatiaux et artefacts laissés par la NASA sur la Lune et sur Mars, à destination d'un public jeune et passionné.

Pour garantir un **MVP totalement fonctionnel, testable et utilisable de bout en bout**, le projet subit un recadrage normatif strict :
- Réduction du périmètre à **7 modules essentiels** (`celestial-bodies`, `machines`, `logbook`, `games`, `identity`, `ingestion`, `generation`) plus le dashboard d'administration.
- Élimination intégrale du code mort, des modules hors MVP (`people`, `media`, `measurements`, `archive`, `catalog`, `audit`).
- Restructuration du schéma de base de données de 36 tables complexes (avec 20 tables de jointure) vers 19 modèles ciblés, centrés sur la machine, son journal de bord, ses quiz et sa traçabilité.

---

## 2. Inventaire de la Base Existante (Baseline S0)

### 2.1 Modules Applicatifs (`app/modules/`)
La base actuelle comporte 17 modules :
1. `archives` : Traçabilité des contenus bruts scrapés (tables `Archive`, `ArchiveMission`, `ArchiveEquipment`, etc.).
2. `audit` : Journalisation d'audit administratif (table `AuditLog`).
3. `auth` : Authentification des administrateurs et gestion des utilisateurs (tables `User`, `RefreshToken`).
4. `catalog` : Modèles de lecture composés publics (`/home`, `/destinations`, `/explore`).
5. `celestial_bodies` : Référentiel des corps célestes (`CelestialBody`).
6. `dashboard` : Compteurs d'administration (`/admin/dashboard/counters`).
7. `equipment` : Artefacts et hiérarchie d'équipements (`Equipment`, tables de liaison multiples).
8. `events` : Jalons temporels (`Event`, tables de liaison).
9. `health` : Sondes de disponibilité (`/health/live`, `/health/ready`).
10. `ingestion` : Intégration de lots bruts (`IngestionRun`).
11. `locations` : Coordonnées et sites d'atterrissage (`Location`).
12. `measurements` : Mesures scientifiques précises (`Measurement`).
13. `media` : Galerie multimédia et labels d'images (`Media`).
14. `missions` : Programmes et expéditions spatiales (`Mission`).
15. `people` : Astronautes et scientifiques (`Person`).
16. `sources` : Références bibliographiques (`Source`).
17. `stories` : Récits éditoriaux et workflow de publication (`Story`).

### 2.2 Schéma de Données Actuel (`prisma/schema.prisma`)
- **36 modèles** : dont 20 tables de jointure n-aire (`StoryMission`, `StoryEquipment`, `EventEquipment`, `EquipmentLocation`, `MissionEquipment`, etc.).
- **Dette relationnelle** : La multiplicité des tables de jointure engendre une complexité disproportionnée pour un MVP éducatif, avec des risques de requêtes lentes, des vérifications de cycles coûteuses et une redondance de clés étrangères.

### 2.3 Routes HTTP (`docs/api/routes-map.md`)
- **153 routes enregistrées** sous `/api/v1` et à la racine (`/health/*`).
- Les routes actuelles sont dispersées sur 17 contrôleurs avec des DTOs souvent trop verbeux ou exposant des collections transversales complexes.

### 2.4 État des Tests Existants
Exécution de la suite complète de tests de caractérisation :
- **Tests unitaires (`tests/unit/`)** : 5 suites, 27 tests **PASS** (isolation des modules, propriété des tables, parité des énumérations, conteneur de dépendances).
- **Tests de contrat (`tests/contract/`)** : 1 suite, 6 tests **PASS** (synchronisation OpenAPI, routes-map et typage).
- **Tests de sécurité (`tests/security/`)** : 7 suites, 38 tests **PASS** (RBAC, CSRF, en-têtes sécurisés, limitation de débit, résistance brute-force, SSRF safeFetch, ordre du middleware).
- **Tests E2E (`tests/e2e/`)** : 13 suites, 60 tests **PASS** (sur conteneur PostgreSQL 16 réel `space-legacy-test-pg`).
- **Total : 26 suites de test, 131 tests PASS (100 % vert)**.

---

## 3. Analyse des Écarts & Dette Technique

| Domaine | État Actuel | Cible MVP (Section 2) | Action Requise |
|---|---|---|---|
| **Périmètre Modules** | 17 modules avec forte granularité | 7 modules finis, étanches | Purge de 6 modules (`people`, `media`, `measurements`, `archive`, `catalog`, `audit`), absorption de `events` et `sources` dans `machines`. |
| **Identité Visiteur** | Uniquement `User` et `RefreshToken` (Admin/Éditeur) | Compte visiteur anonyme + compte réel avec fusion | Création du module `identity` (`Visitor`, `Account`, `Session`, jeton opaque 32 octets, événement `VisitorMerged`). |
| **Engins & Machines** | `Equipment` dispersé avec 6 tables de jointure | `Machine` centralisé avec faits sourcés, chronologie et images | Schéma épuré : `Machine`, `MachineSource`, `MachineFact`, `MachineEvent`, `MachineImage`. |
| **Récits / Logbook** | `Story` complexe (workflow brouillon/archive) | `LogbookEntry` lié à la machine (vidéo + article) | Création du module `logbook` avec suivi de l'origine (`AUTHORED` / `GENERATED`). |
| **Ludification** | Aucune implémentation de jeux | Module `games` complet | Modèles `Quiz`, `QuizQuestion`, `QuizOption`, `QuizAttempt`, `Badge`, attribution et fusion. |
| **Génération Externe** | Inexistant | Module `generation` canalisant le service Python | Interface `GenerationProvider`, modèle `GenerationJob`, worker de sondage et faux service de test. |
| **Ingestion de Données** | Scraped JSON loader basique | Ingestion atomique de ZIP sécurisée | Validateur ZIP anti-bomb, anti-slip, vérification binaire d'images et manifeste JSON. |
| **Modifications HTTP** | Endpoints de mise à jour complets | PATCH partiels stricts (N5) | Remplacement des PUT intégraux par des PATCH ciblant uniquement les champs fournis. |

---

## 4. Stratégie de Transition

1. **Étape S1** : Mise en place du socle de test unifié (helpers de session, faux service Python, santé CI).
2. **Étape S2** : Purge définitive et atomique du code, routes, tables et tests des 6 modules supprimés.
3. **Étape S3** : Implantation du nouveau schéma Prisma, des utilitaires `app/shared`, migration propre et seed ciblé sur la Lune et Mars.
4. **Étapes S4 à S10** : Implémentation séquentielle des 7 modules du MVP avec leur test E2E dédié vert à chaque étape.
5. **Étape S11** : Restructuration du dashboard d'administration pour consommer les nouveaux endpoints d'administration.
6. **Étapes S12 & S13** : Durcissement sécuritaire, nettoyage complet du code mort, documentation publique et technique finale.

---
*Ce rapport d'audit valide la fin de l'étape S0 et sert de référence immuable avant l'application des étapes S1 et suivantes.*

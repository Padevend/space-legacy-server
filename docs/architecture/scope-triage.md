# Scope Triage: In Scope vs Quarantined Features

This document provides the definitive triage matrix for SPACE LEGACY V1 based on the functional and technical specifications and the v3 refoundation brief.

---

## 1. In Scope for V1

- **Public Read API**: Anonymous, GET-only access for `missions`, `equipment`, `events`, `locations`, `celestial-bodies`, `people`, `sources`, `stories` (published only), `media` (with computed `requiresAiLabel`), and `measurements`.
- **Catalog Composed Read Models**: Specialized aggregations for the frontend: `/catalog/home`, `/catalog/destinations`, `/catalog/equipment` (Explore search), `/catalog/equipment/:idOrSlug` (sections A through H).
- **Admin Management API**: Authenticated and audited CRUD and join-table management for all entities; editorial workflow state machine (`DRAFT` -> `REVIEW` -> `PUBLISHED` -> `ARCHIVED`); user and role administration (`ADMINISTRATOR`, `EDITOR`).
- **Data Integration Pipeline**: Ingestion of `/results/[machine]/[table]_bulk.json` bundles into PostgreSQL for the 5 V1 equipment items: Opportunity (MER-B), Surveyor 3, Apollo 11 Lunar Module & EASEP, Ingenuity, Viking 1.
- **Enterprise Engineering Baseline**: Real PostgreSQL, strict TypeScript, AdonisJS v6-style MVC architecture, zero cross-module communication, complete documentation and Docker production packaging.

---

## 2. Quarantined in `legacy/`

| Parked Feature | Spec Reference | Rationale |
|---|---|---|
| Community forum, social messaging | Spec §4.3 | Put on hold; focus on verified educational content |
| Visitor accounts, public signup | Spec §4.3 | Out of V1; back-office accounts only |
| Interactive quiz and gamified scoring | Spec §4.3, §18 | Post-MVP milestone |
| 3D map tile streaming & cartography | Spec §4.3, §18 | Coordinates kept in `Location`; 3D streaming deferred |
| AI autonomous generation agent | Spec §7 | Editorial foundations first; agent scheduled for future phase |
| Binary media file uploads & S3 storage | Spec §12.4, §19 | Hosting undecided; V1 stores URL pointers only |
| Redis clustered rate limiting | Brief | V1 runs single instance; in-memory store suffices |
| Idempotency-Key request replay | Brief | Transactional upserts suffice for V1 editorial volume |
| Static public data JSON export | Brief | Public API with HTTP caching delivers superior freshness |

See [`legacy/README.md`](../../legacy/README.md) for individual specifications and reintegration procedures.

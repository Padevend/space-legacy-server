# SPACE LEGACY — API Documentation Reference

The complete HTTP routing registry, OpenAPI 3.1 specification, and error handling contracts are maintained with automated anti-drift validation (`pnpm test:drift`).

---

## 1. OpenAPI Specification & Routes Map

- **Full Routes Map (Markdown Table):** [`docs/api/routes-map.md`](./api/routes-map.md)
- **Routes Registry (JSON):** [`docs/api/routes-map.json`](./api/routes-map.json)
- **OpenAPI 3.1.0 Document (JSON):** [`docs/api/openapi.json`](./api/openapi.json)
- **Error Codes Reference:** [`docs/api/errors.md`](./api/errors.md)
- **ZIP Ingestion Specification:** [`docs/INGESTION_SPEC.md`](./INGESTION_SPEC.md)

---

## 2. API Overview

The SPACE LEGACY platform exposes **57 routes** across 7 MVP modules + health probes and Mission Control UI:

### 2.1 Public Endpoints (`/api/v1`)
- **Celestial Bodies:**
  - `GET /api/v1/bodies` : List Moon and Mars with machine counts.
  - `GET /api/v1/bodies/:slug` : Detailed body information.
- **Machines:**
  - `GET /api/v1/machines` : Searchable and filterable machine catalog (`body`, `status`, `kind`, `search`, facets).
  - `GET /api/v1/machines/:slug` : Deep machine dossier with verified NASA sources, timeline events, and imagery.
- **Logbook:**
  - `GET /api/v1/logbook` : Published narratives and educational video articles.
  - `GET /api/v1/logbook/:slug` : Single logbook story with video stream metadata.
- **Identity & Session:**
  - `POST /api/v1/session/anonymous` : Allocate guest session with 32-byte opaque token.
  - `POST /api/v1/auth/register` : Create permanent account with automatic visitor history preservation.
  - `POST /api/v1/auth/login` : Authenticate account with transactional guest badge merge (`VisitorMerged`).
  - `POST /api/v1/auth/logout` : Revoke session token.
  - `GET /api/v1/account/me` : Inspect profile, unlocked badges, and quiz attempts.
  - `DELETE /api/v1/account/me` : Irreversible physical cascade deletion (N8).
- **Games & Badges:**
  - `GET /api/v1/quizzes` : Active challenges list.
  - `GET /api/v1/quizzes/:slug` : Quiz challenge (correct answers hidden).
  - `POST /api/v1/quizzes/:slug/attempts` : Submit answers, receive evaluation, and unlock earned badges.
  - `GET /api/v1/badges` : Educational achievement catalog.

### 2.2 Mission Control Admin Surface (`/api/v1/admin`)
*Protected by `auth()` and `requireRole('ADMIN')`*
- **Dashboard:** `GET /api/v1/admin/overview` (aggregate telemetry counters, ingestion state, unpublished alerts).
- **Targeted PATCH Mutations (N5):**
  - `PATCH /api/v1/admin/bodies/:id`
  - `PATCH /api/v1/admin/machines/:id`
  - `PATCH /api/v1/admin/machines/:id/sources/:subId`
  - `PATCH /api/v1/admin/machines/:id/facts/:subId`
  - `PATCH /api/v1/admin/machines/:id/events/:subId`
  - `PATCH /api/v1/admin/machines/:id/images/:subId`
  - `PATCH /api/v1/admin/logbook/:id`
- **ZIP Ingestion (Section 8):**
  - `GET /api/v1/admin/ingestion/spec`
  - `GET /api/v1/admin/ingestion/template.zip`
  - `POST /api/v1/admin/ingestion/validate` (dry run)
  - `POST /api/v1/admin/ingestion` (atomic import)
  - `GET /api/v1/admin/ingestion/:id`
- **AI Generation Delegation:**
  - `POST /api/v1/admin/generation/jobs`
  - `GET /api/v1/admin/generation/jobs`
  - `GET /api/v1/admin/generation/jobs/:id`
  - `POST /api/v1/admin/generation/jobs/:id/poll`
  - `POST /api/v1/admin/generation/jobs/:id/cancel`

---

## 3. Uniform Error Envelope (N12)

All API error responses strictly conform to the unified envelope:
```json
{
  "error": {
    "code": "STRING_ERROR_CODE",
    "message": "Human readable explanation.",
    "details": []
  }
}
```
No stack traces, internal database rows, or file paths are ever exposed.

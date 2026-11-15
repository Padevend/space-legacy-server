# ADR-007: Editorial Workflow State Machine and Media AI Provenance Tracking

## Status
Accepted

## Context
SPACE LEGACY delivers curated narratives and multimedia assets about historical NASA equipment left across the Moon, Mars, and deep space. As an educational product for school-age users and enthusiasts, two editorial concerns are paramount:
1. **AI Provenance Transparency**: Digital media may include 3D reconstructions, artist concepts, and AI-generated illustrations alongside authentic NASA historical photographs. Clear labeling of AI-generated content is an ethical and competition requirement.
2. **Editorial Content Workflow & Information Leakage**: Educational stories undergo iterative drafting, review, publication, and potential retirement. Unpublished drafts, internal notes, or in-review stories must never be visible to anonymous public consumers. Furthermore, checking a draft story's URL must not reveal whether a draft exists (preventing information leakage).

## Decisions

### 1. Mandatory AI Labeling via Serializer Computation
- Every `Media` database record contains `provenanceType: MediaProvenance` (`NASA_ARCHIVE`, `RECONSTRUCTION_3D`, `AI_GENERATED_ILLUSTRATION`, `DATA_VISUALIZATION`, `OTHER`).
- The `MediaSerializer` deterministically computes:
  ```typescript
  requiresAiLabel: media.provenanceType === 'AI_GENERATED_ILLUSTRATION'
  ```
- This computed boolean is always present on serialized `Media` objects across all public and admin endpoints, ensuring the frontend client can reliably display the mandatory AI notice.

### 2. Editorial Lifecycle State Machine
Stories follow a strict finite-state transition machine enforced by `POST /api/v1/admin/stories/:id/transitions`:
- `DRAFT` -> `REVIEW`, `ARCHIVED`
- `REVIEW` -> `DRAFT`, `PUBLISHED`, `ARCHIVED`
- `PUBLISHED` -> `ARCHIVED`, `DRAFT`
- `ARCHIVED` -> `DRAFT`

Any transition outside this table (e.g. attempting to jump directly from `DRAFT` to `PUBLISHED` without review, or transitioning from `ARCHIVED` to `PUBLISHED`) is rejected with `409 CONFLICT`.

### 3. Automated Publication Timestamps
- When a story transitions to `PUBLISHED`, the system sets `publishedAt = new Date()`.
- Newly created stories always initialize with `publicationStatus: 'DRAFT'` and `publishedAt: null`.

### 4. Zero-Leakage Public Visibility Guard
- Public endpoints (`GET /api/v1/stories` and `GET /api/v1/stories/:idOrSlug`) strictly enforce `publicationStatus = 'PUBLISHED'`.
- Lookups for non-existent slugs and lookups for stories in `DRAFT`, `REVIEW`, or `ARCHIVED` status return identical `404 NOT_FOUND` responses.
- Anonymous queries cannot bypass this filter via query parameters.

### 5. Plain-Text & URL Sanitization
- All text input fields (`title`, `hook`, `content`, `caption`, `altText`) undergo NFC normalization, control character removal, and complete HTML tag stripping via `sanitize-html` with `allowedTags: []`.
- URLs are strictly validated to require HTTP or HTTPS protocols without embedded credentials.

## Consequences
- **Positive**: Strict editorial quality control; guaranteed AI transparency for all media assets; complete concealment of unfinished or archived editorial narratives from the public.
- **Auditing**: Every status change and relational modification is recorded in the `AuditLog` table with actor ID, timestamp, and transition diff summary.

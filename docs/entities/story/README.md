# Story Entity Documentation

The `Story` entity provides curated editorial narratives, historical chronicles, and deep technical spotlights about NASA equipment and historical missions left across the Moon, Mars, and deep space.

## TypeScript Definitions
- Core Model: [`model.ts`](./model.ts)
- Requests: [`api_request.ts`](./api_request.ts)
- Responses: [`api_response.ts`](./api_response.ts)

## Features & Editorial Workflow
- **Public Visibility Enforcement**: Anonymous and public users can ONLY view stories with `publicationStatus = 'PUBLISHED'`. Draft, in-review, or archived stories return a clean 404 response to avoid information leakage.
- **Editorial Lifecycle Transitions**: Editorial status transitions must use `POST /api/v1/admin/stories/:id/transitions` adhering to the lifecycle state machine:
  - `DRAFT` -> `REVIEW`, `ARCHIVED`
  - `REVIEW` -> `DRAFT`, `PUBLISHED`, `ARCHIVED`
  - `PUBLISHED` -> `ARCHIVED`, `DRAFT`
  - `ARCHIVED` -> `DRAFT`
- **Automatic Publication Timestamps**: Transitioning to `PUBLISHED` automatically sets `publishedAt` to the current timestamp.
- **XSS Stripping**: Story title, hook, and narrative content are sanitized against script tags and HTML injection attacks.
- **Relational Associations**: Stories link to Missions, Equipment, Timeline Events, Media, and Primary Sources.

# Media Entity Documentation

The `Media` entity models digital assets (photographs, 3D reconstructions, audio recordings, video footage, scientific documents, animations) related to equipment left behind in space and editorial stories.

## TypeScript Definitions
- Core Model: [`model.ts`](./model.ts)
- Requests: [`api_request.ts`](./api_request.ts)
- Responses: [`api_response.ts`](./api_response.ts)

## Features & Mandatory Rules
- **AI Provenance Notice**: Every serialized media record computes `requiresAiLabel: boolean` (`true` when `provenanceType === 'AI_GENERATED_ILLUSTRATION'`). This enables frontend consumers to display mandatory AI provenance notices.
- **URL & Plain-Text Security**: URLs must use standard HTTP/HTTPS schemes without embedded credentials. Plain-text fields (`caption`, `altText`, `credit`) are sanitized against XSS injections.
- **Relational Associations**: Media can be linked to Equipment with representation types (`PRIMARY_PHOTO`, `3D_MODEL`, etc.) and to editorial stories with caption overrides.

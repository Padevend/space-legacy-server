# Mission Entity Documentation

The `Mission` entity models space exploration programs, campaigns, and individual flights (e.g., Apollo 11, Mars Pathfinder, Cassini-Huygens).

## TypeScript Definitions
- Core Model: [`model.ts`](./model.ts)
- Requests: [`api_request.ts`](./api_request.ts)
- Responses: [`api_response.ts`](./api_response.ts)

## Features
- **Public Lookups**: Supports UUID and human-readable slug lookups via `/api/v1/missions/:idOrSlug`.
- **Eager Loading**: Whitelisted `include=equipment,people,sources` with depth-1 capping.
- **Relational Links**: Full join-table management for equipment, mission personnel, and verifying primary sources.

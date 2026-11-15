# Event Entity Documentation

The `Event` entity documents significant historical milestones, timeline points, and occurrences across space missions.

## TypeScript Definitions
- Core Model: [`model.ts`](./model.ts)
- Requests: [`api_request.ts`](./api_request.ts)
- Responses: [`api_response.ts`](./api_response.ts)

## Serialization Details
- `eventDate`: Formatted as ISO string date `YYYY-MM-DD`.
- `eventTime`: Formatted as `HH:mm:ss`.
- `sequenceOrder`: Integer for deterministic ordering within the same date.

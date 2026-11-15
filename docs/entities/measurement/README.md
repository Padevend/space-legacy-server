# Measurement Entity Documentation

The `Measurement` entity records high-precision scientific and engineering parameters (mass, dimensions, duration, frequencies, thrust force) for spacecraft, components, and mission milestones.

## TypeScript Definitions
- Core Model: [`model.ts`](./model.ts)
- Requests: [`api_request.ts`](./api_request.ts)
- Responses: [`api_response.ts`](./api_response.ts)

## Precision Protection Rule
- `value` and `uncertainty` are backed by PostgreSQL `Decimal(24, 8)` and serialized strictly as strings (e.g. `"210.00000000"`). They must never be coerced to IEEE 754 floating point numbers to prevent precision loss.

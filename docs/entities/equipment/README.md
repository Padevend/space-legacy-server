# Equipment Entity Documentation

The `Equipment` entity represents rovers, landers, orbiters, descent stages, retroreflectors, and scientific instruments left on celestial surfaces or in orbit.

## TypeScript Definitions
- Core Model: [`model.ts`](./model.ts)
- Requests: [`api_request.ts`](./api_request.ts)
- Responses: [`api_response.ts`](./api_response.ts)

## Key Technical Behaviors
- **Hierarchy & Cycle Prevention**: Equipment can be linked to a parent sub-assembly (`parentEquipmentId`). Any cyclic parenting is detected and blocked with 422 Unprocessable Entity.
- **Slug Lookups**: Accessible by slug (`/api/v1/equipment/lrv-3-apollo-17`) or UUID.
- **Sub-Resource Endpoints**:
  - `/equipment/:idOrSlug/children`
  - `/equipment/:idOrSlug/events`
  - `/equipment/:idOrSlug/locations`
  - `/equipment/:idOrSlug/measurements`
  - `/equipment/:idOrSlug/media`
  - `/equipment/:idOrSlug/sources`

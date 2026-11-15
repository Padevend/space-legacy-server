# Person Entity Contract

The `Person` entity records astronauts, aerospace engineers, mission controllers, and historical figures who participated in the design, flight, or operation of abandoned equipment.

## 1. Endpoints
- Public:
  - `GET /api/v1/people`: List people with pagination, search, and affiliation filters.
  - `GET /api/v1/people/:id`: Get single person profile.
- Admin:
  - `GET /api/v1/admin/people`: Admin list.
  - `POST /api/v1/admin/people`: Create person profile (`ADMIN` or `EDITOR`).
  - `GET /api/v1/admin/people/:id`: Get single person.
  - `PATCH /api/v1/admin/people/:id`: Update person (`ADMIN` or `EDITOR`).
  - `DELETE /api/v1/admin/people/:id`: Delete person (`ADMIN` only).

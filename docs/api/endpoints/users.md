# Admin Users Module Endpoints

This document describes all user management endpoints under `/api/v1/admin/users`. All endpoints require `ADMIN` role.

---

## 1. `GET /api/v1/admin/users`

### Purpose
Retrieves a paginated list of back-office users with optional search, role filter, status filter, and sorting.

### Authentication & Authorization
- **Auth:** Bearer JWT required
- **Role:** `ADMIN` (`EDITOR` receives `403 FORBIDDEN`)
- **Rate Limit Tier:** `admin` (120 req/min per user)

### Query Parameters
- `page` (number, default: 1)
- `pageSize` (number, default: 20, max: 100)
- `search` (string, optional: email prefix/substring)
- `role` (enum: `ADMIN` | `EDITOR`, optional)
- `isActive` (boolean: `true` | `false`, optional)
- `sort` (enum: `email` | `role` | `createdAt` | `lastLoginAt`, default: `createdAt`)
- `order` (enum: `asc` | `desc`, default: `desc`)

### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "userId": "bef4a6ea-636e-4d9b-8e6b-f3044fb7cf39",
      "email": "admin@spacelegacy.org",
      "role": "ADMIN",
      "isActive": true,
      "createdAt": "2026-11-15T00:38:04.000Z",
      "updatedAt": "2026-11-15T00:38:04.000Z"
    }
  ],
  "meta": {
    "requestId": "cedc1923-c89b-43ee-a0eb-015dad31362e",
    "page": 1,
    "pageSize": 10,
    "total": 3,
    "totalPages": 1
  }
}
```

---

## 2. `POST /api/v1/admin/users`

### Purpose
Creates a new back-office user account.

### Authentication & Authorization
- **Auth:** Bearer JWT required
- **Role:** `ADMIN`

### Request Body
```json
{
  "email": "editor@spacelegacy.org",
  "role": "EDITOR",
  "password": "StrongPassword123!#"
}
```

### Success Response (`201 Created`)
**Header:** `Location: /api/v1/admin/users/<userId>`
```json
{
  "success": true,
  "data": {
    "userId": "9a62a704-b836-48e3-bea3-980def4dbe84",
    "email": "editor@spacelegacy.org",
    "role": "EDITOR",
    "isActive": true,
    "createdAt": "2026-11-15T00:38:05.118Z",
    "updatedAt": "2026-11-15T00:38:05.118Z"
  },
  "meta": {
    "requestId": "2b4a053e-512b-4047-aedc-71dbb8e4b993"
  }
}
```

---

## 3. `GET /api/v1/admin/users/:id`

### Purpose
Retrieves single user details by UUID.

### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "userId": "9a62a704-b836-48e3-bea3-980def4dbe84",
    "email": "editor@spacelegacy.org",
    "role": "EDITOR",
    "isActive": true,
    "createdAt": "2026-11-15T00:38:05.118Z",
    "updatedAt": "2026-11-15T00:38:05.118Z"
  },
  "meta": {
    "requestId": "7ffc524a-0966-4406-84ec-cf96d73cdc11"
  }
}
```

---

## 4. `PATCH /api/v1/admin/users/:id`

### Purpose
Updates user role, active status, or resets password. Guards against demoting or deactivating the last remaining active administrator (`409 CONFLICT`).

---

## 5. `DELETE /api/v1/admin/users/:id`

### Purpose
Deletes a user account. Guards against deleting the last remaining active administrator (`409 CONFLICT`).

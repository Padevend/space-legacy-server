# Auth Module Endpoints

This document describes all session and authentication endpoints under `/api/v1/auth`.

---

## 1. `POST /api/v1/auth/login`

### Purpose
Authenticates administrative and editorial users using email and password with Argon2id verification. Issues a short-lived JWT access token in the response body and a rotated, `HttpOnly`, `SameSite=Strict` refresh token in a cookie.

### Authentication & Authorization
- **Auth:** Public
- **Role:** None
- **Rate Limit Tier:** `loginAttempt` (30 requests per 15 minutes per client IP; 5 consecutive failed attempts lock user account for 15 minutes)

### Request Body
```json
{
  "email": "admin@spacelegacy.org",
  "password": "SuperSecurePassword123!#"
}
```

### Success Response (`200 OK`)
**Headers:**
`Set-Cookie: space_legacy_refresh=...; Path=/api/v1/auth; HttpOnly; SameSite=Strict; Max-Age=604800`

**Body (captured from test suite):**
```json
{
  "success": true,
  "data": {
    "user": {
      "userId": "fc8f59fd-5149-4666-86f7-be21b1a01170",
      "email": "admin@spacelegacy.org",
      "role": "ADMIN",
      "isActive": true,
      "createdAt": "2026-11-15T00:37:09.155Z",
      "updatedAt": "2026-11-15T00:37:09.403Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 900
  },
  "meta": {
    "requestId": "0ade336e-2fc0-4ba0-91f8-74a1c0875fe7"
  }
}
```

### Error Responses
- `401 UNAUTHENTICATED`: `{"success":false,"error":{"code":"UNAUTHENTICATED","message":"Invalid email or password.","status":401,"requestId":"..."}}`
- `422 VALIDATION_ERROR`: Missing or malformed email / password.
- `429 TOO_MANY_REQUESTS`: Rate limit exceeded with `Retry-After` header.

### cURL Example
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"email":"admin@spacelegacy.org","password":"SuperSecurePassword123!#"}'
```

---

## 2. `POST /api/v1/auth/refresh`

### Purpose
Exchanges an active refresh token cookie for a rotated access token and a new refresh token. Implements automatic token reuse detection: if a previously rotated/revoked token is presented, the entire token family is revoked immediately.

### Authentication & Authorization
- **Auth:** Public (authenticated by `space_legacy_refresh` cookie)
- **Role:** None
- **Rate Limit Tier:** `refresh` (60 requests per 15 minutes per IP)
- **CSRF Guard:** Strict origin verification + `X-CSRF-Token` header required.

### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 900
  },
  "meta": {
    "requestId": "69067cc1-422c-421f-b0ec-1e6f74bfa888"
  }
}
```

### Error Responses
- `401 UNAUTHENTICATED`: Refresh token invalid, expired, or reuse detected.
- `403 FORBIDDEN`: Disallowed origin or missing `X-CSRF-Token` header.

### cURL Example
```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Origin: http://localhost:3000" \
  -H "X-CSRF-Token: session-csrf-token" \
  -b "space_legacy_refresh=..."
```

---

## 3. `POST /api/v1/auth/logout`

### Purpose
Terminates the active session family and clears the refresh cookie.

### Authentication & Authorization
- **Auth:** Public / Optional Bearer
- **CSRF Guard:** Strict origin check + `X-CSRF-Token` header required.

### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully."
  },
  "meta": {
    "requestId": "5aa64896-eae4-4224-8e6c-66edd2906500"
  }
}
```

---

## 4. `GET /api/v1/auth/me`

### Purpose
Returns profile information for the currently authenticated user.

### Authentication & Authorization
- **Auth:** Bearer JWT required
- **Role:** `ADMIN` or `EDITOR`

### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "userId": "fc8f59fd-5149-4666-86f7-be21b1a01170",
    "email": "admin@spacelegacy.org",
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2026-11-15T00:37:09.155Z",
    "updatedAt": "2026-11-15T00:37:09.403Z"
  },
  "meta": {
    "requestId": "0b0f0f46-d611-4b9b-af69-8557c13d3f5c"
  }
}
```

---

## 5. `POST /api/v1/auth/change-password`

### Purpose
Changes password for the authenticated user and revokes all other active sessions across all devices.

### Authentication & Authorization
- **Auth:** Bearer JWT required
- **Role:** `ADMIN` or `EDITOR`

### Request Body
```json
{
  "currentPassword": "OldPassword123!#",
  "newPassword": "NewStrongPassword2026!#"
}
```

### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "message": "Password changed successfully. Existing sessions terminated."
  },
  "meta": {
    "requestId": "165f663a-a4ae-4d31-b273-e7758b47d2e5"
  }
}
```

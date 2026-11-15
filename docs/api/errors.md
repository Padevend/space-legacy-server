# API Error Catalog

All failures return HTTP status codes aligned with unified error bodies. The table below documents every possible error code, its trigger conditions, and client mitigation actions.

| Code | Status | Meaning | Client Action |
|---|---|---|---|
| `BAD_REQUEST` | 400 | Malformed JSON or request syntax | Verify JSON payload structure and encoding. |
| `UNAUTHENTICATED` | 401 | Missing, invalid, or expired credentials | Re-authenticate via `/api/v1/auth/login` or refresh access token. |
| `FORBIDDEN` | 403 | Insufficient role or CSRF violation | Verify permissions or required headers (`X-CSRF-Token`). |
| `NOT_FOUND` | 404 | Unknown route or resource ID | Verify URI and resource identifier. |
| `METHOD_NOT_ALLOWED` | 405 | Wrong HTTP verb for route | Check supported HTTP methods in the Route Map. |
| `TIMEOUT` | 408 | Request exceeded processing deadline (15s) | Simplify query filters or retry with backoff. |
| `CONFLICT` | 409 | Unique constraint or state conflict | Resolve slug/key duplication or resolve invalid state transition. |
| `PAYLOAD_TOO_LARGE` | 413 | Request body exceeded limit (1MB default) | Reduce payload size. |
| `UNSUPPORTED_MEDIA_TYPE` | 415 | Content-Type is not application/json | Send `Content-Type: application/json`. |
| `VALIDATION_ERROR` | 422 | Zod schema validation failed on body/params | Check `error.details` for path-specific errors. |
| `ACCOUNT_LOCKED` | 423 | Account locked due to repeated failed logins | Wait for the lockout period to expire before retrying. |
| `TOO_MANY_REQUESTS` | 429 | Rate limit exceeded | Inspect `Retry-After` header and back off. |
| `INTERNAL_ERROR` | 500 | Unhandled server exception | Retry with exponential backoff; report incident with `requestId`. |
| `SERVICE_UNAVAILABLE` | 503 | Database or cache unreachable | System under maintenance or booting. Retry shortly. |

## Example: Validation Error (422)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed.",
    "status": 422,
    "requestId": "48b64e52-19e4-4437-9753-3a78018e6921",
    "details": [
      {
        "path": "body.email",
        "code": "invalid_string",
        "message": "Invalid email address format."
      }
    ]
  }
}
```

## Example: Rate Limit Exceeded (429)

```json
{
  "success": false,
  "error": {
    "code": "TOO_MANY_REQUESTS",
    "message": "Rate limit exceeded. Too many requests. Please try again later.",
    "status": 429,
    "requestId": "c0559d24-30d8-49ee-ae3b-41f22e70395a",
    "retryAfterSeconds": 45
  }
}
```

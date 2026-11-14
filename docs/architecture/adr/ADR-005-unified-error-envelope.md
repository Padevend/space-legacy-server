# ADR-005: Unified Error Envelope and Centralized Exception Mapping

## Status
Accepted

## Context
APIs returning disparate error payloads (e.g., raw HTML on 500, unformatted strings on 404, detailed internal stack traces on database failures, different structures across middleware) leak sensitive internal implementation details, degrade client error handling, and violate the frontend integration contract.

## Decisions

1. **Standard Response Envelope**:
   - Every single API response conforms to a discriminated union:
     ```jsonc
     // Success
     { "success": true, "data": ..., "meta": { "requestId": "..." } }

     // Failure
     {
       "success": false,
       "error": {
         "code": "VALIDATION_ERROR",
         "message": "Human-readable explanation.",
         "status": 422,
         "requestId": "...",
         "details": [ ... ]
       }
     }
     ```

2. **Unified Error Codes**:
   - `BAD_REQUEST` (400)
   - `UNAUTHENTICATED` (401)
   - `FORBIDDEN` (403)
   - `NOT_FOUND` (404)
   - `METHOD_NOT_ALLOWED` (405)
   - `TIMEOUT` (408)
   - `CONFLICT` (409)
   - `PAYLOAD_TOO_LARGE` (413)
   - `UNSUPPORTED_MEDIA_TYPE` (415)
   - `VALIDATION_ERROR` (422)
   - `ACCOUNT_LOCKED` (423)
   - `TOO_MANY_REQUESTS` (429)
   - `INTERNAL_ERROR` (500)
   - `SERVICE_UNAVAILABLE` (503)

3. **Centralized Error Handling**:
   - Global `onError` and `notFound` handlers in Hono catch every unhandled error, framework exception, Prisma failure, and Zod validation issue.
   - Prisma errors are safely mapped:
     - `P2002` (Unique constraint) -> `CONFLICT` (409)
     - `P2025` (Record not found) -> `NOT_FOUND` (404)
     - `P2003` (Foreign key violation) -> `CONFLICT` (409)
     - Connection / timeout failures -> `SERVICE_UNAVAILABLE` (503)
   - In production mode (`NODE_ENV=production`), all 500-level errors mask internal messages with generic descriptions, completely stripping file paths, SQL statements, and stack traces.

## Consequences
- The frontend team can exhaustively match on `error.code`.
- Complete prevention of information leakage via error payloads.

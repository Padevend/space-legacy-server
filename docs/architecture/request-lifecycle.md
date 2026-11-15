# Request Lifecycle and Middleware Order

Every HTTP request enters the Hono engine and executes through a strictly ordered 13-stage middleware pipeline configured in `start/kernel.ts`.

## The 13 Pipeline Stages

```mermaid
flowchart TD
    Req["Incoming HTTP Request"] --> S1["1. Request ID (Generate or validate X-Request-Id)"]
    S1 --> S2["2. Request Logger (Pino structured log start & timer)"]
    S2 --> S3["3. Trusted Proxy (Resolve real client IP from peer/XFF)"]
    S3 --> S4["4. Secure Headers (CSP, nosniff, Referrer, CORP, HSTS)"]
    S4 --> S5["5. CORS (Strict origin allow-list validation)"]
    S5 --> S6["6. Timeout Guard (15s request timeout)"]
    S6 --> S7["7. Body Size Limit (1MB default ceiling; 413 on overflow)"]
    S7 --> S8["8. Content-Type Guard (JSON required for bodies; 415)"]
    S8 --> S9["9. Global Rate Limiter (IP-based ceiling; 429)"]
    S9 --> S10["10. CSRF Guard (Origin check on mutating requests)"]
    S10 --> S11["11. Cache & ETag (Public GET caching headers)"]
    S11 --> S12["12. Route Handler (Auth, validation, controller)"]
    S12 --> S13["13. Unified Error Handler (AppException, 404, 500)"]
```

## Security Invariants
- Rate limiting executes before body parsing to protect against volumetric CPU exhaustion.
- Secure headers and `X-Request-Id` are set on every response, including early error exits.
- Trusted proxy verification prevents client IP spoofing via manipulated `X-Forwarded-For` headers.

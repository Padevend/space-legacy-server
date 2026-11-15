# Legacy Quarantine Policy

## Principles
1. **Never Delete Code**: Features identified as out-of-scope for the current milestone are moved using `git mv` to preserve full commit history and blame.
2. **Strict Isolation**: Code in `legacy/` must never be imported, compiled, or referenced by active application code.
3. **Documentation Precedes Reintegration**: Every parked feature holds a `SPEC.md` and a step-by-step `REINTEGRATION.md`.
4. **Promotion as an Isolated Module**: When promoted back to active scope, a feature is scaffolded as a self-contained MVC slice obeying all modular isolation rules.

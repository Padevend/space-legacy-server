# Contributing to SPACE LEGACY Backend

Thank you for contributing to the SPACE LEGACY backend project.

## Development Workflow

1. **Branching Model**:
   - `main`: Production-ready, deployable code. Tagged with SemVer releases (`vX.Y.Z`).
   - `develop`: Primary integration branch. All features merge into `develop` via pull requests.
   - `feat/<stage>-<slug>`: Feature implementations.
   - `fix/<slug>`, `refactor/<slug>`, `chore/<slug>`, `docs/<slug>`, `test/<slug>`: Non-feature improvements.

2. **Commit Convention**:
   We follow [Conventional Commits](https://www.conventionalcommits.org/):
   - Format: `type(scope): subject`
   - Allowed types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `ci`, `build`, `perf`, `revert`.
   - Subject in English, imperative mood, lowercase, max 72 characters.

3. **Exit Gate Requirement**:
   Before submitting or merging any pull request, the complete verification pipeline must pass:
   ```bash
   pnpm verify
   ```
   This executes: `prisma validate`, `tsc --noEmit`, `eslint .`, `prettier --check`, unit & e2e tests, anti-drift tests, and dependency security audits.

4. **Module Isolation & Architecture Rules**:
   - Every module is a self-contained MVC slice.
   - Modules must never communicate with one another (no cross-module imports, no shared database operations).
   - Cross-module data composition is permitted strictly within query modules (`catalog`, `dashboard`).

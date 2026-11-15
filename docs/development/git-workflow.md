# Git & GitHub Workflow

This document details the branching model, commit conventions, pull request lifecycle, and release processes for the SPACE LEGACY backend.

---

## 1. Branch Strategy

| Branch | Description | Direct Push Allowed | Merged Via |
|---|---|---|---|
| `main` | Production-ready releases. Protected. | No | Release PR from `develop` |
| `develop` | Active integration branch. Protected. | No | Stage PRs |
| `feat/<stage>-<slug>` | Feature implementation branches. | Yes | PR to `develop` |
| `refactor/<slug>` | Architectural refactoring branches. | Yes | PR to `develop` |
| `chore/<slug>` | Governance, maintenance, tooling. | Yes | PR to `develop` |
| `fix/<slug>` | Bug fixes. | Yes | PR to `develop` |
| `hotfix/<slug>` | Critical production fixes branched from `main`. | Yes | PR to `main` & `develop` |

---

## 2. Commit Message Standards (Conventional Commits)

Format: `<type>(<scope>): <subject>`

- **Types**:
  - `feat`: New user or API facing feature
  - `fix`: Bug fix
  - `refactor`: Code restructuring without behavioral change
  - `chore`: Tooling, configs, dependency updates
  - `docs`: Documentation updates
  - `test`: Adding or updating test cases
  - `ci`: CI/CD workflow updates
- **Scope**: Lowercase module or technical area (e.g., `equipment`, `auth`, `router`, `legacy`).
- **Subject**: Imperative present tense, lowercase, max 72 characters, no ending period.

---

## 3. Pull Request & Stage Exit Gate Checklist

Every stage PR must be accompanied by the verification checklist:
1. `pnpm verify` passes (Prisma validate, strict tsc, ESLint boundaries, Prettier check, tests, anti-drift, audit, build).
2. Module isolation tests pass (no cross-module imports, scoped container enforcement).
3. Functional tests exercise the real database and complete middleware chain.
4. Documentation updated (`docs/entities/`, `docs/api/endpoints/`, `routes-map.md`, `openapi.json`).
5. Stage report committed under `docs/development/stage-reports/S<n>.md`.

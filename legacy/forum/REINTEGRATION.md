# Reintegration Guide: Community Forum

## 1. Conditions for Reintegration
- Dedicated editorial and moderation team assigned.
- Anti-spam and automated content moderation service selected.

## 2. Steps to Promote
1. Run `pnpm ace make:module forum`.
2. Add Prisma models `ForumThread` and `ForumPost` with `// module: forum` owner marker.
3. Move quarantined code to `app/modules/forum/`.
4. Register routes in `start/routes.ts`.
5. Add e2e moderation tests.

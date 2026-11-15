# Dashboard Module

## Purpose
Provides back-office overview counters and metrics for the editorial team:
- Total equipment count
- Total missions count
- Total timeline events count
- Total stories count broken down by publication status (`DRAFT`, `REVIEW`, `PUBLISHED`, `ARCHIVED`)
- Total media assets count and count requiring mandatory AI generation labeling
- Total sources and total admin users

## Owned Models
None (read-only query projection module).

## Endpoints
### Public
- None

### Admin
- `GET /api/v1/admin/dashboard`

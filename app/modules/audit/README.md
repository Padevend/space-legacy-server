# Audit Module

## Purpose
Maintains immutable audit records of all administrative actions, mutations, and security events. Implements the `AuditRecorder` contract for middleware recording.

## Owned Models
- `AuditLog`

## Endpoints
- `GET /api/v1/admin/audit-logs` (Administrator role only)

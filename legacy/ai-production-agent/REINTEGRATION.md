# Reintegration Guide: AI Production Agent

## 1. Conditions for Reintegration
- LLM API gateway and quota allocation secured.
- Human-in-the-loop review interface implemented in editorial back-office.

## 2. Steps to Promote
1. Scaffold `agent` module.
2. Implement background job runner (BullMQ / PgBoss).
3. Connect output directly to `stories` service in DRAFT status.

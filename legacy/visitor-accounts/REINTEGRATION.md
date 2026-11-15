# Reintegration Guide: Visitor Accounts

## 1. Conditions for Reintegration
- Legal and privacy policy defined for student accounts.
- Transactional email service configured (e.g. Resend / SendGrid).

## 2. Steps to Promote
1. Extend `auth` module models or create a dedicated `visitors` module.
2. Implement email confirmation flow.
3. Add rate-limited public signup routes.

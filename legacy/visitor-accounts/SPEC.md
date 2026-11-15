# Feature Spec: Visitor Accounts & Public Contributions

## 1. Origin & Objectives
- **Spec Section**: §4.3
- **Purpose**: Public visitor registration, user profiles, personal bookmarks of equipment, and unmoderated suggestions.

## 2. API & Data Sketch
- Endpoints: `POST /api/v1/auth/register`, `POST /api/v1/auth/verify-email`, `GET /api/v1/users/me/bookmarks`
- Tables: `VisitorProfile`, `UserBookmark`

## 3. Security Notes
- CAPTCHA required on registration, email verification loop, token brute force controls, and COPPA compliance considerations for school-age users.

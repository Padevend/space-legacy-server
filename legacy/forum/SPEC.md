# Feature Spec: Community Forum & Social Interactions

## 1. Origin & Objectives
- **Spec Section**: §4.3
- **Purpose**: Allow visitors to discuss equipment, share historical recollections, and submit questions about missions.

## 2. API & Data Sketch
- Endpoints: `GET /api/v1/threads`, `POST /api/v1/threads`, `POST /api/v1/threads/:id/posts`
- Tables: `ForumThread`, `ForumPost`, `PostReaction`

## 3. Security Notes
- High moderation overhead, profanity filtering, anti-spam rate limiting, CSRF protection, and stored XSS sanitization required.

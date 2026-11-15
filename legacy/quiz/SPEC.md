# Feature Spec: Educational Quiz & Scoring

## 1. Origin & Objectives
- **Spec Section**: §4.3, §18
- **Purpose**: Interactive educational quizzes about NASA equipment, landing sites, and mission facts with score tallying.

## 2. API & Data Sketch
- Endpoints: `GET /api/v1/quizzes`, `POST /api/v1/quizzes/:id/submit`
- Tables: `Quiz`, `QuizQuestion`, `QuizSubmission`

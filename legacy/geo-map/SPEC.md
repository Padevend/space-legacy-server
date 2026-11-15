# Feature Spec: 3D Geographic Map & Coordinate Projection

## 1. Origin & Objectives
- **Spec Section**: §4.3, §18
- **Purpose**: Interactive 3D globe / planetary surface rendering with spatial markers for lunar and martian landing sites.

## 2. API & Data Sketch
- Endpoints: `GET /api/v1/geo/markers?body=moon|mars`
- In V1, coordinates (`latitude`, `longitude`, `altitude`) remain part of `Location` and public reads; full 3D tile streaming is deferred.

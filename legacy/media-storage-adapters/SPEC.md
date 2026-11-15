# Feature Spec: Media Storage Adapters (Local / S3)

## 1. Origin & Objectives
- **Spec Section**: §12.4, §19
- **Purpose**: Direct binary file uploads for high-resolution photography, GLTF 3D models, audio, and video files with automatic thumbnailing.
- **V1 Status**: In V1, media stores URLs only. Direct binary file ingestion is parked until storage hosting is finalized.

## 2. API & Data Sketch
- Endpoints: `POST /api/v1/admin/media/upload` (multipart/form-data)
- Storage Drivers: `LocalDiskAdapter`, `S3CompatibleAdapter`

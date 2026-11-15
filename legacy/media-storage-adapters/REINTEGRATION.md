# Reintegration Guide: Media Storage Adapters

## 1. Conditions for Reintegration
- Object storage (AWS S3 / Cloudflare R2 / MinIO) provisioned.
- CDN domain configured for binary asset delivery.

## 2. Steps to Promote
1. Implement storage driver interface in `app/infrastructure/storage/`.
2. Update `media` module to accept multipart upload routes.
3. Add thumbnail generation workers with Sharp.

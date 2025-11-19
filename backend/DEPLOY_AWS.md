# AWS Deployment Guide (ECS / Fargate + MongoDB Atlas)

This document shows a minimal path to deploy the backend and frontend to AWS using ECS (Fargate) and MongoDB Atlas for the database. It focuses on best-practice recommendations and example steps.

1) Build & push images
  - Backend: Dockerfile exists in `backend/` — build image and push to ECR.
  - Frontend: build Next.js production image (or deploy to Vercel/CloudFront).

2) Database
  - Recommended: MongoDB Atlas (managed). Create a cluster and obtain `MONGO_URI`.

3) Secrets & config
  - Store `MONGO_URI`, `JWT_SECRET`, `REDIS_URL`, and other secrets in AWS Secrets Manager or Parameter Store.

4) Redis / Cache
  - Use ElastiCache Redis for caching + background queue storage. Set `REDIS_URL` in env.

5) ECS / Fargate
  - Create an ECS cluster, task definitions for backend & frontend, and services behind an ALB. Set container env from Secrets Manager.
  - Memory: 512-1024 MiB, CPU: 256-1024 depending on load.

6) CI/CD (GitHub Actions example)
  - Build images, push to ECR, then update ECS service via `aws ecs update-service --force-new-deployment`.

7) Additional notes
  - Use S3 + CloudFront for static assets (images). In production move image uploads to S3.
  - Use HTTPS via ALB and ACM certificates.

Example env variables required:
```
MONGO_URI=...
JWT_SECRET=...
REDIS_URL=redis://:password@hostname:6379
DEMO_MODE=false
ORDER_TAX_RATE=0.18
ORDER_SHIPPING_FEE=49
ORDER_FREE_SHIPPING_MIN=750
```
I can also generate an example `taskDefinition.json` and a GitHub Actions workflow file next.

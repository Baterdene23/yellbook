# Lab6: Docker & CI/CD Implementation

## Current Status:

###  Completed
- API (Fastify + Prisma)
- Web (Next.js)
- Database (PostgreSQL)

### TODO:

1. **Docker Setup**
   - Dockerfile for API
   - Dockerfile for Web
   - docker-compose.yml for local development

2. **CI/CD Pipeline (GitHub Actions)**
   - Lint & typecheck
   - Build
   - Test
   - Push to AWS ECR

3. **AWS ECR Integration**
   - Create ECR repositories
   - Push Docker images
   - Tag images with version

4. **Deployment (Kubernetes/ECS)**
   - K8s manifests (optional)
   - Environment configuration

## Files to Create:
- `Dockerfile.api` - API Dockerfile
- `Dockerfile.web` - Web Dockerfile
- `docker-compose.yml` - Local development
- `.github/workflows/ci.yml` - GitHub Actions CI/CD
- `.github/workflows/deploy.yml` - Deploy to AWS ECR


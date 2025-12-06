# YellBook - Монголын Шар Ном

![CI Status](https://github.com/Baterdene23/yellbook/actions/workflows/ci.yml/badge.svg)

ШАР НОМ цахим систем - Монголын байгууллагуудын мэдээллийн сан

## Project Overview

Nx monorepo архитектур ашиглан:
- **Frontend**: Next.js 15 App Router (React 19)
- **Backend**: Fastify + Prisma ORM
- **Database**: PostgreSQL 16
- **Containerization**: Docker multi-stage builds
- **Registry**: AWS ECR
- **CI/CD**: GitHub Actions with Matrix build

## Lab 6 Deliverables

### ✅ Dockerfiles (30 points)
- `Dockerfile.api` - Fastify API multi-stage build
- `Dockerfile.web` - Next.js frontend multi-stage build
- Both use Node.js 20-alpine base
- Production-optimized with minimal layers

### ✅ GitHub Actions CI/CD (30 points)
- **Workflows**: `.github/workflows/ci.yml`
- **Matrix Strategy**: Builds both API and Web apps
- **Stages**:
  1. Lint & Type Check
  2. Docker Build & ECR Push
  3. Security Scan (Trivy)
  4. Health Check

### ✅ AWS ECR Repositories (20 points)
- **Region**: ap-southeast-1
- **API Image**: `754029048634.dkr.ecr.ap-southeast-1.amazonaws.com/yellbook/api`
- **Web Image**: `754029048634.dkr.ecr.ap-southeast-1.amazonaws.com/yellbook/web`
- **Scanning**: Enabled on push

### ✅ Local Sanity Check (10 points)
```bash
# Docker Compose validation
docker-compose up -d
docker-compose ps
# Both services should be healthy
```

### ✅ Documentation (10 points)
- README with setup instructions
- CI badge and deployment info
- ECR repository links

### 🎁 Bonus: Matrix Build Strategy (+10 points)
- Separate matrix jobs for API and Web
- Runs on both `push` and `pull_request` events
- Conditional ECR push only on `push` to main

## ECR Images

Latest images pushed to ECR with git SHA tags:

| App | Repository | Latest Tag |
|-----|-----------|-----------|
| API | `yellbook/api` | [View on ECR](https://console.aws.amazon.com/ecr/repositories/yellbook/api) |
| Web | `yellbook/web` | [View on ECR](https://console.aws.amazon.com/ecr/repositories/yellbook/web) |

## CI/CD Workflow

[![CI Workflow](https://github.com/Baterdene23/yellbook/workflows/ci.yml/badge.svg)](https://github.com/Baterdene23/yellbook/actions)

Latest run: **All stages green** ✅
- lint-and-build: PASS
- docker-build-push (api): PASS
- docker-build-push (web): PASS
- security-scan: PASS
- health-check: PASS

## Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- AWS CLI configured with ECR credentials
- PostgreSQL 16 (or use docker-compose)

### Development

```bash
# Install dependencies
npm install

# Run dev server
npx nx dev @yellbook/web &
npx nx dev @yellbook/api &

# Watch and lint
npx nx lint
npx nx typecheck
```

### Build & Deploy

```bash
# Build for production
npx nx build @yellbook/api
npx nx build @yellbook/web

# Docker build
docker build -f Dockerfile.api -t yellbook/api:latest .
docker build -f Dockerfile.web -t yellbook/web:latest .

# Push to ECR
docker tag yellbook/api:latest 754029048634.dkr.ecr.ap-southeast-1.amazonaws.com/yellbook/api:latest
docker push 754029048634.dkr.ecr.ap-southeast-1.amazonaws.com/yellbook/api:latest

docker tag yellbook/web:latest 754029048634.dkr.ecr.ap-southeast-1.amazonaws.com/yellbook/web:latest
docker push 754029048634.dkr.ecr.ap-southeast-1.amazonaws.com/yellbook/web:latest
```

### Docker Compose

```bash
# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f api
docker-compose logs -f web

# Stop services
docker-compose down
```

## Architecture

```
yellbook/
├── apps/
│   ├── api/              # Fastify backend
│   │   ├── src/
│   │   ├── prisma/       # Database schema & migrations
│   │   └── Dockerfile.api
│   └── web/              # Next.js frontend
│       ├── src/app/
│       ├── src/components/
│       └── Dockerfile.web
├── libs/
│   ├── types/            # Shared TypeScript types
│   └── config/           # Shared configuration
├── .github/
│   └── workflows/ci.yml  # CI/CD pipeline
└── docker-compose.yml
```

## Repository Links

- **GitHub**: https://github.com/Baterdene23/yellbook
- **CI/CD Workflow**: https://github.com/Baterdene23/yellbook/actions/workflows/ci.yml
- **ECR Registry**: https://console.aws.amazon.com/ecr/repositories
npx nx show project yellbook
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/next:app demo
```

To generate a new library, use:

```sh
npx nx g @nx/react:lib mylib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)


[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/next?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

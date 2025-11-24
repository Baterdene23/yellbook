# 🟨 YellBook - Mongolian Yellow Pages

YellBook нь Монголын байгууллагуудын мэдээллийг төвлөрсөн сан болон үнэлгээ системтэй вэбсайт. **Yelp** болон **Монгол Шар Ном**-ын аль алиндаа суурилсан.

## 🏗 Architecture

```
┌─────────────────────────────────────────┐
│ Full-Stack Nx Monorepo                  │
├─────────────────────────────────────────┤
│                                         │
│  Frontend: Next.js 15 (App Router)      │
│  ├── / (Home)                           │
│  ├── /yellow-books (ISR 60s)            │
│  ├── /yellow-books/[id] (SSG + ISR)     │
│  └── /yellow-books/search (SSR)         │
│                                         │
│  Backend: Fastify + Prisma              │
│  ├── GET /yellow-books                  │
│  ├── GET /yellow-books/:id              │
│  ├── GET /yellow-books/categories       │
│  └── POST /reviews                      │
│                                         │
│  Database: PostgreSQL                   │
│  └── 25,000+ businesses                 │
│                                         │
│  Infrastructure:                        │
│  ├── Docker (API & Web)                 │
│  ├── GitHub Actions CI/CD               │
│  └── AWS ECR & EKS (optional)           │
│                                         │
└─────────────────────────────────────────┘
```

##  Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### Development

```bash
# Install dependencies
npm install

# Setup database
cd apps/api
npm run prisma:seed

# Run development servers
npm run dev:api    # Fastify on :3001
npm run dev:web    # Next.js on :3001 (or :3002 if 3001 in use)
```

Visit:
- **API**: http://localhost:3001
- **Web**: http://localhost:3001 (or 3002)

### Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Containers will be available at:
# - API: http://localhost:3001
# - Web: http://localhost:3000
# - DB: localhost:5432
```

## 📋 Features

 **Yellow Books Listing**
- 25,000+ businesses, services, NGOs
- Category-based filtering
- Search functionality
- Location-based view

 **Next.js Performance (Lab5)**
- ISR: `/yellow-books/[id]` - 60s revalidation
- SSG: Static generation with `generateStaticParams`
- SSR: `/yellow-books/search` - dynamic server rendering
- Streaming with Suspense

✅ **Reviews & Ratings (Yelp-style)**
- 1-5 star ratings
- User reviews & comments
- Average rating per business
- On-demand revalidation

✅ **CI/CD & Deployment (Lab6)**
- GitHub Actions pipeline
- Docker containerization
- AWS ECR integration
- Automated testing & builds

## 📁 Project Structure

```
yellbook/
├── apps/
│   ├── api/                    # Fastify backend
│   │   ├── src/
│   │   │   ├── routes/        # API endpoints
│   │   │   ├── plugins/       # CORS, Security
│   │   │   └── trpc/          # tRPC schemas
│   │   └── prisma/            # Database schema
│   │
│   └── web/                    # Next.js frontend
│       ├── src/
│       │   ├── app/           # Pages & layouts
│       │   ├── components/    # UI components
│       │   └── utils/         # API utilities
│       └── next.config.js     # Next.js config
│
├── libs/
│   ├── types/                 # Shared Zod schemas
│   └── config/                # Shared configuration
│
├── Dockerfile.api             # API container
├── Dockerfile.web             # Web container
├── docker-compose.yml         # Local development
└── .github/workflows/ci.yml   # CI/CD pipeline
```

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15, React 18, TailwindCSS |
| **Backend** | Fastify, Node.js 20 |
| **Database** | PostgreSQL, Prisma ORM |
| **Validation** | Zod |
| **Caching** | React Query, Next.js ISR |
| **CI/CD** | GitHub Actions |
| **Deployment** | Docker, AWS ECR |
| **DevTools** | Nx, TypeScript, ESLint |

## 🧪 Lab Implementations

### Lab5: ISR, SSG, SSR
- ✅ ISR implementation (`revalidate = 60`)
- ✅ SSG with `generateStaticParams`
- ✅ SSR for search functionality
- ✅ Streaming with Suspense
- ✅ On-demand revalidation API

### Lab6: Docker & CI/CD
- ✅ Dockerfile for API & Web
- ✅ docker-compose.yml for local development
- ✅ GitHub Actions CI/CD pipeline
- ✅ Linting, type-checking, building
- ✅ AWS ECR integration

## 📊 Performance

- **Lighthouse Score**: Aiming for 90+
- **Core Web Vitals**: Optimized
- **First Contentful Paint**: <2s
- **Largest Contentful Paint**: <2.5s

## 🔐 Environment Variables

### API (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/yellbook
PORT=3001
HOST=localhost
```

### Web (.env.local)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
INTERNAL_BACKEND_URL=http://localhost:3001
```

## 📚 API Endpoints

```
GET   /yellow-books                    # List all businesses
GET   /yellow-books/:id                # Get business detail
GET   /yellow-books/categories         # Get all categories
GET   /reviews/:entryId                # Get reviews
POST  /reviews                         # Submit review
```

## 🐛 Development

```bash
# Run linting
npm run lint

# Type-checking
npm run typecheck

# Build all projects
npm run build

# Run specific project
npm run dev:api
npm run dev:web
```

## 📖 Documentation

- [Lab5 Progress](./LAB5_PROGRESS.md)
- [Lab6 Progress](./LAB6_PROGRESS.md)
- [Performance Report](./perf.md)

## 📄 License

MIT

---

**Built with ❤️ for Mongolian businesses**

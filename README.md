# Шар ном (Yellbook)

Энэ монорепод Nx, Fastify, Prisma, Next.js ашиглан "Шар ном"-ын лавлах мэдээллийн сангийн вэб болон API үйлчилгээ байрлаж байна. Каталогийн бүх байгууллага Prisma + PostgreSQL өгөгдлийн санд хадгалагдаж, API болон вэб апп ижил Zod гэрээгээр (libs/types) өгөгдлөө баталгаажуулдаг.

## Технологи

- [Nx](https://nx.dev/) — workspace, lint/typecheck/build командууд
- [Fastify](https://fastify.dev/) + [tRPC](https://trpc.io/) — API ба real-time query гэрээ
- [Prisma](https://prisma.io/) + PostgreSQL — өгөгдлийн сангийн схем, миграци, seed
- [Next.js 15 App Router](https://nextjs.org/) — фронт-энд
- [TailwindCSS](https://tailwindcss.com/) — UI загварчлал
- [Zod](https://zod.dev/) — API ба вэб талуудын гэрээ нэгтгэх

## Түргэн эхлэх

1. **Хамаарал суулгах**
   ```bash
   npm install
   ```

2. **PostgreSQL сервер асаах** — Docker ашиглавал төслийн root-д байрлах `docker-compose.yml`-ийг ажиллуулна. PostgreSQL 15 контейнер `localhost:5432` дээр `postgres/postgres` нэвтрэх мэдээлэлтэйгээр асна.
   ```bash
   docker compose up -d db
   ```

3. **Орчны хувьсагч тохируулах** — `apps/api/.env.example` файлыг `apps/api/.env` болгон хуулж, шаардлагатай бол хэрэглэгч/нууц үгийг өөрчилнө.

4. **Өгөгдлийн санг бэлдэх** — миграци ажиллуулж, seed хийнэ.
   ```bash
   npm run prisma:migrate -w @yellbook/api
   npm run prisma:seed -w @yellbook/api
   ```

5. **Хөгжүүлэлтийн серверүүд**
   ```bash
   npm run dev:api   # Fastify + tRPC API (http://localhost:3001)
   npm run dev:web   # Next.js фронт-энд (http://localhost:3000)
   ```

   API сервер нь `GET /yellow-books` REST төгсгөлийг болон `/trpc/yellowBook.*` tRPC маршрутуудыг ил гаргана. Вэб тал React Query ашиглан API-тай холбогдоно.

## Полигон командууд

- `npm run lint` — бүх lint дүрэм
- `npm run typecheck` — TypeScript `--noEmit`
- `npm run build` — Nx build (API + Web)

## Төслийн бүтэц

```
apps/
  api/                # Fastify + tRPC API, Prisma схем, миграци, seed
  web/                # Next.js 15 App Router UI
libs/
  types/              # Zod гэрээ болон TypeScript төрлүүд
```

## Visual Studio / Visual Studio Code дээр төслийг нээх

Төслийн бүх эх код нэг Git агуулахад (монорепо) байрладаг тул Visual Studio эсвэл Visual Studio Code дээр нээхэд дараах алхмууд хангалттай.

1. **Node.js суулгах** – `npm install` зэрэг командууд ажиллахын тулд LTS хувилбар (18.x эсвэл 20.x) суулгасан эсэхээ шалгана.
2. **Эх сурвалж авах** – Git агуулахыг `git clone` эсвэл ZIP татаж аваад, эх кодыг локал дискэн дээр байрлуулна.
3. **Visual Studio Code**
   - `File → Open Folder...` командыг ашиглаад агуулахын үндсэн хавтсыг сонгоно.
   - Нэмэлтээр `ms-vscode.vscode-typescript-next`, `esbenp.prettier-vscode`, `Prisma.prisma` зэрэг өргөтгөлүүдийг идэвхжүүлбэл lint, Prisma schema, Tailwind классуудыг санал болгоно.
4. **Visual Studio 2022 (Node.js development workload)**
   - Installer-оор "Node.js development" workload-ыг идэвхжүүлсэн эсэхээ шалгаад `File → Open → Folder...` цэснээс төслийг нээнэ.
   - `package.json` файлыг Solution Explorer дээрээс сонгон баруун товшсоны дараа `Open Command Prompt Here` эсвэл `Open in Terminal`-ыг ажиллуулж npm скриптүүдийг (`npm run dev:api`, `npm run dev:web`) эхлүүлнэ.
   - PostgreSQL орчны хувьсагчийг тохируулахын тулд Solution Explorer дээрх `apps/api/.env.example` файлыг нээн, бүх мөрийг хуулж `apps/api/.env` нэртэй шинэ файл үүсгэнэ (Visual Studio дээр шууд Paste хийж болно).
5. **Хөгжүүлэлтийн серверүүдийг асаах** – README-ийн "Түргэн эхлэх" хэсгийн скриптүүдийг терминалаас ажиллуулж, API (`http://localhost:3001`), вэб (`http://localhost:3000`) серверүүд рүү хандаж ажиллаж буйг шалгана.

Ингэснээр Nx-ийн бүтэц болон Prisma/Next.js төслийн мод бүхэлдээ Visual Studio орчинд харагдаж, ESLint/Prettier тохиргоонууд автоматаар танигдана.

## Prisma ба өгөгдөл

- Prisma схем: `apps/api/prisma/schema.prisma`
- Миграци: `apps/api/prisma/migrations/*`
- Seed: `apps/api/prisma/seed.ts` — 6 байгууллага, категори, tag-уудтай
- Орчны хувьсагчийн жишээ: `apps/api/.env.example`

Өөрчлөлт оруулсны дараа шинэ миграци үүсгэх:
```bash
cd apps/api
npx prisma migrate dev --schema prisma/schema.prisma --name <migration_name>
```

## Лиценз

MIT

# Yellow Book Performance - November 2025

## What Changed
- `/yellow-books` now opts into ISR with `revalidate = 60` and still streams its category and entries sections behind `<Suspense>` so cached shells ship immediately while data refreshes every minute (apps/web/src/app/yellow-books/page.tsx:45,100,109,226,276).
- `/yellow-books/[id]` uses `generateStaticParams` plus cache tags to prerender detail pages and keep them fresh through the `/api/revalidate/yellow-books` endpoint, which can target either the full collection or individual entries (apps/web/src/app/yellow-books/[id]/page.tsx:24,31,45 and apps/web/src/app/api/revalidate/yellow-books/route.ts:19-49).
- `/yellow-books/search` is intentionally SSR-only via `dynamic = "force-dynamic"` with a `MapClient` island that stays client-side; the map block sits inside `<Suspense>` so the list renders while the iframe hydrates (apps/web/src/app/yellow-books/search/page.tsx:4,8,46-58).

## Measurements
Collected from the production build served via `PORT=4300 npm run start -w @yellbook/web` and Lighthouse desktop preset (`npx lighthouse ... --only-categories=performance --preset=desktop --chrome-flags="--headless --no-sandbox --disable-gpu"`). Reports and PNG screenshots live in `tmp/`.

| Route | Perf | TTFB | LCP | Artifacts |
| --- | --- | --- | --- | --- |
| `/yellow-books` | 95 | 158 ms | 0.74 s | `tmp/lighthouse-yellow-books.report.{json,html}`, `tmp/lighthouse-yellow-books.png` |
| `/yellow-books/search` | 100 | 102 ms | 0.60 s | `tmp/lighthouse-yellow-books-search.report.{json,html}`, `tmp/lighthouse-yellow-books-search.png` |

## Why It Helped
- ISR keeps the heavy listing data hot at the edge; combined with Suspense streaming, it cut TTFB for `/yellow-books` to ~158 ms even though API responses sometimes stall locally.
- Search results only fetch once per request and feed both the server-rendered list and the client map, eliminating duplicate queries and letting the map hydrate independently, which lowered LCP to ~0.6 s.
- Detail pages stay static and cache-tagged, so on-demand revalidation updates a single path without a full redeploy, keeping both TTFB and LCP predictable.

## Next Risks
- Local API still returns empty data; rerun Lighthouse with a seeded backend so the reported LCP reflects real content instead of skeletons.
- Automate publishing of the Lighthouse JSON/HTML/PNG artifacts in CI so regressions are caught per PR.
- Wire CMS/back-office saves to `/api/revalidate/yellow-books` so editors do not need to call the endpoint manually and ISR caches never drift beyond the 60 s window.

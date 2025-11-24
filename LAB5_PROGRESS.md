# Lab5: ISR, SSG, SSR Implementation

## Current Status:

###  ISR (Incremental Static Regeneration) - 60 seconds
- `/yellow-books/[id]` - `export const revalidate = 60;`
- Дэлгэрэнгүй хуудас 60 секунд тутамд refresh хийгдэнэ

###  SSG (Static Site Generation) - Partial
- `/yellow-books/[id]` - ISR ашиглана (on-demand revalidate)
- `/` - Dynamic (home page)

###  SSR (Server-Side Rendering) - Dynamic
- `/yellow-books` - useSuspenseQueries ашиглан client-side rendering
- `/yellow-books/search` - could be SSR

## TODO:

1. **Generate Static Pages at Build Time**
   - `/yellow-books/[id]` - generateStaticParams implement
   - Build time дээр бүх байгууллагын pages generate хийх

2. **Search Page - SSR Implementation**
   - `/yellow-books/search` - server component with search params

3. **Streaming (Next.js 13+)**
   - Suspense boundaries ашиглан streaming implement

4. **Revalidation Strategy**
   - revalidatePath() ашиглан on-demand revalidation
   - API route для revalidation

5. **Performance Testing**
   - Lighthouse score measurement
   - Build time tracking

## Files to Update:
- `apps/web/src/app/yellow-books/[id]/page.tsx` - generateStaticParams
- `apps/web/src/app/yellow-books/search/page.tsx` - SSR page
- `apps/web/src/app/api/revalidate/route.ts` - revalidation API


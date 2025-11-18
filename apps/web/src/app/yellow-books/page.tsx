import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import type { Metadata } from "next";

import { ArrowRight, MapPin, Phone, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { OrganizationKind, YellowBookEntry } from "@lib/types";
import { fetchYellowBookCategories, fetchYellowBookList } from "@/utils/trpc";
import {
  CATEGORY_TAG,
  COLLECTION_TAG,
  ORGANIZATION_LABELS,
  createHref,
  normalizeFilters,
  type FilterState,
} from "./_lib/filters";

const HIGHLIGHT_STATS = [
  { value: "25,000+", label: "Баталгаат бүртгэл" },
  { value: "21 аймаг", label: "Монгол улсын хамрах хүрээ" },
  { value: "24/7", label: "Шуурхай хайлт, мэдээлэл" },
] as const;

const FEATURE_CARDS = [
  {
    title: "Түгээмэл хайлт",
    description:
      "Үйлчилгээ, байршил эсвэл байгууллагын нэрээр секундийн дотор хайлт хийж зөв мэдээлэлд хүрээрэй.",
  },
  {
    title: "Шүүлтүүр ба ангилал",
    description: "Категори, байгууллагын төрөл, тэмдэглэгээгээр нарийвчилсан хайлт хийж зөв шийдлээ олоорой.",
  },
  {
    title: "Бүрэн мэдээлэл",
    description:
      "Холбоо барих, цагийн хуваарь, зураглал, сошиал суваг зэрэг бүх мэдээллийг нэг дороос үзнэ.",
  },
] as const;

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Yellow Book Directory",
  description: "Browse verified listings from the yellow book directory.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function YellowBooksPage({ searchParams }: PageProps) {
  const filters = normalizeFilters(await searchParams);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="orb -left-24 top-[-10rem] h-[32rem] w-[32rem] bg-primary/40" />
      <div className="orb right-[-18rem] top-[-6rem] h-[28rem] w-[28rem] bg-secondary/30" />
      <div className="orb bottom-[-12rem] left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 bg-accent/25" />

      <main className="relative z-10 flex min-h-screen flex-col">
        <header className="container mx-auto px-4 pb-16 pt-12">
          <div className="glass-panel flex flex-col gap-8 rounded-[28px] border border-border/70 p-8 shadow-2xl lg:p-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-col gap-4">
                <span className="w-fit rounded-full border border-secondary/50 bg-secondary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
                  Монголын шар ном
                </span>
                <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-foreground md:text-5xl">
                  Шар ном мэдээллийн сан
                </h1>
                <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
                  25,000 гаруй байгууллагын найдвартай мэдээллийг хормын дотор ол. Ангилал, шүүлтүүртэй хайлтын
                  системээр Шар ном танд хэрэгтэй байгууллагын мэдээллийг баталгаатай эх сурвалжаар хүргэнэ.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div>Бүртгэлтэй байгууллага • Төрийн болон хувийн байгууллагууд • 24/7 шуурхай хайлт</div>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {HIGHLIGHT_STATS.map((stat) => (
                  <div
                    key={stat.value}
                    className="rounded-2xl border border-border/60 bg-card/80 p-4 text-center shadow-sm backdrop-blur"
                  >
                    <p className="text-3xl font-semibold text-primary">{stat.value}</p>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <FilterForm filters={filters} />
            <OrganizationFilter filters={filters} />

            <Suspense fallback={<CategoryPillSkeleton />}>
              <CategoryPills filters={filters} />
            </Suspense>
          </div>
        </header>

        <section className="container mx-auto flex w-full flex-1 flex-col gap-16 px-4 pb-20">
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="flex flex-col gap-6">
              <Suspense fallback={<EntriesSkeleton />}>
                <EntriesSection filters={filters} />
              </Suspense>
            </div>
            <aside className="flex flex-col gap-6">
              <div className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur">
                <h2 className="text-lg font-semibold text-foreground">Яагаад Шар ном бэ?</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Хайлтын систем, ангилал, шүүлтүүрүүдийг ашиглан зөв байгууллагаа даруй олно. Холбоо барих, цагийн
                  хуваарь, байршил зэрэг мэдээллийг нэг дороос аваарай.
                </p>
                <Link
                  href="/"
                  prefetch={false}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-secondary hover:text-secondary/80"
                >
                  Нүүр хуудас руу буцах
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>

              <div className="rounded-3xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur">
                <h2 className="text-lg font-semibold text-foreground">Түгээмэл ангиллууд</h2>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li>• Бизнес, үйлчилгээний байгууллагууд</li>
                  <li>• Төрийн болон төрийн бус байгууллагууд</li>
                  <li>• Боловсрол, эрүүл мэнд, IT үйлчилгээ</li>
                  <li>• Байршилтай холбогдсон газрын зураг</li>
                </ul>
              </div>
            </aside>
          </div>

          <section className="glass-panel overflow-hidden rounded-[28px] border border-border/70 p-8 shadow-xl">
            <h2 className="text-2xl font-semibold text-foreground">Хайлтын системийн давуу тал</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {FEATURE_CARDS.map((feature) => (
                <Card key={feature.title} className="border border-border/50 bg-card/70 backdrop-blur">
                  <CardContent className="flex flex-col gap-3 p-6">
                    <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

function FilterForm({ filters }: { filters: FilterState }) {
  return (
    <form className="flex flex-col gap-4 md:flex-row md:items-center" method="get">
      <div className="flex flex-1 items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2 shadow-sm">
        <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
        <input
          type="search"
          name="search"
          defaultValue={filters.search ?? ""}
          placeholder="Байгууллага, үйлчилгээ, байршил..."
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="flex gap-2 md:w-auto">
        <Button type="submit" className="w-full md:w-auto">
          Хайх
        </Button>
      </div>
      {filters.categorySlug ? <input type="hidden" name="category" value={filters.categorySlug} /> : null}
      {filters.organizationType ? (
        <input type="hidden" name="organizationType" value={filters.organizationType} />
      ) : null}
      {filters.tag ? <input type="hidden" name="tag" value={filters.tag} /> : null}
    </form>
  );
}

function OrganizationFilter({ filters }: { filters: FilterState }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {Object.entries(ORGANIZATION_LABELS).map(([kind, label]) => {
        const organizationKind = kind as OrganizationKind;
        const isActive = filters.organizationType === organizationKind;
        const href = createHref(filters, {
          organizationType: isActive ? undefined : organizationKind,
        });

        return (
          <Link key={organizationKind} href={href} prefetch={false}>
            <Button variant={isActive ? "secondary" : "outline"} size="sm">
              {label}
            </Button>
          </Link>
        );
      })}
      {filters.organizationType ? (
        <Link
          href={createHref(filters, { organizationType: undefined })}
          prefetch={false}
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Шүүлтүүр арилгах
        </Link>
      ) : null}
    </div>
  );
}

async function CategoryPills({ filters }: { filters: FilterState }) {
  let categories: Awaited<ReturnType<typeof fetchYellowBookCategories>> = [];

  try {
    categories = await fetchYellowBookCategories({
      cache: "force-cache",
      next: {
        revalidate: 60,
        tags: [CATEGORY_TAG],
      },
    });
  } catch (error) {
    console.error("Failed to load yellow book categories", error);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <CategoryLink href={createHref(filters, { categorySlug: undefined })} active={!filters.categorySlug}>
        Бүх ангилал
      </CategoryLink>
      {categories.map((category) => (
        <CategoryLink
          key={category.id}
          href={createHref(filters, { categorySlug: category.slug })}
          active={filters.categorySlug === category.slug}
        >
          {category.name}
        </CategoryLink>
      ))}
    </div>
  );
}

function CategoryLink({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={cn(
        "inline-flex items-center rounded-full border px-4 py-2 text-sm transition",
        active
          ? "border-transparent bg-secondary text-secondary-foreground shadow"
          : "border-border/60 bg-card text-foreground hover:border-secondary"
      )}
    >
      {children}
    </Link>
  );
}

async function EntriesSection({ filters }: { filters: FilterState }) {
  let entries: YellowBookEntry[] = [];

  try {
    entries = await fetchYellowBookList(filters, {
      cache: "force-cache",
      next: {
        revalidate: 60,
        tags: [COLLECTION_TAG],
      },
    });
  } catch (error) {
    console.error("Failed to load yellow book entries", error);
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border/60 bg-card/60 p-12 text-center">
        <h2 className="text-xl font-semibold text-foreground">Үр дүн олдсонгүй</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Шүүлтүүрээ өөрчилж эсвэл хайлтын түлхүүр үгээ дахин оруулаад үзээрэй.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}

function EntryCard({ entry }: { entry: YellowBookEntry }) {
  const primaryPhone = entry.contacts.find((contact) => contact.type === "phone")?.value;
  const tagList = entry.tags.slice(0, 3);
  const mapUrl = entry.coordinates?.mapUrl;

  return (
    <Card className="border border-border/60 bg-card/80 backdrop-blur">
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="outline" className="rounded-full border-secondary/60 text-xs font-semibold uppercase">
            {entry.category.name}
          </Badge>
          <span className="text-xs font-medium uppercase text-muted-foreground">
            {ORGANIZATION_LABELS[entry.organizationType]}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">{entry.name}</h2>
          <p className="text-sm text-muted-foreground">{entry.summary}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-secondary" aria-hidden />
            {entry.address.streetAddress}, {entry.address.district}
          </span>
          {primaryPhone ? (
            <span className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4 text-secondary" aria-hidden />
              <a href={`tel:${primaryPhone}`} className="hover:text-secondary">
                {primaryPhone}
              </a>
            </span>
          ) : null}
        </div>

        {tagList.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tagList.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="rounded-full px-2 py-1 text-xs">
                #{tag.label}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          {mapUrl ? (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-secondary hover:text-secondary/80"
            >
              Газрын зураг харах
            </a>
          ) : (
            <span className="text-xs text-muted-foreground">Газрын зураг байхгүй</span>
          )}
          <Link href={`/yellow-books/${entry.id}`} prefetch={false} className="ml-auto">
            <Button variant="secondary" size="sm">
              Дэлгэрэнгүй үзэх
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function CategoryPillSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-9 w-24 animate-pulse rounded-full bg-muted/50" />
      ))}
    </div>
  );
}

function EntriesSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="border border-border/40 bg-card/60">
          <CardContent className="space-y-3 p-6">
            <div className="h-4 w-24 animate-pulse rounded-full bg-muted/50" />
            <div className="h-6 w-3/4 animate-pulse rounded bg-muted/50" />
            <div className="h-20 w-full animate-pulse rounded bg-muted/40" />
            <div className="h-4 w-32 animate-pulse rounded-full bg-muted/40" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

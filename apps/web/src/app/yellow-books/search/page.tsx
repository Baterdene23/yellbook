import { Suspense } from "react";
import type { Metadata } from "next";

import MapClient from "@/components/MapClient";
import { fetchYellowBookList } from "@/utils/trpc";
import { normalizeFilters, type FilterState } from "../_lib/filters";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Yellow Book Search",
  description: "Search listings in the yellow book directory.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function YellowBookSearchPage({ searchParams }: PageProps) {
  const filters: FilterState = normalizeFilters(await searchParams);
  const entries = await fetchYellowBookList(filters, { cache: "no-store" });

  const coords = entries
    .map((entry) =>
      entry.coordinates
        ? {
            lat: entry.coordinates.latitude,
            lng: entry.coordinates.longitude,
            label: entry.name,
          }
        : null,
    )
    .filter(Boolean) as { lat: number; lng: number; label: string }[];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Search results</h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          {entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No listings matched your filters.</p>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="rounded-md border p-4">
                  <h3 className="font-semibold">{entry.name}</h3>
                  <p className="text-sm text-muted-foreground">{entry.summary}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <aside>
          <div className="rounded-lg border p-3">
            <h2 className="mb-2 text-sm font-medium">Map preview</h2>
            <Suspense fallback={<div className="h-64">Map loading...</div>}>
              <MapClient coords={coords} />
            </Suspense>
          </div>
        </aside>
      </div>
    </div>
  );
}

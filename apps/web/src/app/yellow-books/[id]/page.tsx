import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone } from "lucide-react";

import type { YellowBookEntry } from "@lib/types";
import { fetchYellowBookList } from "@/utils/trpc";
import { ORGANIZATION_LABELS } from "../_lib/filters";

export const dynamic = "force-static";
export const revalidate = false; // SSG

export const metadata: Metadata = {
  title: "Yellow Book — Дэлгэрэнгүй",
  description: "Байгууллагын дэлгэрэнгүй мэдээлэл",
};

type Params = { id: string };

export async function generateStaticParams() {
  try {
    const entries = await fetchYellowBookList(
      {},
      {
        cache: "force-cache",
        next: {
          revalidate: 60,
        },
      },
    );

    return entries.map((e: YellowBookEntry) => ({ id: e.id }));
  } catch (error) {
    console.error("yellow-books/[id] generateStaticParams failed", error);
    return [];
  }
}

export default async function YellowBookEntryPage({ params }: { params: Params }) {
  const id = params.id;
  const entries = await fetchYellowBookList({}, { cache: "force-cache", next: { revalidate: 60 } });
  const entry = entries.find((e: YellowBookEntry) => e.id === id);

  if (!entry) {
    notFound();
  }

  const primaryPhone = entry.contacts.find((c) => c.type === "phone")?.value;

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="max-w-3xl">
        <Card className="border border-border/60 bg-card/80">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-3">
              <Badge variant="outline" className="rounded-full text-xs font-semibold uppercase">
                {entry.category.name}
              </Badge>
              <span className="text-xs font-medium uppercase text-muted-foreground">
                {ORGANIZATION_LABELS[entry.organizationType]}
              </span>
            </div>

            <h1 className="mt-4 text-2xl font-semibold text-foreground">{entry.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{entry.summary}</p>

            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <div className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-secondary" />
                <span>
                  {entry.address.streetAddress}, {entry.address.district}
                </span>
              </div>
              {primaryPhone ? (
                <div className="inline-flex items-center gap-2">
                  <Phone className="h-4 w-4 text-secondary" />
                  <a href={`tel:${primaryPhone}`} className="text-secondary hover:underline">
                    {primaryPhone}
                  </a>
                </div>
              ) : null}
            </div>

            <div className="mt-6 flex gap-2">
              <Link href="/yellow-books" prefetch={false}>
                <Button variant="ghost">Буцах</Button>
              </Link>
              <a
                href={entry.coordinates?.mapUrl ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="ml-auto inline-flex items-center"
              >
                <Button variant="secondary" size="sm">Газрын зураг</Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}















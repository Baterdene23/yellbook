import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone } from "lucide-react";

import { fetchYellowBookList } from "@/utils/trpc";
import type { YellowBookEntry } from "@lib/types";
import { BusinessListSkeleton } from "@/components/business-list-skeleton";
import YellowBooksMapIsland from "@/components/yellow-books-map";

// Энэ route-ийг заавал SSR болгоно
export const dynamic = "force-dynamic";

async function SearchResults({ query }: { query: string }) {
  const entries = await fetchYellowBookList(
    { search: query },
    {
      // SSR – cache: 'no-store'
      cache: "no-store",
    },
  );

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">
          &quot;{query}&quot; гэсэн хайлтад байгууллага олдсонгүй.
        </p>
        <p className="text-gray-500 mt-2">
          Өөр түлхүүр үгээр хайлт хийнэ үү.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry: YellowBookEntry) => {
        const phoneContact = entry.contacts.find((c) => c.type === "phone");

        return (
          <Link key={entry.id} href={`/yellow-books/${entry.id}`}>
            <Card className="bg-white border-2 border-gray-300 cursor-pointer hover:shadow-lg transition-shadow h-full">
              <CardContent className="p-4">
                <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">
                  {entry.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {entry.summary}
                </p>

                <div className="space-y-2 text-sm">
                  {entry.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 line-clamp-2">
                        {entry.address.district}, {entry.address.province}
                      </span>
                    </div>
                  )}
                  {phoneContact && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-600 flex-shrink-0" />
                      <span className="font-semibold text-gray-800">
                        {phoneContact.value}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-yellow-50 border-b-2 border-yellow-600 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Хайлтын үр дүн
          </h1>
          <p className="text-gray-600">
            {query && `"${query}" түлхүүр үгээр хайсан`}
          </p>
          <Link href="/">
            <Button
              variant="outline"
              className="border-yellow-600 text-yellow-600 hover:bg-yellow-50 mt-4"
            >
              Нүүр рүү буцах
            </Button>
          </Link>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 space-y-10">
        {query ? (
          <>
            <Suspense fallback={<BusinessListSkeleton />}>
              <SearchResults query={query} />
            </Suspense>

            {/* CLIENT MAP ISLAND – хайлтын үр дүнгийн газрын зураг */}
            <Suspense
              fallback={
                <div className="border rounded-lg p-4 text-sm text-gray-500">
                  Газрын зураг ачаалж байна...
                </div>
              }
            >
              <YellowBooksMapIsland query={query} />
            </Suspense>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Түлхүүр үгээ оруулна уу.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

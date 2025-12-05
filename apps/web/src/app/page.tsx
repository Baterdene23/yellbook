import Link from "next/link";
import { Clock, Facebook, Globe, Instagram, Mail, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { fetchYellowBookCategories, fetchYellowBookList } from "@/utils/trpc";
import type { YellowBookEntry } from "@lib/types";
import { SearchBar } from "@/components/search-bar";

export const revalidate = 3600; // ISR - revalidate every hour

export default async function HomePage() {
  let entries: YellowBookEntry[] = [];
  let categories = [];

  try {
    const [entriesData, categoriesData] = await Promise.all([
      fetchYellowBookList({}),
      fetchYellowBookCategories(),
    ]);
    entries = entriesData || [];
    categories = categoriesData || [];
  } catch (error) {
    console.error("Failed to fetch home page data:", error);
    // Fallback to empty data - page will render but with no results
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <header className="border-b-4 border-yellow-600 bg-yellow-50/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-yellow-700 mb-2">ШАР НОМ ЦАХИМ СИСТЕМ</h1>
            <p className="text-lg text-gray-700">Монголын байгууллагуудын мэдээллийн сан • YellBook</p>
            <div className="w-32 h-1 bg-yellow-600 mx-auto mt-4"></div>
          </div>
        </div>
      </header>

      <SearchBar categories={categories} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <p className="text-gray-700 font-semibold">
              Нийт {entries.length} байгууллага
            </p>
          </div>

          <div className="grid gap-4">
            {entries && entries.length > 0 ? (
              entries.map((entry: YellowBookEntry) => {
                const phoneContact = entry.contacts?.find((c) => c.type === "phone");
                const emailContact = entry.contacts?.find((c) => c.type === "email");
                const websiteContact = entry.contacts?.find((c) => c.type === "website");
                const facebookContact = entry.contacts?.find((c) => c.type === "facebook");
                const instagramContact = entry.contacts?.find((c) => c.type === "instagram");
                const mapContact = entry.contacts?.find((c) => c.type === "map");

                return (
                  <Card key={entry.id} className="bg-white border-2 border-gray-300 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row gap-4">
                        <div className="w-24 h-24 bg-yellow-100 flex items-center justify-center rounded font-bold text-gray-600 flex-shrink-0">
                          {entry.name?.substring(0, 2).toUpperCase() || "YB"}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <Link href={`/yellow-books/${entry.id}`}>
                              <h2 className="text-xl font-bold text-gray-800 hover:underline cursor-pointer">
                                {entry.name}
                              </h2>
                            </Link>
                            {entry.category && (
                              <Badge className="bg-yellow-600 text-white">
                                {entry.category.name}
                              </Badge>
                            )}
                          </div>

                          <p className="text-gray-600 mb-3 text-sm">{entry.summary}</p>

                          <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div className="space-y-2">
                              {entry.address && (
                                <div className="flex items-start gap-2">
                                  <MapPin className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
                                  <span className="text-gray-700">
                                    {entry.address.streetAddress}
                                    <br />
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

                            <div className="space-y-2">
                              {emailContact && (
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-gray-600 flex-shrink-0" />
                                  <span className="text-gray-700">{emailContact.value}</span>
                                </div>
                              )}
                              {entry.hours && (
                                <div className="flex items-start gap-2">
                                  <Clock className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
                                  <span className="text-gray-700">{entry.hours}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mt-3">
                            {facebookContact && (
                              <a href={facebookContact.value} target="_blank" rel="noopener noreferrer">
                                <Facebook className="h-4 w-4 text-gray-600 hover:text-yellow-600 cursor-pointer" />
                              </a>
                            )}
                            {instagramContact && (
                              <a href={instagramContact.value} target="_blank" rel="noopener noreferrer">
                                <Instagram className="h-4 w-4 text-gray-600 hover:text-yellow-600 cursor-pointer" />
                              </a>
                            )}
                            {websiteContact && (
                              <a href={websiteContact.value} target="_blank" rel="noopener noreferrer">
                                <Globe className="h-4 w-4 text-gray-600 hover:text-yellow-600 cursor-pointer" />
                              </a>
                            )}
                            {mapContact && (
                              <a href={mapContact.value} target="_blank" rel="noopener noreferrer">
                                <MapPin className="h-4 w-4 text-gray-600 hover:text-yellow-600 cursor-pointer" />
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="lg:w-40 flex lg:flex-col gap-2">
                          {phoneContact && (
                            <a href={`tel:${phoneContact.value}`}>
                              <Button className="w-full bg-yellow-600 text-white hover:bg-yellow-700 text-sm">
                                Дуудах
                              </Button>
                            </a>
                          )}
                          {mapContact && (
                            <a href={mapContact.value} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" className="w-full border-yellow-600 text-yellow-600 hover:bg-yellow-50 text-sm">
                                Чиглэл авах
                              </Button>
                            </a>
                          )}
                          <Link href={`/yellow-books/${entry.id}`}>
                            <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-100 text-sm">
                              Дэлгэрэнгүй
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Байгууллага олдсонгүй.</p>
                <p className="text-gray-500 mt-2">Та дараа дахин оролдоно уу.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-yellow-600 text-white py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="font-bold">Монголын шар ном</p>
          <p className="text-sm mt-1">© 2025 Шар ном. Бүх эрх хүлээлэгдсэн.</p>
        </div>
      </footer>
    </div>
  );
}
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-yellow-700 mb-2">ШАР НОМ ЦАХИМ СИСТЕМ</h1>
            <p className="text-lg text-gray-700">Монголын байгууллагуудын мэдээллийн сан • YellBook</p>
            <div className="w-32 h-1 bg-yellow-600 mx-auto mt-4"></div>
          </div>
        </div>
      </header>

      <section className="bg-gray-100 border-b-2 border-gray-300">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <p className="text-gray-700 font-semibold mb-3">Түлхүүр үгээр хайна уу.</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Байгууллага, үйлчилгээ, байршилаар хайх ..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 border-2 border-gray-300 bg-white"
                />
              </div>
              <Button
                className="bg-yellow-600 text-white hover:bg-yellow-700"
                onClick={handleSearch}
              >
                Хайх
              </Button>
              {searchTerm && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setInputValue("");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Suspense fallback={<CategoryFiltersSkeleton />}>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === undefined ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(undefined)}
                  className={selectedCategory === undefined ? "bg-yellow-600 text-white" : "bg-gray-200"}
                >
                  Бүх үйлчилгээ
                </Button>
                {categories.map((category: YellowBookCategory) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.slug ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.slug)}
                    className={
                      selectedCategory === category.slug
                        ? "bg-yellow-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </Suspense>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <p className="text-gray-700 font-semibold">
              Нийт {entries.length} байгууллага
              {selectedCategory && ` - ${categories.find((c) => c.slug === selectedCategory)?.name}`}
            </p>
          </div>

          <Suspense fallback={<BusinessListSkeleton />}>
            <div className="grid gap-4">
              {entries.map((entry: YellowBookEntry) => {
                const phoneContact = entry.contacts.find((c) => c.type === "phone");
                const emailContact = entry.contacts.find((c) => c.type === "email");
                const websiteContact = entry.contacts.find((c) => c.type === "website");
                const facebookContact = entry.contacts.find((c) => c.type === "facebook");
                const instagramContact = entry.contacts.find((c) => c.type === "instagram");
                const mapContact = entry.contacts.find((c) => c.type === "map");

                return (
                  <Card key={entry.id} className="bg-white border-2 border-gray-300 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row gap-4">
                        <div className="w-24 h-24 bg-yellow-100 flex items-center justify-center rounded font-bold text-gray-600 flex-shrink-0">
                          {entry.name.substring(0, 2).toUpperCase()}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <Link href={`/yellow-books/${entry.id}`}>
                              <h2 className="text-xl font-bold text-gray-800 hover:underline cursor-pointer">
                                {entry.name}
                              </h2>
                            </Link>
                            <Badge className="bg-yellow-600 text-white">
                              {entry.category.name}
                            </Badge>
                          </div>

                          <p className="text-gray-600 mb-3 text-sm">{entry.summary}</p>

                          <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div className="space-y-2">
                              {entry.address && (
                                <div className="flex items-start gap-2">
                                  <MapPin className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
                                  <span className="text-gray-700">
                                    {entry.address.streetAddress}
                                    <br />
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

                            <div className="space-y-2">
                              {emailContact && (
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-gray-600 flex-shrink-0" />
                                  <span className="text-gray-700">{emailContact.value}</span>
                                </div>
                              )}
                              {entry.hours && (
                                <div className="flex items-start gap-2">
                                  <Clock className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
                                  <span className="text-gray-700">{entry.hours}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mt-3">
                            {facebookContact && (
                              <a href={facebookContact.value} target="_blank" rel="noopener noreferrer">
                                <Facebook className="h-4 w-4 text-gray-600 hover:text-yellow-600 cursor-pointer" />
                              </a>
                            )}
                            {instagramContact && (
                              <a href={instagramContact.value} target="_blank" rel="noopener noreferrer">
                                <Instagram className="h-4 w-4 text-gray-600 hover:text-yellow-600 cursor-pointer" />
                              </a>
                            )}
                            {websiteContact && (
                              <a href={websiteContact.value} target="_blank" rel="noopener noreferrer">
                                <Globe className="h-4 w-4 text-gray-600 hover:text-yellow-600 cursor-pointer" />
                              </a>
                            )}
                            {mapContact && (
                              <a href={mapContact.value} target="_blank" rel="noopener noreferrer">
                                <MapPin className="h-4 w-4 text-gray-600 hover:text-yellow-600 cursor-pointer" />
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="lg:w-40 flex lg:flex-col gap-2">
                          {phoneContact && (
                            <Link href={`tel:${phoneContact.value}`}>
                              <Button className="w-full bg-yellow-600 text-white hover:bg-yellow-700 text-sm">
                                Холбоо барих
                              </Button>
                            </Link>
                          )}
                          {mapContact && (
                            <Link href={mapContact.value} target="_blank">
                              <Button variant="outline" className="w-full border-yellow-600 text-yellow-600 hover:bg-yellow-50 text-sm">
                                Байршил
                              </Button>
                            </Link>
                          )}
                          <Link href={`/yellow-books/${entry.id}`}>
                            <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-100 text-sm">
                              Дэлгэрэнгүй
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </Suspense>

          {entries.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Таны хайлтад байгууллага олдсонгүй.</p>
              <p className="text-gray-500 mt-2">Хайлтын нөхцлийг өөрчилж, дахин оролдоно уу.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-yellow-600 text-white py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="font-bold">Монголын шар ном</p>
          <p className="text-sm mt-1">© 2025 Шар ном.</p>
        </div>
      </footer>
    </div>
  );
}

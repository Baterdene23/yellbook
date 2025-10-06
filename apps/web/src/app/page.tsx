"use client";
import { Suspense, useState } from "react"
import { Search, MapPin, Phone, Mail, Globe, Clock, Facebook, Instagram, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useQueryState } from "nuqs";
import { trpc } from "@/utils/trpc";
import { useSuspenseQueries } from "@tanstack/react-query";
import { type Category, type Business } from "@lib/types";
import Link from "next/link";



export default function Index() {
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useQueryState("search", { defaultValue: "" });
  const [selectedCategory, setSelectedCategory] = useQueryState("category", { defaultValue: "All" });
  const [{ data: businesses }, { data: categories }] = useSuspenseQueries({ queries: [trpc.getAllBusinesses.queryOptions({ search: searchTerm, categoryId: selectedCategory }), trpc.getAllCategories.queryOptions()] })



  return (
    <div className="min-h-screen w-full bg-background relative">
      <div className="relative z-10">
        <header className="border-b-2 border-primary bg-card/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="vintage-heading text-4xl md:text-6xl text-primary mb-2">BUSINESS DIRECTORY</h1>
              <p className="vintage-subheading text-lg text-muted-foreground">Your Local Yellow Pages • Est. 1955</p>
              <div className="w-24 h-1 bg-secondary mx-auto mt-4"></div>
            </div>
          </div>
        </header>

        <section className="bg-muted/50 border-b border-border">
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search businesses, services, or locations..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="pl-10 vintage-body bg-input border-border"
                  />
                </div>
                <Button
                  variant="outline"
                  className="vintage-subheading bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
                  onClick={() => setSearchTerm(inputValue)}
                >
                  Search Directory
                </Button>
                {
                  searchTerm !== "" && (
                    <Button variant="destructive" size="sm" onClick={() => setSearchTerm("")}>
                      <X className="h-4 w-4" />
                    </Button>
                  )
                }
              </div>
              <Suspense>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCategory("All")}
                    className="vintage-body bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    All
                  </Button>
                  {categories.map((category: Category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className={`vintage-body ${selectedCategory === category.id
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
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
              <p className="vintage-body text-muted-foreground">
                Showing {businesses.length} businesses
                {selectedCategory !== "All" && ` in ${categories.find((category: Category) => category.id === selectedCategory)?.name}`}
              </p>
            </div>
            <Suspense>
              <div className="grid gap-6">
                {businesses.map((business: Business) => (
                  <Card
                    key={business.id}
                    className="bg-card border-2 border-border shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <h2 className="vintage-heading text-2xl text-primary">{business.name}</h2>
                            <Badge variant="secondary" className="vintage-body bg-secondary text-secondary-foreground">
                              {categories.find((category: Category) => category.id === business.categoryId)?.name}
                            </Badge>
                          </div>

                          <p className="vintage-body text-foreground mb-4 leading-relaxed">{business.description}</p>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-accent flex-shrink-0" />
                                <span className="vintage-body text-sm">{business.address}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-accent flex-shrink-0" />
                                <span className="vintage-body text-sm font-semibold">{business.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-accent flex-shrink-0" />
                                <span className="vintage-body text-sm">{business.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-accent flex-shrink-0" />
                                <span className="vintage-body text-sm text-primary underline">{business.website}</span>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-start gap-2">
                                <Clock className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                <span className="vintage-body text-sm">{business.timetable}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                {business.facebookUrl && (
                                  <Link href={business.facebookUrl}>

                                    <Facebook className="h-4 w-4 text-accent cursor-pointer hover:text-primary" />
                                  </Link>
                                )}
                                {business.instagramUrl && (
                                  <Link href={business.instagramUrl}>
                                    <Instagram className="h-4 w-4 text-accent cursor-pointer hover:text-primary" />
                                  </Link>
                                )}
                                <Link href={business.googleMapUrl}>
                                  <MapPin className="h-4 w-4 text-accent cursor-pointer hover:text-primary" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="lg:w-48 flex lg:flex-col gap-2">
                          <Link href={`tel:${business.phone}`}>
                            <Button className="vintage-subheading bg-primary text-primary-foreground hover:bg-primary/90 flex-1">
                              Call Now
                            </Button>
                          </Link>
                          <Link href={business.googleMapUrl}>
                            <Button
                              variant="outline"
                              className="vintage-subheading border-accent text-accent hover:bg-accent hover:text-accent-foreground flex-1 bg-transparent"
                            >
                              Get Directions
                            </Button>
                          </Link>
                          <Link href={business.website}>
                            <Button
                              variant="outline"
                              className="vintage-subheading border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground flex-1 bg-transparent"
                            >
                              Visit Website
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Suspense>

            {businesses.length === 0 && (
              <div className="text-center py-12">
                <p className="vintage-body text-muted-foreground text-lg">
                  No businesses found matching your search criteria.
                </p>
                <p className="vintage-body text-muted-foreground mt-2">
                  Try adjusting your search terms or category filter.
                </p>
              </div>
            )}
          </div>
        </main>

        <footer className="bg-primary text-primary-foreground border-t-2 border-secondary">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h3 className="vintage-heading text-xl mb-2">Business Directory</h3>
              <p className="vintage-body text-sm opacity-90">
                Connecting communities since 1955 • Your trusted local business guide
              </p>
              <div className="w-16 h-0.5 bg-secondary mx-auto mt-4"></div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Clock,
  Facebook,
  Globe,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Search,
} from "lucide-react";
import { useQueryState } from "nuqs";
import { useSuspenseQueries } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { fetchYellowBookCategories, fetchYellowBookList } from "@/utils/trpc";
import type { OrganizationKind, YellowBookCategory, YellowBookEntry } from "@lib/types";

const organizationTypeLabels: Record<OrganizationKind, string> = {
  BUSINESS: "Хувийн хэвшил",
  GOVERNMENT: "Төрийн байгууллага",
  MUNICIPAL: "Нийслэл / орон нутаг",
  NGO: "Төрийн бус",
  SERVICE: "Үйлчилгээ",
};

export default function Index() {
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useQueryState("search", { defaultValue: "" });
  const [selectedCategory, setSelectedCategory] = useQueryState("category", { defaultValue: "all" });

  const normalizedCategory = selectedCategory === "all" ? undefined : selectedCategory;
  const sanitizedSearch = searchTerm?.trim();

  const [{ data: entries }, { data: categories }] = useSuspenseQueries({
    queries: [
      {
        queryKey: [
          "yellow-books",
          {
            search: sanitizedSearch ?? undefined,
            categorySlug: normalizedCategory,
          },
        ],
        queryFn: () =>
          fetchYellowBookList({
            search: sanitizedSearch ?? undefined,
            categorySlug: normalizedCategory,
          }),
      },
      {
        queryKey: ["yellow-books", "categories"],
        queryFn: () => fetchYellowBookCategories(),
      },
    ],
  });

  useEffect(() => {
    setInputValue(searchTerm ?? "");
  }, [searchTerm]);

  const activeCategoryName = useMemo(
    () =>
      normalizedCategory
        ? categories.find((category: YellowBookCategory) => category.slug === normalizedCategory)?.name
        : undefined,
    [categories, normalizedCategory]
  );

  const highlightStats = [
    { value: "25,000+", label: "Баталгаат бүртгэл" },
    { value: "21 аймаг", label: "Бүсчилсэн мэдээлэл" },
    { value: "24/7", label: "Хүссэн үедээ хай" },
  ];

  const featureCards = [
    {
      title: "Нэг дороос хайлт",
      description: "Үйлчилгээний төрөл, байршил, түлхүүр үгээр ангилан харьцуулж үзэх боломж.",
    },
    {
      title: "Холбоо барихад бэлэн",
      description: "Утас, и-мэйл, байршил, сошиал холбоосуудыг даруй нээж холбоо тогтооно.",
    },
    {
      title: "Оновчтой ангилал",
      description: "Байгууллагуудыг чиглэлээр нь ялган хараарай.",
    },
  ];

  const handleSearch = () => {
    setSearchTerm(inputValue.trim());
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="orb -left-24 top-[-10rem] h-[32rem] w-[32rem] bg-primary/40" />
      <div className="orb right-[-18rem] top-[-6rem] h-[28rem] w-[28rem] bg-secondary/30" />
      <div className="orb bottom-[-12rem] left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 bg-accent/25" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="container mx-auto px-4 pb-32 pt-12">
          <nav className="glass-panel flex flex-col gap-6 rounded-[28px] border border-border/60 p-6 shadow-2xl md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/50">
                ШН
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Монголын шар ном</p>
                <h1 className="text-3xl font-bold md:text-4xl">Шар ном мэдээллийн сан</h1>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-muted-foreground md:gap-6">
              <Link href="#hero" prefetch={false} className="transition hover:text-foreground">
                Нүүр
              </Link>
              <Link href="#search" prefetch={false} className="transition hover:text-foreground">
                Хайлт
              </Link>
              <Link href="#results" prefetch={false} className="transition hover:text-foreground">
                Байгууллагууд
              </Link>
              <Link href="#features" prefetch={false} className="transition hover:text-foreground">
                Давуу талууд
              </Link>
              <Link href="#footer" prefetch={false} className="transition hover:text-foreground">
                Холбоо барих
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="rounded-full border border-border/70 px-5 text-sm font-semibold text-foreground shadow-none hover:border-foreground/40 hover:bg-muted/60">
                Нэвтрэх
              </Button>
              <Button className="rounded-full bg-secondary px-5 text-sm font-semibold text-secondary-foreground shadow-lg shadow-secondary/40 hover:bg-secondary/90">
                Бүртгүүлэх
              </Button>
            </div>
          </nav>

          <section id="hero" className="mt-16 grid gap-12 lg:grid-cols-[3fr_2fr] lg:items-center">
            <div className="flex flex-col gap-8">
              <div className="space-y-5">
                <Badge className="w-fit rounded-full bg-primary/90 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow">
                  Нэг дороос бүх мэдээлэл
                </Badge>
                <h2 className="text-4xl font-bold leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
                  25,000 гаруй байгууллагын найдвартай мэдээллийг хормын дотор ол.
                </h2>
                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                  А-я жагсаалт, чиглэлээр ангилсан хайлтын системээрээ Шар ном таньд хэрэгтэй байгууллагын мэдээллийг баталгаатай эх сурвалжаас хүргэнэ.
                </p>
              </div>
              <div className="flex flex-wrap gap-6">
                {highlightStats.map((stat) => (
                  <div key={stat.label} className="glass-panel flex min-w-[150px] flex-1 flex-col gap-1 rounded-2xl border border-border/70 p-5 text-left">
                    <span className="text-2xl font-semibold text-foreground">{stat.value}</span>
                    <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-secondary" />
                  Бизнес, төрийн болон төрийн бус байгууллагууд
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
                  Хэрэглэхэд хялбар хайлтын туршлага
                </div>
              </div>
            </div>
            <div className="relative" id="search">
              <div className="glass-panel relative flex flex-col gap-4 rounded-[30px] border border-border/60 p-6">
                <div className="absolute -top-8 right-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground shadow-xl shadow-primary/40">
                  А-я
                </div>
                <h3 className="text-xl font-semibold text-foreground">Түлхүүр үгээр хайх</h3>
                <p className="text-sm text-muted-foreground">
                  Байгууллага, үйлчилгээ эсвэл байршлыг оруулаад шууд хайлт хийх боломжтой.
                </p>
                <div className="flex items-center gap-3 rounded-3xl border border-border/70 bg-input/90 p-2 shadow-inner">
                  <Search className="ml-2 h-5 w-5 text-muted-foreground" />
                  <Input
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    placeholder="Байгууллага, үйлчилгээ, байршлыг хайх"
                    className="h-12 flex-1 border-0 bg-transparent text-base text-foreground shadow-none focus-visible:ring-0"
                    aria-label="Шар номоос хайх"
                  />
                  <Button onClick={handleSearch} className="h-12 rounded-full bg-secondary px-5 text-sm font-semibold text-secondary-foreground shadow hover:bg-secondary/90">
                    Хайх
                  </Button>
                  {searchTerm !== "" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full border border-border/60 bg-card text-muted-foreground hover:text-foreground"
                      onClick={() => setSearchTerm("")}
                      aria-label="Хайлтыг арилгах"
                    >
                      ×
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Ангиллын хайлт</span>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCategory("all")}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        selectedCategory === "all"
                          ? "border-transparent bg-primary text-primary-foreground shadow"
                          : "border-border/60 bg-card/80 text-foreground hover:bg-card"
                      }`}
                    >
                      Бүх үйлчилгээ
                    </Button>
                    {categories.map((category: YellowBookCategory) => (
                      <Button
                        key={category.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCategory(category.slug)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                          selectedCategory === category.slug
                            ? "border-transparent bg-secondary text-secondary-foreground shadow"
                            : "border-border/60 bg-card/80 text-foreground hover:bg-card"
                        }`}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </header>

        <main className="flex-1">
          <section id="features" className="container mx-auto px-4 pb-20">
            <div className="grid gap-6 rounded-[32px] bg-muted/50 p-10 backdrop-blur md:grid-cols-3">
              {featureCards.map((feature) => (
                <div key={feature.title} className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm shadow-primary/10">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/80 text-primary-foreground">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="results" className="container mx-auto px-4 pb-24">
            <div className="mx-auto flex max-w-6xl flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-foreground">Хайлтын үр дүн</h2>
                <p className="text-sm text-muted-foreground">
                  Нийт {entries.length} байгууллага
                  {activeCategoryName ? ` – ${activeCategoryName}` : ""}
                  {sanitizedSearch ? ` – “${sanitizedSearch}”` : ""}
                </p>
              </div>

              <div className="grid gap-8">
                {entries.map((entry: YellowBookEntry) => {
                  const initials = entry.name
                    .split(" ")
                    .map((word) => word.charAt(0))
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  const phoneContacts = entry.contacts.filter((contact) => contact.type === "phone");
                  const emailContacts = entry.contacts.filter((contact) => contact.type === "email");
                  const websiteContact = entry.contacts.find((contact) => contact.type === "website");
                  const facebookContact = entry.contacts.find((contact) => contact.type === "facebook");
                  const instagramContact = entry.contacts.find((contact) => contact.type === "instagram");
                  const mapContact = entry.contacts.find((contact) => contact.type === "map");
                  const primaryPhone = phoneContacts[0]?.value;
                  const organizationTypeLabel = organizationTypeLabels[entry.organizationType];

                  return (
                    <Card key={entry.id} className="overflow-hidden rounded-[28px] border border-border/70 bg-card/90 shadow-xl shadow-primary/15 transition hover:-translate-y-1 hover:shadow-2xl">
                      <CardContent className="grid gap-6 p-8 lg:grid-cols-[220px_1fr] lg:items-start">
                        <div className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
                          <div className="relative w-full overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/40 via-accent/40 to-secondary/40 p-6">
                            <div className="flex h-40 w-full items-center justify-center rounded-3xl border border-dashed border-border/70 bg-card/80">
                              <span className="text-3xl font-semibold text-foreground">{initials}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-secondary">
                            <Badge className="rounded-full bg-secondary/90 px-3 py-1 text-xs font-semibold text-secondary-foreground">
                              {organizationTypeLabel}
                            </Badge>
                          </div>
                          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Байгууллагын төрөл</p>
                        </div>
                        <div className="flex flex-col gap-6">
                          <div className="flex flex-col gap-4 border-b border-dashed border-border/70 pb-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="space-y-2">
                              <Badge className="w-fit rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground">
                                {entry.category.name}
                              </Badge>
                              <div className="flex items-center gap-3">
                                <h3 className="text-2xl font-semibold text-foreground">{entry.name}</h3>
                                <Link
                                  href={`/yellow-books/${entry.id}`}
                                  prefetch={false}
                                  className="inline-flex items-center gap-1 text-sm font-semibold text-secondary transition hover:text-secondary/80"
                                >
                                  Дэлгэрэнгүй
                                  <ArrowRight className="h-4 w-4" />
                                </Link>
                              </div>
                              <p className="text-sm leading-relaxed text-muted-foreground">{entry.summary}</p>
                              {entry.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-1">
                                  {entry.tags.map((tag) => (
                                    <Badge key={tag.id} variant="outline" className="rounded-full border-border/60 bg-card px-3 py-1 text-xs">
                                      #{tag.label}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-3 text-sm text-foreground">
                              <div className="flex items-start gap-3">
                                <MapPin className="mt-1 h-4 w-4 text-secondary" />
                                <span>
                                  {entry.address.streetAddress}
                                  <br />
                                  {entry.address.district}, {entry.address.province}
                                </span>
                              </div>
                              {phoneContacts.map((contact, index) => (
                                <div key={`${entry.id}-phone-${index}`} className="flex items-center gap-3">
                                  <Phone className="h-4 w-4 text-secondary" />
                                  <span className="font-semibold">{contact.value}</span>
                                </div>
                              ))}
                              {emailContacts.map((contact, index) => (
                                <div key={`${entry.id}-email-${index}`} className="flex items-center gap-3">
                                  <Mail className="h-4 w-4 text-secondary" />
                                  <Link
                                    href={`mailto:${contact.value}`}
                                    prefetch={false}
                                    className="text-foreground underline-offset-4 hover:underline"
                                  >
                                    {contact.value}
                                  </Link>
                                </div>
                              ))}
                              {websiteContact && (
                                <div className="flex items-center gap-3">
                                  <Globe className="h-4 w-4 text-secondary" />
                                  <Link
                                    href={websiteContact.value}
                                    prefetch={false}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline underline-offset-4 hover:text-secondary"
                                  >
                                    {websiteContact.value.replace(/^https?:\/\//, "")}
                                  </Link>
                                </div>
                              )}
                            </div>
                            <div className="space-y-4 text-sm text-foreground">
                              {entry.hours && (
                                <div className="flex items-start gap-3">
                                  <Clock className="mt-1 h-4 w-4 text-secondary" />
                                  <span>{entry.hours}</span>
                                </div>
                              )}
                              <div className="flex flex-wrap items-center gap-3">
                                {facebookContact && (
                                  <Link
                                    href={facebookContact.value}
                                    prefetch={false}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1.5 text-foreground transition hover:border-secondary hover:text-secondary"
                                  >
                                    <Facebook className="h-4 w-4" /> Facebook
                                  </Link>
                                )}
                                {instagramContact && (
                                  <Link
                                    href={instagramContact.value}
                                    prefetch={false}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1.5 text-foreground transition hover:border-secondary hover:text-secondary"
                                  >
                                    <Instagram className="h-4 w-4" /> Instagram
                                  </Link>
                                )}
                                {mapContact && (
                                  <Link
                                    href={mapContact.value}
                                    prefetch={false}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1.5 text-foreground transition hover:border-secondary hover:text-secondary"
                                  >
                                    <MapPin className="h-4 w-4" /> Газрын зураг
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-3 border-t border-dashed border-border/70 pt-4 md:flex-row md:items-center md:justify-between">
                            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                              Шуурхай холбоо
                            </span>
                            <div className="flex flex-wrap gap-3">
                              {primaryPhone && (
                                <Link href={`tel:${primaryPhone}`} prefetch={false}>
                                  <Button className="rounded-full bg-secondary px-5 text-sm font-semibold text-secondary-foreground shadow hover:bg-secondary/90">
                                    Шууд залгах
                                  </Button>
                                </Link>
                              )}
                              {mapContact && (
                                <Link href={mapContact.value} prefetch={false} target="_blank" rel="noopener noreferrer">
                                  <Button
                                    variant="outline"
                                    className="rounded-full border-secondary px-5 text-sm font-semibold text-secondary hover:bg-secondary/10"
                                  >
                                    Байршил
                                  </Button>
                                </Link>
                              )}
                              {websiteContact && (
                                <Link href={websiteContact.value} prefetch={false} target="_blank" rel="noopener noreferrer">
                                  <Button
                                    variant="outline"
                                    className="rounded-full border-primary px-5 text-sm font-semibold text-primary hover:bg-primary/10"
                                  >
                                    Вэб сайт руу
                                  </Button>
                                </Link>
                              )}
                              <Link href={`/yellow-books/${entry.id}`} prefetch={false}>
                                <Button variant="ghost" className="rounded-full px-5 text-sm font-semibold text-foreground hover:bg-muted/70">
                                  Дэлгэрэнгүй хуудас
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {entries.length === 0 && (
                <div className="glass-panel flex flex-col items-center gap-4 rounded-[28px] border border-dashed border-border/70 px-10 py-16 text-center">
                  <p className="text-2xl font-semibold text-foreground">Таны хайсан мэдээлэл олдсонгүй</p>
                  <p className="max-w-xl text-sm text-muted-foreground">
                    Түлхүүр үгээ өөрчилж, категорийг солих эсвэл үгийн зөв бичгийг шалгаарай. 25,000 гаруй байгууллагын мэдээллийн сангаас таны хайсан үйлчилгээ илүү оновчтой харагдана.
                  </p>
                  <Button
                    variant="ghost"
                    className="rounded-full border border-border/70 bg-card px-6 py-2 text-sm font-semibold hover:border-secondary hover:text-secondary"
                    onClick={() => {
                      setInputValue("");
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                  >
                    Эхнээс нь хайлт эхлэх
                  </Button>
                </div>
              )}
            </div>
          </section>
        </main>

        <footer id="footer" className="border-t border-border/60 bg-primary/40">
          <div className="container mx-auto px-4 py-12">
            <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
              <Badge className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                Монголын шар ном
              </Badge>
              <h3 className="text-2xl font-semibold text-foreground">Хэрэглэгчдийг бизнесүүдтэй нь холбох гүүр</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Баталгаат эх сурвалжаас цуглуулсан мэдээллээр хэрэглэгчдийг найдвартай үйлчилгээтэй холбож, бизнесийн хамтын ажиллагааг идэвхжүүлнэ.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>support@yellbook.mn</span>
                <span className="inline-flex h-1 w-1 rounded-full bg-muted-foreground" />
                <span>+976 7000-0000</span>
              </div>
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground/80">
                © {new Date().getFullYear()} Шар ном. Бүх эрх хуулиар хамгаалагдсан.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

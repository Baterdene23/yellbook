import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  ArrowLeft,
  Clock,
  Facebook,
  Globe,
  Instagram,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { YellowBookEntry } from "@lib/types";

import { fetchYellowBookDetail } from "@/utils/trpc";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const entry = await fetchYellowBookDetail(params.id);
    return {
      title: `${entry.name} · Шар ном`,
      description: entry.summary,
    };
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return {
        title: "Байгууллага олдсонгүй · Шар ном",
      };
    }

    throw error;
  }
}

export default async function YellowBookDetailPage({ params }: { params: { id: string } }) {
  let entry: YellowBookEntry;

  try {
    entry = await fetchYellowBookDetail(params.id);
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      notFound();
    }
    throw error;
  }

  const phoneContacts = entry.contacts.filter((contact) => contact.type === "phone");
  const emailContacts = entry.contacts.filter((contact) => contact.type === "email");
  const websiteContact = entry.contacts.find((contact) => contact.type === "website");
  const facebookContact = entry.contacts.find((contact) => contact.type === "facebook");
  const instagramContact = entry.contacts.find((contact) => contact.type === "instagram");
  const mapContact = entry.contacts.find((contact) => contact.type === "map");

  const primaryPhone = phoneContacts.at(0)?.value;
  const mapEmbedUrl = mapContact?.value ?? entry.coordinates?.mapUrl;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-primary/20">
        <div className="container mx-auto flex items-center justify-between px-4 py-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              prefetch={false}
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-secondary hover:text-secondary"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Нүүр хуудас руу буцах
            </Link>
            <Badge className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
              {entry.category.name}
            </Badge>
          </div>
          <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Шар ном мэдээллийн сан</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold text-foreground">{entry.name}</h1>
            <p className="text-base leading-relaxed text-muted-foreground">{entry.summary}</p>
            {entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline" className="rounded-full border-border/60 bg-card px-3 py-1 text-xs">
                    #{tag.label}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <article className="glass-panel flex flex-col gap-6 rounded-[32px] border border-border/70 bg-card/90 p-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3 text-sm text-foreground">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Байршил</h2>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 text-secondary" />
                    <span>
                      {entry.address.streetAddress}
                      <br />
                      {entry.address.district}, {entry.address.province}
                    </span>
                  </div>
                  {entry.hours && (
                    <div className="flex items-start gap-3">
                      <Clock className="mt-1 h-5 w-5 text-secondary" />
                      <span>{entry.hours}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 text-sm text-foreground">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Холбоо барих</h2>
                  {phoneContacts.map((contact, index) => (
                    <Link key={`${entry.id}-phone-${index}`} href={`tel:${contact.value}`} prefetch={false} className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-secondary" />
                      <span className="font-semibold">{contact.value}</span>
                    </Link>
                  ))}
                  {emailContacts.map((contact, index) => (
                    <Link key={`${entry.id}-email-${index}`} href={`mailto:${contact.value}`} prefetch={false} className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-secondary" />
                      <span>{contact.value}</span>
                    </Link>
                  ))}
                  {websiteContact && (
                    <Link
                      href={websiteContact.value}
                      prefetch={false}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3"
                    >
                      <Globe className="h-4 w-4 text-secondary" />
                      <span>{websiteContact.value.replace(/^https?:\/\//, "")}</span>
                    </Link>
                  )}
                </div>
              </div>

              {entry.description && (
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Дэлгэрэнгүй тайлбар</h2>
                  <p className="text-sm leading-relaxed text-foreground">{entry.description}</p>
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
            </article>

            <aside className="flex flex-col gap-6">
              <Card className="overflow-hidden rounded-[32px] border border-border/70 bg-card/90">
                <CardContent className="space-y-4 p-0">
                  <div className="space-y-4 p-6">
                    <h2 className="text-base font-semibold text-foreground">Шуурхай үйлдлүүд</h2>
                    <div className="flex flex-col gap-3">
                      {primaryPhone && (
                        <Button asChild className="justify-start">
                          <Link href={`tel:${primaryPhone}`} prefetch={false}>
                            <Phone className="mr-2 h-4 w-4" /> Шууд залгах
                          </Link>
                        </Button>
                      )}
                      {websiteContact && (
                        <Button asChild variant="outline" className="justify-start">
                          <Link href={websiteContact.value} prefetch={false} target="_blank" rel="noopener noreferrer">
                            <Globe className="mr-2 h-4 w-4" /> Вэб сайт руу
                          </Link>
                        </Button>
                      )}
                      {mapContact && (
                        <Button asChild variant="outline" className="justify-start">
                          <Link href={mapContact.value} prefetch={false} target="_blank" rel="noopener noreferrer">
                            <MapPin className="mr-2 h-4 w-4" /> Байршил нээх
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                  {mapEmbedUrl ? (
                    <iframe
                      src={mapEmbedUrl}
                      title={`${entry.name} газрын зураг`}
                      className="h-64 w-full border-t border-border/70"
                      loading="lazy"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex h-64 w-full items-center justify-center border-t border-border/70 bg-muted/40 text-sm text-muted-foreground">
                      Газрын зургийн мэдээлэл одоогоор байхгүй байна.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-[32px] border border-border/70 bg-card/90">
                <CardContent className="space-y-3 p-6 text-sm text-muted-foreground">
                  <h2 className="text-base font-semibold text-foreground">Шар ном</h2>
                  <p>
                    Шар ном нь найдвартай, баталгаажсан мэдээллийг хэрэглэгчдэд хүргэх зорилготой. Бид байгууллагуудын
                    мэдээллийг тогтмол шинэчилж, үйлчилгээний чанарт анхаардаг.
                  </p>
                  <p>Санал хүсэлтээ support@yellbook.mn хаягаар илгээгээрэй.</p>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

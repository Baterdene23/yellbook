"use client";

import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import type { YellowBookEntry } from "@lib/types";

type SearchMapIslandProps = {
  entries: YellowBookEntry[];
};

function findFallbackEntry(entries: YellowBookEntry[]) {
  return entries.find((entry) => entry.coordinates?.mapUrl) ?? entries.find((entry) =>
    entry.contacts.some((contact) => contact.type === "map")
  );
}

export function SearchMapIsland({ entries }: SearchMapIslandProps) {
  const initialEntry = useMemo(() => findFallbackEntry(entries), [entries]);
  const [selectedId, setSelectedId] = useState(initialEntry?.id ?? entries[0]?.id);

  if (entries.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-3xl border border-border/60 bg-card/60 text-sm text-muted-foreground">
        Add filters or keywords to see locations here.
      </div>
    );
  }

  const selectedEntry = entries.find((entry) => entry.id === selectedId) ?? initialEntry ?? entries[0];
  const mapUrl =
    selectedEntry.coordinates?.mapUrl ??
    selectedEntry.contacts.find((contact) => contact.type === "map")?.value ??
    "";

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Map preview</h2>
        <span className="text-xs text-muted-foreground">{entries.length} listings</span>
      </div>
      <div className="flex h-72 flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/80 shadow-sm">
        {mapUrl ? (
          <iframe
            key={selectedEntry.id}
            title={`${selectedEntry.name} map preview`}
            src={mapUrl}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-muted-foreground">
            No map link available for {selectedEntry.name}
          </div>
        )}
      </div>
      <div className="grid max-h-56 gap-2 overflow-y-auto pr-1">
        {entries.map((entry) => {
          const isActive = entry.id === selectedEntry.id;
          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => setSelectedId(entry.id)}
              className={cn(
                "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition",
                isActive
                  ? "border-secondary/70 bg-secondary/10 text-foreground"
                  : "border-border/50 bg-card text-muted-foreground hover:border-secondary/70 hover:text-foreground"
              )}
            >
              <span className="flex items-center gap-3 text-sm font-medium">
                <MapPin className="h-4 w-4" aria-hidden />
                {entry.name}
              </span>
              <span className="text-xs text-muted-foreground">{entry.address.district}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

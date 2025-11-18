"use client";

import React from "react";

type Coord = { lat: number; lng: number; label?: string };

export default function MapClient({ coords }: { coords: Coord[] }) {
  if (!coords || coords.length === 0) {
    return <div className="h-64 text-sm text-muted-foreground">Байршилын мэдээлэл байхгүй</div>;
  }

  const first = coords[0];
  const bboxSize = 0.02;
  const left = first.lng - bboxSize;
  const right = first.lng + bboxSize;
  const top = first.lat + bboxSize;
  const bottom = first.lat - bboxSize;
  const iframeSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${first.lat}%2C${first.lng}`;

  return (
    <div>
      <div className="h-64 w-full overflow-hidden rounded-md border">
        <iframe
          title="map"
          src={iframeSrc}
          width="100%"
          height="100%"
          loading="lazy"
          className="border-0"
        />
      </div>

      <ul className="mt-2 space-y-2 text-sm">
        {coords.map((c, i) => (
          <li key={i}>
            <a
              className="text-secondary hover:underline"
              target="_blank"
              rel="noreferrer"
              href={`https://www.openstreetmap.org/?mlat=${c.lat}&mlon=${c.lng}#map=16/${c.lat}/${c.lng}`}
            >
              {c.label ?? `Marker ${i + 1}`}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

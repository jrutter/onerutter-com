"use client";

import { useEffect, useId, useState } from "react";
import type { TravelMapMarker, TravelMapModel } from "@/lib/map-types";

export function TravelMap({ model }: { model: TravelMapModel }) {
  const [active, setActive] = useState<string | null>(null);
  const tipId = useId();
  const marker = model.markers.find((item) => item.name === active) ?? null;
  const cluster = marker ? model.markers.filter((item) => item.cluster === marker.cluster) : [];
  const ordered = cluster.slice().sort((a, b) => {
    if (a.name === marker?.name) return -1;
    if (b.name === marker?.name) return 1;
    if (a.visits !== b.visits) return b.visits - a.visits;
    return a.name.localeCompare(b.name);
  });

  useEffect(() => {
    if (!active) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active]);

  function labelFor(item: TravelMapMarker) {
    const noun = item.visits === 1 ? "trip" : "trips";
    return `${item.name}, ${item.visits} ${noun}`;
  }

  return (
    <figure className="travel-map">
      <p className="vh">{model.placesLabel}</p>
      <div className="travel-map-stage">
        <svg viewBox={`0 0 ${model.width} ${model.height}`} aria-hidden="true">
          <path className="travel-map-ocean" d={model.ocean} />
          {model.countries.map((country) => (
            <path
              key={country.id}
              d={country.d}
              className={country.visited ? "travel-map-visited" : "travel-map-land"}
            />
          ))}
        </svg>
        {model.markers.map((item) => {
          const open = item.name === active;
          return (
            <div
              key={item.name}
              className={open ? "travel-pin-wrap is-open" : "travel-pin-wrap"}
              style={{ left: `${(item.x / model.width) * 100}%`, top: `${(item.y / model.height) * 100}%` }}
              onMouseEnter={() => setActive(item.name)}
              onMouseLeave={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setActive(null);
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setActive(null);
              }}
            >
              <button
                type="button"
                className="travel-pin"
                aria-expanded={open}
                aria-controls={open ? tipId : undefined}
                aria-label={labelFor(item)}
                onClick={() => {
                  const hover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
                  if (hover) {
                    setActive(item.name);
                    return;
                  }
                  setActive((current) => (current === item.name ? null : item.name));
                }}
                onFocus={() => setActive(item.name)}
              >
                <i aria-hidden="true" />
              </button>
              {open ? (
                <div
                  id={tipId}
                  className={`travel-tip ${item.vertical} ${item.horizontal}`}
                  role="region"
                  aria-label={ordered.map((place) => place.name).join(", ")}
                >
                  {ordered.map((place) => (
                    <section key={place.name}>
                      <p className="travel-tip-name">{place.name}</p>
                      <p className="travel-tip-count">
                        {place.visits} {place.visits === 1 ? "trip" : "trips"}
                      </p>
                      <ul>
                        {place.trips.map((trip) => (
                          <li key={trip.slug}>
                            <a href={`#${trip.slug}`}>
                              <span>{trip.title}</span>
                              <span className="travel-tip-when">{trip.when}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </figure>
  );
}

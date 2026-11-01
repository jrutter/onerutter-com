import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { draftsAreVisible } from "@/lib/drafts";
import {
  formatTripWhen,
  getVisibleTrips,
  groupTripsByYear,
  publishedTripStats,
  tripDateTime,
  tripHasPage,
} from "@/lib/trips";
import type { Trip } from "@/lib/trips";

export const metadata: Metadata = {
  title: "Travel",
  description:
    "The offline analog alongside the digital nomad life. Music, discovering new things and places, and travel.",
  alternates: { canonical: "/travel" },
  openGraph: {
    url: "https://onerutter.com/travel",
    title: "Travel — Jake Rutter",
    description: "The offline analog alongside the digital nomad life.",
  },
};

export default async function TravelPage() {
  const trips = await getVisibleTrips();
  const years = groupTripsByYear(trips);
  const stats = publishedTripStats(trips);
  const showingDrafts = draftsAreVisible() && trips.some((trip) => trip.draft);

  return (
    <main id="content">
      <div className="wrap">
        <header className="page-head">
          <p className="kicker">Places</p>
          <h1 className="title">Travel</h1>
          <p className="deck">
            The offline analog alongside the digital nomad life. Music, discovering new things and places, and travel.
          </p>
          {stats ? (
            <p className="travel-stat">
              {stats.count} {stats.count === 1 ? "trip" : "trips"} since {stats.since}
            </p>
          ) : null}
        </header>

        {trips.length === 0 ? (
          <p className="lede">Published trips will show up here.</p>
        ) : (
          <div className="stack-36">
            {showingDrafts ? (
              <p className="proposed">
                Draft albums are visible in local development and on preview deploys. Production leaves them out of the
                site and the sitemap. The sample albums are layout placeholders, not trips.
              </p>
            ) : null}
            <ol className="travel-timeline">
              {years.map((group) => (
                <li key={group.year} className="travel-year">
                  <h2 className="travel-year-label">
                    <time dateTime={group.year}>{group.year}</time>
                  </h2>
                  <ol className="travel-entries">
                    {group.trips.map((trip, index) => (
                      <TripEntry key={trip.slug} trip={trip} preload={group.year === years[0]?.year && index === 0} />
                    ))}
                  </ol>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </main>
  );
}

function TripEntry({ trip, preload }: { trip: Trip; preload: boolean }) {
  const dates = formatTripWhen(trip);
  const linked = tripHasPage(trip);
  const showPlace = Boolean(trip.place) && trip.place !== trip.title;

  return (
    <li className="travel-entry">
      <h3>{linked ? <Link href={`/travel/${trip.slug}`}>{trip.title}</Link> : trip.title}</h3>
      <p className="travel-meta">
        {showPlace ? (
          <>
            <span className="place">{trip.place}</span>
            <span aria-hidden="true">·</span>
          </>
        ) : null}
        <time dateTime={tripDateTime(trip)}>{dates}</time>
        {trip.draft ? <span className="pill pill-draft">Draft</span> : null}
      </p>
      {trip.summary ? <p className="travel-summary">{trip.summary}</p> : null}
      {trip.photos.length > 0 ? (
        <ul className="travel-strip">
          {trip.photos.map((photo, index) => (
            <li key={photo.src}>
              <Link className="travel-thumb" href={`/travel/${trip.slug}?photo=${index + 1}`}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 760px) 30vw, 280px"
                  placeholder="blur"
                  blurDataURL={photo.blurDataURL}
                  preload={preload && index === 0}
                  style={{ objectFit: "cover", objectPosition: "right bottom" }}
                />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="travel-pending">Photos coming soon</p>
      )}
    </li>
  );
}

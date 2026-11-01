import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { draftsAreVisible } from "@/lib/drafts";
import { formatTripDates, getVisibleTrips } from "@/lib/trips";

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
  const [feature, ...rest] = trips;
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
        </header>

        {trips.length === 0 ? (
          <p className="lede">Published trips will show up here.</p>
        ) : (
          <div className="stack-36">
            {showingDrafts ? (
              <p className="proposed">
                Draft albums are visible in local development and on preview deploys. Production leaves them out of the
                site and the sitemap. The sample album is a layout placeholder, not a trip.
              </p>
            ) : null}
            <div className="trip-index">
              {feature ? <TripCard trip={feature} feature preload /> : null}
              {rest.length > 0 ? (
                <div className="trip-grid">
                  {rest.map((trip) => (
                    <TripCard key={trip.slug} trip={trip} />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function TripCard({
  trip,
  feature = false,
  preload = false,
}: {
  trip: Awaited<ReturnType<typeof getVisibleTrips>>[number];
  feature?: boolean;
  preload?: boolean;
}) {
  const dates = formatTripDates(trip.startDate, trip.endDate);

  return (
    <Link className={feature ? "trip-card trip-feature" : "trip-card"} href={`/travel/${trip.slug}`}>
      <div className="trip-cover">
        <Image
          src={trip.cover.src}
          alt=""
          fill
          sizes={feature ? "(max-width: 760px) calc(100vw - 40px), 680px" : "(max-width: 760px) calc(100vw - 40px), 500px"}
          placeholder="blur"
          blurDataURL={trip.cover.blurDataURL}
          preload={preload}
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="trip-copy">
        <p className="kicker">{trip.country}</p>
        <h2>{trip.title}</h2>
        <p className="trip-place">{trip.place}</p>
        <p className="trip-dates">
          <time dateTime={trip.startDate}>{dates}</time>
        </p>
        {trip.draft ? <span className="pill pill-draft">Draft</span> : null}
      </div>
    </Link>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { TripGallery } from "@/components/trip-gallery";
import { formatTripWhen, getPublishedTrips, getVisibleTrip, tripDateTime, tripHasPage, tripPhotoIndex } from "@/lib/trips";
import { siteUrl } from "@/lib/site";

export async function generateStaticParams() {
  const trips = await getPublishedTrips();
  return trips.filter((trip) => tripHasPage(trip)).map((trip) => ({ slug: trip.slug }));
}

// Only generated album slugs are pages. Any other slug 404s. Rendering one
// on demand reads searchParams during static generation and returns a 500.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const trip = await getVisibleTrip(slug);
  if (!trip || !tripHasPage(trip)) return { title: "Trip" };

  const description = trip.summary || `${trip.title}, ${formatTripWhen(trip)}.`;

  return {
    title: trip.title,
    description,
    alternates: { canonical: `/travel/${trip.slug}` },
    robots: trip.draft ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      url: `${siteUrl}/travel/${trip.slug}`,
      title: `${trip.title} — Jake Rutter`,
      description,
      ...(trip.cover
        ? {
            images: [
              {
                url: trip.cover.src,
                width: trip.cover.width,
                height: trip.cover.height,
                alt: trip.cover.alt,
              },
            ],
          }
        : {}),
    },
  };
}

export default async function TripPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ photo?: string | string[] }>;
}) {
  const { slug } = await params;
  const trip = await getVisibleTrip(slug);
  if (!trip || !tripHasPage(trip)) notFound();
  const { photo } = await searchParams;
  const startAt = tripPhotoIndex(photo, trip.photos.length);

  const dates = formatTripWhen(trip);
  const showPlace = Boolean(trip.place) && trip.place !== trip.title;
  const galleryJsonLd =
    trip.photos.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          name: trip.title,
          description: trip.summary || trip.title,
          url: `${siteUrl}/travel/${trip.slug}`,
          contentLocation: trip.place || trip.title,
          author: { "@type": "Person", name: "Jake Rutter", url: siteUrl },
        }
      : null;

  return (
    <main id="content">
      {galleryJsonLd && !trip.draft ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(galleryJsonLd) }} />
      ) : null}
      <div className="wrap">
        {trip.draft ? (
          <p className="draft-banner" role="status">
            <strong>Sample draft.</strong> These frames are generated colour fields, not photographs, and this is not a
            trip Jake took. It shows the album: intro, the photographs (usually three), captions, and the full-screen view.
          </p>
        ) : null}
        <header className="page-head">
          {trip.country ? <p className="kicker">{trip.country}</p> : null}
          <h1 className="title">{trip.title}</h1>
          <p className="trip-dateline">
            {showPlace ? (
              <>
                <span className="place">{trip.place}</span>
                <span aria-hidden="true">·</span>
              </>
            ) : null}
            <time dateTime={tripDateTime(trip)}>{dates}</time>
            {trip.draft ? <span className="pill pill-draft">Draft</span> : null}
          </p>
          {trip.summary ? <p className="trip-intro">{trip.summary}</p> : null}
        </header>
        {trip.body ? (
          <div className="prose">
            <MDXRemote source={trip.body} />
          </div>
        ) : null}
        {trip.photos.length > 0 ? (
          <section aria-label="Photographs">
            <TripGallery photos={trip.photos} startAt={startAt} />
          </section>
        ) : (
          <p className="travel-pending">Photos coming soon</p>
        )}
        <p className="back">
          <Link className="text-link" href="/travel">
            ← All trips
          </Link>
        </p>
      </div>
    </main>
  );
}

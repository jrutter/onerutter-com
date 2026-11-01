import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { TripGallery } from "@/components/trip-gallery";
import { formatTripDates, getPublishedTrips, getVisibleTrip, tripPhotoIndex } from "@/lib/trips";
import { siteUrl } from "@/lib/site";

export async function generateStaticParams() {
  const trips = await getPublishedTrips();
  return trips.map((trip) => ({ slug: trip.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const trip = await getVisibleTrip(slug);
  if (!trip) return { title: "Trip" };

  return {
    title: trip.title,
    description: trip.summary,
    alternates: { canonical: `/travel/${trip.slug}` },
    robots: trip.draft ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      url: `${siteUrl}/travel/${trip.slug}`,
      title: `${trip.title} — Jake Rutter`,
      description: trip.summary,
      images: [
        {
          url: trip.cover.src,
          width: trip.cover.width,
          height: trip.cover.height,
          alt: trip.cover.alt,
        },
      ],
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
  const { photo } = await searchParams;
  const trip = await getVisibleTrip(slug);
  if (!trip) notFound();
  const startAt = tripPhotoIndex(photo, trip.photos.length);

  const dates = formatTripDates(trip.startDate, trip.endDate);
  const galleryJsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: trip.title,
    description: trip.summary,
    url: `${siteUrl}/travel/${trip.slug}`,
    contentLocation: trip.place,
    author: { "@type": "Person", name: "Jake Rutter", url: siteUrl },
  };

  return (
    <main id="content">
      {trip.draft ? null : (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(galleryJsonLd) }} />
      )}
      <div className="wrap">
        {trip.draft ? (
          <p className="draft-banner" role="status">
            <strong>Sample draft.</strong> These frames are generated colour fields, not photographs, and this is not a
            trip Jake took. It shows the album: intro, the photographs (usually three), captions, and the full-screen view.
          </p>
        ) : null}
        <header className="page-head">
          <p className="kicker">{trip.country}</p>
          <h1 className="title">{trip.title}</h1>
          <p className="trip-dateline">
            <span className="place">{trip.place}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={trip.startDate}>{dates}</time>
            {trip.draft ? <span className="pill pill-draft">Draft</span> : null}
          </p>
          <p className="trip-intro">{trip.summary}</p>
        </header>
        {trip.body ? (
          <div className="prose">
            <MDXRemote source={trip.body} />
          </div>
        ) : null}
        <section aria-label="Photographs">
          <TripGallery photos={trip.photos} startAt={startAt} />
        </section>
        <p className="back">
          <Link className="text-link" href="/travel">
            ← All trips
          </Link>
        </p>
      </div>
    </main>
  );
}

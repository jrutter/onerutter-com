import type { MetadataRoute } from "next";
import { getPublishedNotes, getPublishedTags } from "@/lib/notes";
import { siteUrl } from "@/lib/site";
import { getPublishedTrips, tripHasPage } from "@/lib/trips";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/story", "/lab", "/notes", "/hello", "/travel"].map((path) => ({
    url: `${siteUrl}${path || "/"}`,
  }));

  const notes = getPublishedNotes().map((note) => ({
    url: `${siteUrl}/notes/${note.slug}`,
    lastModified: note.updated ?? note.date,
  }));

  const trips = (await getPublishedTrips())
    .filter((trip) => tripHasPage(trip))
    .map((trip) => {
      const lastModified = [trip.endDate, trip.startDate].find((value) => value && value.length === 10);
      return {
        url: `${siteUrl}/travel/${trip.slug}`,
        ...(lastModified ? { lastModified } : {}),
      };
    });

  const tags = getPublishedTags().map((tag) => ({
    url: `${siteUrl}/notes/tag/${tag}`,
  }));

  return [...staticRoutes, ...notes, ...tags, ...trips];
}

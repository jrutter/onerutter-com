import type { MetadataRoute } from "next";
import { getPublishedNotes, getPublishedTags } from "@/lib/notes";
import { siteUrl } from "@/lib/site";
import { getPublishedTrips } from "@/lib/trips";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/story", "/lab", "/notes", "/travel"].map((path) => ({
    url: `${siteUrl}${path || "/"}`,
  }));

  const notes = getPublishedNotes().map((note) => ({
    url: `${siteUrl}/notes/${note.slug}`,
    lastModified: note.updated ?? note.date,
  }));

  const trips = (await getPublishedTrips()).map((trip) => ({
    url: `${siteUrl}/travel/${trip.slug}`,
    lastModified: trip.endDate,
  }));

  const tags = getPublishedTags().map((tag) => ({
    url: `${siteUrl}/notes/tag/${tag}`,
  }));

  return [...staticRoutes, ...notes, ...tags, ...trips];
}

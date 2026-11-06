import type { MetadataRoute } from "next";
import { getPublishedNotes, getPublishedTags } from "@/lib/notes";
import { siteUrl, travelSectionPublic } from "@/lib/site";
import { getPublishedTrips, tripHasPage } from "@/lib/trips";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ["", "/story", "/lab", "/notes", "/hello"];
  if (travelSectionPublic) staticPaths.push("/travel");

  const staticRoutes = staticPaths.map((path) => ({
    url: `${siteUrl}${path || "/"}`,
  }));

  const notes = getPublishedNotes().map((note) => ({
    url: `${siteUrl}/notes/${note.slug}`,
    lastModified: note.updated ?? note.date,
  }));

  // Still read every trip so a bad frontmatter or a GPS photograph fails the build.
  const publishedTrips = await getPublishedTrips();
  const trips = travelSectionPublic
    ? publishedTrips
        .filter((trip) => tripHasPage(trip))
        .map((trip) => {
          const lastModified = [trip.endDate, trip.startDate].find((value) => value && value.length === 10);
          return {
            url: `${siteUrl}/travel/${trip.slug}`,
            ...(lastModified ? { lastModified } : {}),
          };
        })
    : [];

  const tags = getPublishedTags().map((tag) => ({
    url: `${siteUrl}/notes/tag/${tag}`,
  }));

  return [...staticRoutes, ...notes, ...tags, ...trips];
}

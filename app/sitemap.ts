import type { MetadataRoute } from "next";
import { getPublishedNotes, getPublishedTags } from "@/lib/notes";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/story", "/lab", "/notes"].map((path) => ({
    url: `${siteUrl}${path || "/"}`,
  }));

  const notes = getPublishedNotes().map((note) => ({
    url: `${siteUrl}/notes/${note.slug}`,
    lastModified: note.updated ?? note.date,
  }));

  const tags = getPublishedTags().map((tag) => ({
    url: `${siteUrl}/notes/tag/${tag}`,
  }));

  return [...staticRoutes, ...notes, ...tags];
}

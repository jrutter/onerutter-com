import { getPublishedNotes } from "@/lib/notes";
import { siteUrl } from "@/lib/site";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function GET() {
  const notes = getPublishedNotes();
  const items = notes
    .map((note) => {
      const link = `${siteUrl}/notes/${note.slug}`;
      const categories = note.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("");
      return `<item>
        <title>${escapeXml(note.title)}</title>
        <link>${link}</link>
        <guid>${link}</guid>
        <pubDate>${new Date(`${note.date}T00:00:00.000Z`).toUTCString()}</pubDate>
        <description>${escapeXml(note.summary)}</description>
        ${categories}
      </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Notes — Jake Rutter</title>
    <link>${siteUrl}/notes</link>
    <description>Notes by Jake Rutter on technology, the apps he is building, and things he is exploring.</description>
    <language>en-gb</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

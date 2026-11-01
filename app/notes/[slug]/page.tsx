import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { formatNoteDate, getPublishedNotes, getVisibleNote } from "@/lib/notes";
import { siteUrl } from "@/lib/site";

export function generateStaticParams() {
  return getPublishedNotes().map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = getVisibleNote(slug);
  if (!note) return { title: "Note" };

  return {
    title: note.title,
    description: note.summary,
    alternates: { canonical: `/notes/${note.slug}` },
    robots: note.draft ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "article",
      url: `${siteUrl}/notes/${note.slug}`,
      title: note.title,
      description: note.summary,
      publishedTime: note.date,
      tags: note.tags,
    },
  };
}

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = getVisibleNote(slug);
  if (!note) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: note.title,
    datePublished: note.date,
    dateModified: note.updated ?? note.date,
    description: note.summary,
    url: `${siteUrl}/notes/${note.slug}`,
    author: { "@type": "Person", name: "Jake Rutter", url: siteUrl },
  };

  return (
    <main id="content">
      {note.draft ? null : (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      )}
      <div className="wrap prose-page">
        {note.draft ? (
          <p className="draft-banner" role="status">
            <strong>Placeholder draft.</strong> This is not Jake&apos;s writing. It shows the article page: title, date,
            summary, body, and tags.
          </p>
        ) : null}
        <p className="note-meta">
          <time dateTime={note.date}>{formatNoteDate(note.date, "long")}</time>
          {note.draft ? <span className="pill pill-draft">Draft</span> : null}
        </p>
        <h1 className="title">{note.title}</h1>
        <p className="deck">{note.summary}</p>
        <article className="prose">
          <MDXRemote source={note.body} />
        </article>
        {note.tags.length > 0 ? (
          <ul className="tags stack-28">
            {note.tags.map((tag) => (
              <li key={tag}>
                <Link className="tag" href={`/notes/tag/${tag}`}>
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="back">
          <Link className="text-link" href="/notes">
            ← All notes
          </Link>
        </p>
      </div>
    </main>
  );
}

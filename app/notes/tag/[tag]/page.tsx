import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NoteCards } from "@/components/note-cards";
import { getPublishedTags, getVisibleNotes, notesForTag } from "@/lib/notes";

export function generateStaticParams() {
  return getPublishedTags().map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const notes = notesForTag(tag, getVisibleNotes());
  if (notes.length === 0) return { title: "Notes" };
  const title = `Notes tagged ${tag}`;
  return {
    title,
    description: `Notes by Jake Rutter tagged ${tag}.`,
    alternates: { canonical: `/notes/tag/${tag}` },
    robots: notes.every((note) => note.draft) ? { index: false, follow: false } : undefined,
  };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const notes = notesForTag(tag, getVisibleNotes());
  if (notes.length === 0) notFound();

  return (
    <main id="content">
      <div className="wrap">
        <header className="page-head">
          <p className="kicker">
            <Link href="/notes">Notes</Link>
          </p>
          <h1 className="title">{tag}</h1>
          <p className="deck">
            {notes.length} {notes.length === 1 ? "note" : "notes"} tagged {tag}.
          </p>
        </header>
        <div className="stack-36">
          <NoteCards notes={notes} label={`Notes tagged ${tag}`} />
        </div>
      </div>
    </main>
  );
}

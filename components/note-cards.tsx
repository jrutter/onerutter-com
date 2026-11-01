import Link from "next/link";
import { NoteCover } from "@/components/note-cover";
import { NoteDates } from "@/components/note-dates";
import type { Note } from "@/lib/notes";
import { formatReadingTime } from "@/lib/notes";

const featureSizes = "(max-width: 760px) calc(100vw - 40px), 640px";
const cardSizes = "(max-width: 760px) calc(100vw - 40px), 540px";

function NoteTags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <ul className="tags">
      {tags.map((tag) => (
        <li key={tag}>
          <Link className="tag" href={`/notes/tag/${tag}`}>
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function NoteFacts({ note }: { note: Note }) {
  return (
    <p className="note-meta">
      <NoteDates date={note.date} updated={note.updated} />
      <span aria-hidden="true">·</span>
      <span>{formatReadingTime(note.body)}</span>
      {note.draft ? <span className="pill pill-draft">Draft</span> : null}
    </p>
  );
}

function FeaturedNote({ note }: { note: Note }) {
  return (
    <article className="note-feature">
      <div className="note-feature-media">
        <NoteCover note={note} sizes={featureSizes} preload />
      </div>
      <div className="note-feature-body">
        <NoteFacts note={note} />
        <h2>
          <Link href={`/notes/${note.slug}`}>{note.title}</Link>
        </h2>
        <p className="summary">{note.summary}</p>
        <NoteTags tags={note.tags} />
      </div>
    </article>
  );
}

function GridNote({ note }: { note: Note }) {
  return (
    <article className="note-card">
      <div className="note-card-media">
        <NoteCover note={note} sizes={cardSizes} />
      </div>
      <div className="note-card-body">
        <NoteFacts note={note} />
        <h2>
          <Link href={`/notes/${note.slug}`}>{note.title}</Link>
        </h2>
        <NoteTags tags={note.tags} />
      </div>
    </article>
  );
}

export function NoteCards({ notes, label = "Notes" }: { notes: Note[]; label?: string }) {
  if (notes.length === 0) return null;
  const [featured, ...rest] = notes;

  return (
    <section className="notes-board" aria-label={label}>
      <FeaturedNote note={featured} />
      {rest.length > 0 ? (
        <ul className="notes-grid">
          {rest.map((note) => (
            <li key={note.slug}>
              <GridNote note={note} />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

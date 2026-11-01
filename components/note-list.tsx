import Link from "next/link";
import { NoteDates } from "@/components/note-dates";
import type { Note } from "@/lib/notes";

export function NoteList({ notes }: { notes: Note[] }) {
  return (
    <section aria-label="Notes">
      {notes.map((note) => (
        <article className="note" key={note.slug}>
          <p className="note-meta">
            <NoteDates date={note.date} updated={note.updated} />
            {note.draft ? <span className="pill pill-draft">Draft</span> : null}
          </p>
          <h2>
            <Link href={`/notes/${note.slug}`}>{note.title}</Link>
          </h2>
          <p className="summary">{note.summary}</p>
          {note.tags.length > 0 ? (
            <ul className="tags">
              {note.tags.map((tag) => (
                <li key={tag}>
                  <Link className="tag" href={`/notes/tag/${tag}`}>
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </article>
      ))}
    </section>
  );
}

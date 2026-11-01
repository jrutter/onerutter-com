import Link from "next/link";
import { NoteCover } from "@/components/note-cover";
import { NoteDates } from "@/components/note-dates";
import type { Note } from "@/lib/notes";

const thumbSizes = "(max-width: 760px) 80px, 120px";

/**
 * The title is already in the card. Use `coverAlt` when it describes the
 * drawing, and an empty alt when that text only repeats the title.
 */
function coverDescription(note: Pick<Note, "title" | "coverAlt">) {
  const alt = note.coverAlt?.trim() ?? "";
  if (!alt) return "";
  const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  return normalize(alt) === normalize(note.title) ? "" : alt;
}

export function NoteList({ notes }: { notes: Note[] }) {
  return (
    <ul className="home-notes">
      {notes.map((note) => (
        <li key={note.slug}>
          <article className="home-note">
            <div className="home-note-media">
              <NoteCover note={note} sizes={thumbSizes} alt={coverDescription(note)} />
            </div>
            <div className="home-note-body">
              <p className="note-meta">
                <NoteDates date={note.date} updated={note.updated} />
                {note.draft ? <span className="pill pill-draft">Draft</span> : null}
              </p>
              <h3>
                <Link href={`/notes/${note.slug}`}>{note.title}</Link>
              </h3>
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
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}

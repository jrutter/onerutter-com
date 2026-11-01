import type { Metadata } from "next";
import { NoteList } from "@/components/note-list";
import { draftsAreVisible, getVisibleNotes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Notes by Jake Rutter on technology, the apps he is building, and things he is exploring.",
  alternates: { canonical: "/notes" },
  openGraph: {
    url: "https://onerutter.com/notes",
    title: "Notes — Jake Rutter",
    description: "Technology, the apps, and things Jake is exploring.",
  },
};

export default function NotesPage() {
  const notes = getVisibleNotes();
  const showingDrafts = draftsAreVisible() && notes.some((note) => note.draft);

  return (
    <main id="content">
      <div className="wrap">
        <header className="page-head">
          <p className="kicker">Writing</p>
          <h1 className="title">Notes</h1>
          <p className="deck">
            I still write a personal journal almost daily and am starting to get back into blogging. You can follow me
            on Medium and Speedwell.
          </p>
        </header>

        {notes.length === 0 ? (
          <p className="lede">Published notes will show up here.</p>
        ) : (
          <div className="stack-36">
            {showingDrafts ? (
              <p className="proposed">
                Placeholder drafts are visible in local development and on preview deploys. Production leaves them out
                of the site, the RSS feed, and the sitemap.
              </p>
            ) : null}
            <NoteList notes={notes} />
          </div>
        )}
      </div>
    </main>
  );
}

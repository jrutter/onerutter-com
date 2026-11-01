import type { Metadata } from "next";
import { NoteCards } from "@/components/note-cards";
import { NoteFilters } from "@/components/note-filters";
import { draftsAreVisible, getVisibleNotes, getVisibleTags, notesForTag } from "@/lib/notes";

type NotesSearch = { tag?: string | string[] };

function oneTag(value: string | string[] | undefined) {
  const tag = Array.isArray(value) ? value[0] : value;
  const trimmed = tag?.trim();
  return trimmed ? trimmed : undefined;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<NotesSearch>;
}): Promise<Metadata> {
  const tag = oneTag((await searchParams).tag);
  const active = tag && getVisibleTags().includes(tag) ? tag : undefined;
  const description = active
    ? `Notes by Jake Rutter tagged ${active}.`
    : "Notes by Jake Rutter on technology, the apps he is building, and things he is exploring.";

  return {
    title: active ? `Notes tagged ${active}` : "Notes",
    description,
    alternates: { canonical: "/notes" },
    openGraph: {
      url: "https://onerutter.com/notes",
      title: active ? `Notes tagged ${active} — Jake Rutter` : "Notes — Jake Rutter",
      description: active ? description : "Technology, the apps, and things Jake is exploring.",
    },
  };
}

export default async function NotesPage({ searchParams }: { searchParams: Promise<NotesSearch> }) {
  const tag = oneTag((await searchParams).tag);
  const notes = getVisibleNotes();
  const tags = getVisibleTags();
  const active = tag && tags.includes(tag) ? tag : undefined;
  const shown = active ? notesForTag(active, notes) : notes;
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
            {tags.length > 0 ? <NoteFilters tags={tags} active={active} /> : null}
            {tag && !active ? (
              <p className="lede">No notes use that tag.</p>
            ) : (
              <>
                {active ? (
                  <p className="note-filter-status">
                    {shown.length} {shown.length === 1 ? "note" : "notes"} tagged {active}.
                  </p>
                ) : null}
                <NoteCards notes={shown} label={active ? `Notes tagged ${active}` : "Notes"} />
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

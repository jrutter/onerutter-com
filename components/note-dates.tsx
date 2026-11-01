import { formatNoteDate } from "@/lib/notes";

/** The day a note was added, and the revision day when `updated` is set. */
export function NoteDates({ date, updated }: { date: string; updated?: string }) {
  return (
    <>
      <span>
        Added <time dateTime={date}>{formatNoteDate(date)}</time>
      </span>
      {updated ? (
        <span>
          Updated <time dateTime={updated}>{formatNoteDate(updated)}</time>
        </span>
      ) : null}
    </>
  );
}

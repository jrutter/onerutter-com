import Image from "next/image";
import { NotePattern } from "@/components/note-pattern";
import type { Note } from "@/lib/notes";
import { siteUrl } from "@/lib/site";

const coverMark = new URL(siteUrl).host;

export function NoteCover({
  note,
  sizes,
  preload = false,
  alt,
  watermark = true,
}: {
  note: Pick<Note, "title" | "tags" | "cover" | "coverAlt">;
  sizes: string;
  preload?: boolean;
  /** When set, the picture is content. When omitted, a real cover still uses `coverAlt`. */
  alt?: string;
  /** Home thumbs leave this off. */
  watermark?: boolean;
}) {
  const picture = !note.cover ? (
    <NotePattern title={note.title} tags={note.tags} />
  ) : (
    <Image
      className="note-cover-img"
      src={note.cover}
      alt={alt ?? note.coverAlt ?? ""}
      fill
      sizes={sizes}
      preload={preload}
      unoptimized={note.cover.toLowerCase().endsWith(".svg")}
    />
  );

  if (!watermark) return picture;

  return (
    <div className="note-cover-frame">
      {picture}
      <span className="note-cover-mark" aria-hidden="true">
        {coverMark}
      </span>
    </div>
  );
}

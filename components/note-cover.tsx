import Image from "next/image";
import { NotePattern } from "@/components/note-pattern";
import type { Note } from "@/lib/notes";

export function NoteCover({
  note,
  sizes,
  preload = false,
  alt,
}: {
  note: Pick<Note, "title" | "tags" | "cover" | "coverAlt">;
  sizes: string;
  preload?: boolean;
  /** When set, the picture is content. When omitted, a real cover still uses `coverAlt`. */
  alt?: string;
}) {
  if (!note.cover) {
    return <NotePattern title={note.title} tags={note.tags} />;
  }

  const description = alt ?? note.coverAlt ?? "";

  return (
    <Image
      className="note-cover-img"
      src={note.cover}
      alt={description}
      fill
      sizes={sizes}
      preload={preload}
      unoptimized={note.cover.toLowerCase().endsWith(".svg")}
    />
  );
}

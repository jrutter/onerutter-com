import { getVisibleNote } from "@/lib/notes";
import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "A note by Jake Rutter";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = getVisibleNote(slug);
  return renderOg({
    kicker: "Notes",
    title: note?.title ?? "Jake Rutter",
  });
}

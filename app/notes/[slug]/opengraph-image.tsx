import path from "node:path";
import sharp from "sharp";
import { getVisibleNote } from "@/lib/notes";
import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export async function generateImageMetadata({
  params,
}: {
  params?: Promise<{ slug?: string }> | { slug?: string };
}) {
  const resolved = params ? await params : undefined;
  const note = resolved?.slug ? getVisibleNote(resolved.slug) : undefined;
  return [
    {
      id: "cover",
      alt: note?.coverAlt || note?.title || "A note by Jake Rutter",
      size: ogSize,
      contentType: ogContentType,
    },
  ];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = getVisibleNote(slug);
  if (note?.cover) {
    const file = path.join(process.cwd(), "public", note.cover.replace(/^\/+/, ""));
    const png = await sharp(file, { density: 192 })
      .resize(ogSize.width, ogSize.height, { fit: "cover", position: "centre" })
      .png()
      .toBuffer();
    return new Response(new Uint8Array(png), {
      headers: { "Content-Type": "image/png" },
    });
  }

  return renderOg({
    kicker: "Notes",
    title: note?.title ?? "Jake Rutter",
  });
}

import { readFile } from "node:fs/promises";
import { assertTripImage, contentPhotoPath, contentTypeFor } from "@/lib/trip-assets";

export async function GET(_request: Request, context: { params: Promise<{ slug: string; file: string[] }> }) {
  const { slug, file } = await context.params;
  const filePath = contentPhotoPath(slug, file);
  if (!filePath) return new Response(null, { status: 404 });

  try {
    await assertTripImage(filePath);
  } catch {
    return new Response(null, { status: 404 });
  }

  const type = contentTypeFor(filePath);
  if (!type) return new Response(null, { status: 404 });
  const bytes = await readFile(filePath);

  return new Response(bytes, {
    headers: {
      "Content-Type": type,
      "Cache-Control": "public, max-age=86400",
    },
  });
}

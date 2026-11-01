import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { assertNoGps } from "@/lib/gps";

const allowed = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

export function isTripSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function extensionOf(filePath: string) {
  return path.extname(filePath).toLowerCase();
}

export function resolveTripImage(slug: string, src: string) {
  const trimmed = src.trim();
  if (!trimmed || trimmed.includes("..") || trimmed.includes("\\") || trimmed.includes("?") || trimmed.includes("#")) {
    throw new Error(`${src} is not a safe image path`);
  }

  const publicPrefix = `/travel/${slug}/`;
  if (trimmed.startsWith(publicPrefix)) {
    const filePath = path.join(process.cwd(), "public", trimmed);
    return { filePath, url: trimmed };
  }

  if (trimmed.startsWith("/")) {
    throw new Error(`${src} must live in public/travel/${slug}/ or beside content/trips/${slug}/index.mdx`);
  }

  const relative = trimmed.replace(/^\.\//, "");
  const tripDir = path.resolve(process.cwd(), "content", "trips", slug);
  const filePath = path.resolve(tripDir, relative);
  if (filePath !== tripDir && !filePath.startsWith(`${tripDir}${path.sep}`)) {
    throw new Error(`${src} escapes the trip folder`);
  }
  const url = `/trip-photos/${slug}/${relative.split(path.sep).join("/")}`;
  return { filePath, url };
}

export function contentPhotoPath(slug: string, segments: string[]) {
  if (!isTripSlug(slug)) return null;
  if (segments.length === 0) return null;
  if (segments.some((part) => !/^[a-zA-Z0-9._-]+$/.test(part) || part.startsWith("."))) return null;

  const tripDir = path.resolve(process.cwd(), "content", "trips", slug);
  const filePath = path.resolve(tripDir, ...segments);
  if (!filePath.startsWith(`${tripDir}${path.sep}`)) return null;
  if (!allowed.has(extensionOf(filePath))) return null;
  return filePath;
}

export function contentTypeFor(filePath: string) {
  const ext = extensionOf(filePath);
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".avif") return "image/avif";
  return null;
}

export async function assertTripImage(filePath: string) {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    throw new Error(`${filePath} does not exist`);
  }
  if (!allowed.has(extensionOf(filePath))) {
    throw new Error(`${filePath} must be a JPEG, PNG, WebP, or AVIF. Run node scripts/prepare-trip-photos.mjs.`);
  }

  const meta = await sharp(filePath, { failOn: "none" }).metadata();
  assertNoGps(filePath, meta.exif, meta.xmp);
  const width = meta.autoOrient?.width ?? meta.width;
  const height = meta.autoOrient?.height ?? meta.height;
  if (!width || !height) throw new Error(`${filePath} has no readable dimensions`);
  return { width, height };
}

export async function inspectTripImage(filePath: string) {
  const { width, height } = await assertTripImage(filePath);
  const blur = await sharp(filePath, { failOn: "none" })
    .rotate()
    .resize(16, 16, { fit: "inside" })
    .webp({ quality: 40 })
    .toBuffer();

  return {
    width,
    height,
    blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
  };
}

#!/usr/bin/env node
// Resize Jake's photographs, strip location metadata, and scaffold a trip album.
// Originals stay out of the repo. Usage:
//   node scripts/prepare-trip-photos.mjs <slug> <folder-of-photos>

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const MAX_EDGE = 2400;
const LIMIT = 10;
const INPUT_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".tif",
  ".tiff",
  ".heic",
  ".heif",
  ".avif",
]);

const slug = process.argv[2];
const sourceArg = process.argv[3];

if (!slug || !sourceArg || slug === "--help" || slug === "-h") {
  console.error("Usage: node scripts/prepare-trip-photos.mjs <slug> <folder-of-photos>");
  console.error("Example: node scripts/prepare-trip-photos.mjs lisbon-2026 ~/Desktop/lisbon");
  process.exit(1);
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error("Slug must be lowercase kebab-case, like lisbon-2026.");
  process.exit(1);
}

const sourceDir = path.resolve(sourceArg);
if (!fs.existsSync(sourceDir) || !fs.statSync(sourceDir).isDirectory()) {
  console.error(`Folder not found: ${sourceDir}`);
  process.exit(1);
}

const files = fs
  .readdirSync(sourceDir)
  .filter((name) => !name.startsWith(".") && INPUT_EXTENSIONS.has(path.extname(name).toLowerCase()))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

if (files.length === 0) {
  console.error(`No photographs in ${sourceDir}. Use JPEG, PNG, WebP, HEIC, TIFF, or AVIF files in that folder.`);
  process.exit(1);
}

if (files.length > LIMIT) {
  console.error(`Found ${files.length} photographs in ${sourceDir}. An album holds at most ${LIMIT}.`);
  console.error("Choose the ten to keep, put only those in a folder, and run this again.");
  console.error("Rename files if you want a different order. Album order follows the filenames.");
  process.exit(1);
}

const imageDir = path.join(process.cwd(), "public", "travel", slug);
const tripDir = path.join(process.cwd(), "content", "trips", slug);
fs.mkdirSync(imageDir, { recursive: true });
fs.mkdirSync(tripDir, { recursive: true });

const written = [];

for (const [index, name] of files.entries()) {
  const outName = `${String(index + 1).padStart(2, "0")}.jpg`;
  const outPath = path.join(imageDir, outName);
  try {
    await sharp(path.join(sourceDir, name), { failOn: "none" })
      .rotate()
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true, progressive: true })
      .toFile(outPath);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Could not read ${name}. Export it as a JPEG and try again.`);
    console.error(message);
    process.exit(1);
  }

  const meta = await sharp(outPath).metadata();
  if (meta.exif || meta.xmp || meta.iptc) {
    fs.rmSync(outPath, { force: true });
    console.error(`Refusing to keep ${outName}: location or other metadata survived export.`);
    process.exit(1);
  }
  written.push(`/travel/${slug}/${outName}`);
}

const indexPath = path.join(tripDir, "index.mdx");
if (!fs.existsSync(indexPath)) {
  const photos = written
    .map(
      (src) => `  - src: ${src}
    alt: "TODO"
    caption: ""`,
    )
    .join("\n");
  const mdx = `---
title: ""
place: ""
country: ""
startDate: "YYYY-MM-DD"
endDate: "YYYY-MM-DD"
cover: ${written[0]}
summary: ""
draft: true
photos:
${photos}
---
`;
  fs.writeFileSync(indexPath, mdx);
  console.log(`Wrote ${indexPath}`);
} else {
  console.log(`Left existing ${path.relative(process.cwd(), indexPath)} alone.`);
}

console.log(`Wrote ${written.length} photograph${written.length === 1 ? "" : "s"} to public/travel/${slug}/`);
for (const src of written) console.log(`  ${src}`);
console.log("Longest side is at most 2400px. EXIF, XMP, and IPTC — including GPS — are removed.");
console.log("Next: fill in title, place, country, dates, summary, and a real alt for each photo.");
console.log("Keep draft: true until Jake wants the album public. Reorder the photos list to change the sequence.");

#!/usr/bin/env node
// Resize Jake's photographs, burn in a corner watermark, strip location
// metadata, and scaffold a trip album. Originals stay out of the repo.
//
//   node scripts/prepare-trip-photos.mjs <slug> <folder> [--watermark "text"] [--no-watermark]

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const MAX_EDGE = 2400;
const LIMIT = 10;
const USUAL = 3;
const DEFAULT_WATERMARK = "onerutter.com";
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

const { slug, sourceArg, watermarkText, skipWatermark } = parseArgs(process.argv.slice(2));

if (!slug || !sourceArg) {
  console.error("Usage: node scripts/prepare-trip-photos.mjs <slug> <folder-of-photos> [--watermark text] [--no-watermark]");
  console.error('Example: node scripts/prepare-trip-photos.mjs lisbon-2026 ~/Desktop/lisbon');
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
  console.error(`Found ${files.length} photographs in ${sourceDir}. Pick your top ${USUAL}. An album holds at most ${LIMIT}.`);
  console.error("Put only those files in a folder and run this again.");
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
    const resized = await sharp(path.join(sourceDir, name), { failOn: "none" })
      .rotate()
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
      .toBuffer();
    const { width, height } = await sharp(resized).metadata();
    if (!width || !height) throw new Error("missing dimensions after resize");
    let pipeline = sharp(resized);
    if (!skipWatermark) {
      pipeline = pipeline.composite([{ input: watermarkSvg(width, height, watermarkText), top: 0, left: 0 }]);
    }
    await pipeline.jpeg({ quality: 82, mozjpeg: true, progressive: true }).toFile(outPath);
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
if (written.length > USUAL) {
  console.log(`This album has ${written.length} photographs. Three is the usual set; up to ${LIMIT} is allowed.`);
}
console.log("Longest side is at most 2400px. EXIF, XMP, and IPTC — including GPS — are removed.");
if (skipWatermark) console.log("Watermark skipped.");
else console.log(`Watermark "${watermarkText}" is burned into the bottom-right corner.`);
console.log("Next: fill in title, place, country, dates, summary, and a real alt for each photo.");
console.log("Keep draft: true until Jake wants the album public. Reorder the photos list to change the sequence.");

function parseArgs(argv) {
  let watermarkText = DEFAULT_WATERMARK;
  let skipWatermark = false;
  let watermarkSet = false;
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") return { slug: "", sourceArg: "" };
    if (arg === "--no-watermark") {
      skipWatermark = true;
      continue;
    }
    if (arg === "--watermark") {
      const text = argv[++i];
      if (!text || text.startsWith("--")) {
        console.error("--watermark needs the words to burn in, for example --watermark onerutter.com");
        process.exit(1);
      }
      watermarkText = text;
      watermarkSet = true;
      continue;
    }
    if (arg.startsWith("--watermark=")) {
      watermarkText = arg.slice("--watermark=".length);
      watermarkSet = true;
      continue;
    }
    if (arg.startsWith("--")) {
      console.error(`Unknown option ${arg}`);
      process.exit(1);
    }
    positional.push(arg);
  }
  if (skipWatermark && watermarkSet) {
    console.error("Use either --watermark or --no-watermark, not both.");
    process.exit(1);
  }
  if (!skipWatermark && !watermarkText.trim()) {
    console.error("The watermark text is empty.");
    process.exit(1);
  }
  return { slug: positional[0], sourceArg: positional[1], watermarkText: watermarkText.trim(), skipWatermark };
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function watermarkSvg(width, height, text) {
  const fontSize = Math.max(12, Math.round(width * 0.025));
  const margin = Math.max(12, Math.round(width * 0.025));
  const blur = Math.max(0.6, fontSize / 18).toFixed(2);
  const safe = escapeXml(text);
  const x = width - margin;
  const y = height - margin;
  return Buffer.from(`<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="mark-shadow" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1" stdDeviation="${blur}" flood-color="#1b1714" flood-opacity="0.55"/>
    </filter>
  </defs>
  <text x="${x}" y="${y}" text-anchor="end" font-family="sans-serif" font-size="${fontSize}" font-weight="600" fill="#ffffff" fill-opacity="0.6" filter="url(#mark-shadow)">${safe}</text>
</svg>`);
}

#!/usr/bin/env node
// Builds the neutral colour fields used by the sample album.
// These are not photographs and not stock images of places.

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const outDir = path.join(process.cwd(), "public", "travel", "sample-album");
fs.mkdirSync(outDir, { recursive: true });

const frames = [
  {
    name: "01.jpg",
    w: 1600,
    h: 1066,
    bg: "#1e4a42",
    ink: "#fbf7f1",
    shapes: `<circle cx="1240" cy="260" r="210" fill="#c45c32"/><rect x="120" y="760" width="240" height="12" fill="#e2a15a"/>`,
  },
  {
    name: "02.jpg",
    w: 1600,
    h: 1100,
    bg: "#c45c32",
    ink: "#fbf7f1",
    shapes: `<rect x="980" y="140" width="420" height="420" fill="#1e4a42"/><circle cx="280" cy="820" r="90" fill="#e2a15a"/>`,
  },
  {
    name: "03.jpg",
    w: 1100,
    h: 1500,
    bg: "#14352f",
    ink: "#f6e2c4",
    shapes: `<circle cx="550" cy="420" r="180" fill="#e2a15a"/><rect x="140" y="980" width="16" height="320" fill="#c45c32"/>`,
  },
  {
    name: "04.jpg",
    w: 1600,
    h: 1000,
    bg: "#e7e0d4",
    ink: "#1b1714",
    shapes: `<rect x="0" y="0" width="280" height="1000" fill="#1e4a42"/><circle cx="1180" cy="280" r="140" fill="#c45c32"/>`,
  },
  {
    name: "05.jpg",
    w: 1400,
    h: 1400,
    bg: "#8e3b22",
    ink: "#fbf7f1",
    shapes: `<circle cx="700" cy="700" r="280" fill="none" stroke="#f6e2c4" stroke-width="18"/><rect x="180" y="180" width="160" height="160" fill="#1e4a42"/>`,
  },
  {
    name: "06.jpg",
    w: 1600,
    h: 1066,
    bg: "#f6e2c4",
    ink: "#1b1714",
    shapes: `<rect x="160" y="180" width="520" height="700" fill="#1e4a42"/><circle cx="1180" cy="760" r="150" fill="#c45c32"/>`,
  },
];

for (const frame of frames) {
  const label = frame.name.replace(".jpg", "");
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${frame.w}" height="${frame.h}" viewBox="0 0 ${frame.w} ${frame.h}">
  <rect width="100%" height="100%" fill="${frame.bg}"/>
  ${frame.shapes}
  <rect x="28" y="28" width="${frame.w - 56}" height="${frame.h - 56}" fill="none" stroke="${frame.ink}" stroke-opacity="0.35" stroke-width="2"/>
  <text x="72" y="${frame.h - 132}" fill="${frame.ink}" font-family="sans-serif" font-size="64" font-weight="600" letter-spacing="3">SAMPLE ${label}</text>
  <text x="72" y="${frame.h - 78}" fill="${frame.ink}" font-family="sans-serif" font-size="28" opacity="0.8">Placeholder colour field. Not a photograph.</text>
</svg>`;
  const outPath = path.join(outDir, frame.name);
  await sharp(Buffer.from(svg)).jpeg({ quality: 82, mozjpeg: true }).toFile(outPath);
  const meta = await sharp(outPath).metadata();
  if (meta.exif || meta.xmp || meta.iptc) {
    throw new Error(`${frame.name} kept metadata`);
  }
  console.log(`${frame.name} ${meta.width}x${meta.height}`);
}

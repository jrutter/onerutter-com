#!/usr/bin/env node
// Draws the neutral colour fields for the sample albums, then runs
// prepare-trip-photos.mjs so the committed JPEGs carry the real watermark.
// These are not photographs and not places Jake has been.

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const albums = [
  {
    slug: "sample-album",
    title: "Sample album",
    place: "No particular place",
    start: "2026-06-01",
    end: "2026-06-07",
    summary: "A layout sample for the travel timeline. These frames are generated colour fields, not photographs from a trip.",
    frames: [
      { bg: "#1e4a42", ink: "#fbf7f1", ground: "Thames green", shape: "circle", accent: "#c45c32", w: 1600, h: 1066 },
      { bg: "#c45c32", ink: "#fbf7f1", ground: "clay", shape: "square", accent: "#1e4a42", w: 1600, h: 1100 },
      { bg: "#14352f", ink: "#f6e2c4", ground: "deep Thames green", shape: "portrait", accent: "#e2a15a", w: 1100, h: 1500 },
    ],
  },
  {
    slug: "sample-strip",
    title: "Sample strip",
    place: "Nowhere in particular",
    start: "2024-09-12",
    end: "2024-09-20",
    summary: "A second layout sample, from another year. Generated colour fields only, not a trip.",
    frames: [
      { bg: "#e2a15a", ink: "#1b1714", ground: "gold", shape: "circle", accent: "#1e4a42", w: 1600, h: 1066 },
      { bg: "#1b1714", ink: "#fbf7f1", ground: "ink", article: "an", shape: "square", accent: "#c45c32", w: 1600, h: 1066 },
      { bg: "#e7e0d4", ink: "#1b1714", ground: "warm paper", shape: "bar", accent: "#1e4a42", w: 1500, h: 1100 },
    ],
  },
  {
    slug: "sample-markers",
    title: "Sample markers",
    place: "Not a destination",
    start: "2019-03-02",
    end: "2019-03-06",
    summary: "A third layout sample, so the timeline has another year. Not photographs, and not a place Jake went.",
    frames: [
      { bg: "#8e3b22", ink: "#fbf7f1", ground: "deep clay", shape: "circle", accent: "#e2a15a", w: 1600, h: 1066 },
      { bg: "#f6e2c4", ink: "#1b1714", ground: "pale gold", shape: "square", accent: "#1e4a42", w: 1600, h: 1200 },
      { bg: "#3f3a36", ink: "#f3eee6", ground: "warm grey", shape: "bar", accent: "#c45c32", w: 1400, h: 1000 },
    ],
  },
];

const root = path.join(os.tmpdir(), "onerutter-sample-sources");
fs.rmSync(root, { recursive: true, force: true });

for (const album of albums) {
  const source = path.join(root, album.slug);
  fs.mkdirSync(source, { recursive: true });
  for (const [index, frame] of album.frames.entries()) {
    const name = `${String(index + 1).padStart(2, "0")}.jpg`;
    const svg = colourField(frame, name.slice(0, 2));
    await sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toFile(path.join(source, name));
  }
  writeMdx(album);
  const result = spawnSync(process.execPath, ["scripts/prepare-trip-photos.mjs", album.slug, source], {
    cwd: process.cwd(),
    stdio: "inherit",
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
  const dest = path.join(process.cwd(), "public", "travel", album.slug);
  for (const name of fs.readdirSync(dest)) {
    if (/^\d+\.jpg$/.test(name) && Number(name.slice(0, 2)) > album.frames.length) {
      fs.rmSync(path.join(dest, name));
    }
  }
}

function colourField(frame, label) {
  const { w, h, bg, ink, accent, shape } = frame;
  let shapes = "";
  if (shape === "circle") shapes = `<circle cx="${Math.round(w * 0.78)}" cy="${Math.round(h * 0.28)}" r="${Math.round(Math.min(w, h) * 0.16)}" fill="${accent}"/>`;
  else if (shape === "square") shapes = `<rect x="${Math.round(w * 0.62)}" y="${Math.round(h * 0.16)}" width="${Math.round(w * 0.22)}" height="${Math.round(w * 0.22)}" fill="${accent}"/>`;
  else shapes = `<rect x="${Math.round(w * 0.12)}" y="${Math.round(h * 0.2)}" width="18" height="${Math.round(h * 0.38)}" fill="${accent}"/>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="100%" height="100%" fill="${bg}"/>
  ${shapes}
  <rect x="28" y="28" width="${w - 56}" height="${h - 56}" fill="none" stroke="${ink}" stroke-opacity="0.35" stroke-width="2"/>
  <text x="${Math.round(w / 2)}" y="${h - 132}" text-anchor="middle" fill="${ink}" font-family="sans-serif" font-size="64" font-weight="600" letter-spacing="3">SAMPLE ${label}</text>
  <text x="${Math.round(w / 2)}" y="${h - 78}" text-anchor="middle" fill="${ink}" font-family="sans-serif" font-size="28" opacity="0.8">Placeholder colour field. Not a photograph.</text>
</svg>`;
}

function writeMdx(album) {
  const dir = path.join(process.cwd(), "content", "trips", album.slug);
  fs.mkdirSync(dir, { recursive: true });
  const photos = album.frames
    .map((frame, index) => {
      const name = `${String(index + 1).padStart(2, "0")}.jpg`;
      return `  - src: /travel/${album.slug}/${name}
    alt: Placeholder colour field ${name.slice(0, 2)} on ${frame.article ?? "a"} ${frame.ground} ground, with an onerutter.com watermark. Not a photograph.
    caption: Sample ${name.slice(0, 2)}. Not a place.`;
    })
    .join("\n");
  const mdx = `---
# Sample layout only. Colour fields from scripts/generate-sample-album.mjs,
# watermarked by scripts/prepare-trip-photos.mjs. Not a trip.
title: ${album.title}
place: ${album.place}
country: Sample
startDate: "${album.start}"
endDate: "${album.end}"
cover: /travel/${album.slug}/01.jpg
summary: "${album.summary}"
draft: true
photos:
${photos}
---
`;
  fs.writeFileSync(path.join(dir, "index.mdx"), mdx);
}

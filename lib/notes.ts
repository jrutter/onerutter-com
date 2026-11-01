import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { asDateString } from "@/lib/dates";
import { draftsAreVisible } from "@/lib/drafts";

export { draftsAreVisible };

const notesDir = path.join(process.cwd(), "content/notes");

const coverExtensions = new Set([".svg", ".webp", ".jpg", ".jpeg", ".png", ".avif", ".gif"]);

export type Note = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  draft: boolean;
  updated?: string;
  image?: string;
  /** Public URL path, such as `/note-covers/example.svg`. The file lives under `public/`. */
  cover?: string;
  coverAlt?: string;
  body: string;
};

function readCover(fileName: string, value: unknown) {
  if (typeof value !== "string" || !value.startsWith("/") || value.includes("\\") || value.includes("?") || value.includes("#")) {
    throw new Error(`${fileName}: cover must be a path under public/, starting with /`);
  }
  const extension = path.extname(value).toLowerCase();
  if (!coverExtensions.has(extension)) {
    throw new Error(`${fileName}: cover must be an svg, webp, jpg, png, avif, or gif`);
  }
  const publicDir = path.resolve(process.cwd(), "public");
  const resolved = path.resolve(publicDir, value.slice(1));
  const relative = path.relative(publicDir, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`${fileName}: cover must be a path under public/`);
  }
  if (!fs.existsSync(resolved)) {
    throw new Error(`${fileName}: cover file not found at public${value}`);
  }
  return value;
}

function readNote(fileName: string): Note {
  const filePath = path.join(notesDir, fileName);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const slug = fileName.replace(/\.mdx$/, "");

  if (typeof data.title !== "string" || !data.title.trim()) {
    throw new Error(`${fileName}: title is required`);
  }
  if (typeof data.summary !== "string" || !data.summary.trim()) {
    throw new Error(`${fileName}: summary is required`);
  }
  if (!Array.isArray(data.tags) || data.tags.some((tag) => typeof tag !== "string" || !tag.trim())) {
    throw new Error(`${fileName}: tags must be a list of strings`);
  }
  if (typeof data.draft !== "boolean") {
    throw new Error(`${fileName}: draft must be true or false`);
  }

  const note: Note = {
    slug,
    title: data.title.trim(),
    date: asDateString(data.date, fileName, "date"),
    summary: data.summary.trim(),
    tags: data.tags.map((tag: string) => tag.trim()),
    draft: data.draft,
    body: content.trim(),
  };

  if (data.updated != null) note.updated = asDateString(data.updated, fileName, "updated");
  if (data.image != null) {
    if (typeof data.image !== "string") throw new Error(`${fileName}: image must be a path`);
    note.image = data.image;
  }
  if (data.cover != null) note.cover = readCover(fileName, data.cover);
  if (data.coverAlt != null) {
    if (typeof data.coverAlt !== "string" || !data.coverAlt.trim()) {
      throw new Error(`${fileName}: coverAlt must be a non-empty string`);
    }
    note.coverAlt = data.coverAlt.trim();
  }
  if (note.coverAlt && !note.cover) {
    throw new Error(`${fileName}: coverAlt needs a cover`);
  }

  return note;
}

function allNotes() {
  if (!fs.existsSync(notesDir)) return [];
  return fs
    .readdirSync(notesDir)
    .filter((file) => file.endsWith(".mdx") && !file.startsWith("_"))
    .map(readNote)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));
}

export function getPublishedNotes() {
  return allNotes().filter((note) => !note.draft);
}

export function getVisibleNotes() {
  const notes = allNotes();
  return draftsAreVisible() ? notes : notes.filter((note) => !note.draft);
}

export function getNote(slug: string) {
  return allNotes().find((note) => note.slug === slug);
}

export function getVisibleNote(slug: string) {
  const note = getNote(slug);
  if (!note) return undefined;
  if (note.draft && !draftsAreVisible()) return undefined;
  return note;
}

export function getPublishedTags() {
  return [...new Set(getPublishedNotes().flatMap((note) => note.tags))].sort();
}

export function getVisibleTags() {
  return [...new Set(getVisibleNotes().flatMap((note) => note.tags))].sort();
}

export function notesForTag(tag: string, notes: Note[]) {
  return notes.filter((note) => note.tags.includes(tag));
}

/** About a minute per 200 words, never under a minute. */
export function readingMinutes(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatReadingTime(body: string) {
  const minutes = readingMinutes(body);
  return `${minutes} min read`;
}

export function formatNoteDate(date: string, month: "short" | "long" = "short") {
  const [year, monthIndex, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month,
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, monthIndex - 1, day)));
}

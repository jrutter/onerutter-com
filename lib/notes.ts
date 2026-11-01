import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const notesDir = path.join(process.cwd(), "content/notes");

export type Note = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  draft: boolean;
  updated?: string;
  image?: string;
  body: string;
};

export function draftsAreVisible() {
  if (process.env.SHOW_DRAFTS === "true") return true;
  if (process.env.VERCEL_ENV === "preview") return true;
  return process.env.NODE_ENV !== "production";
}

function asDateString(value: unknown, file: string, field: string) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, "0");
    const day = String(value.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  throw new Error(`${file}: ${field} must be YYYY-MM-DD`);
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

export function formatNoteDate(date: string, month: "short" | "long" = "short") {
  const [year, monthIndex, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month,
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, monthIndex - 1, day)));
}

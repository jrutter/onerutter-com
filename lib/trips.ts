import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { asDateString } from "@/lib/dates";
import { draftsAreVisible } from "@/lib/drafts";
import { inspectTripImage, isTripSlug, resolveTripImage } from "@/lib/trip-assets";
import type { TripPhoto } from "@/lib/trip-types";

const tripsDir = path.join(process.cwd(), "content/trips");

export type Trip = {
  slug: string;
  title: string;
  place: string;
  country: string;
  /** Year the timeline groups under. Derived from the dates unless `year` is set. */
  year: string;
  startDate?: string;
  endDate?: string;
  summary: string;
  draft: boolean;
  cover?: TripPhoto;
  photos: TripPhoto[];
  body: string;
  /** Sequence within a year when both dates are unknown. Lower comes first. */
  order?: number;
};

function requiredString(value: unknown, file: string, field: string) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${file}: ${field} is required`);
  return value.trim();
}

function optionalString(value: unknown, file: string, field: string) {
  if (value == null || value === "") return "";
  if (typeof value !== "string") throw new Error(`${file}: ${field} must be a string`);
  return value.trim();
}

function optionalDate(value: unknown, file: string, field: string) {
  if (value == null || value === "") return undefined;
  return asDateString(value, file, field);
}

function optionalYear(value: unknown, file: string) {
  if (value == null || value === "") return undefined;
  const year = typeof value === "number" && Number.isInteger(value) ? String(value) : value;
  if (typeof year === "string" && /^\d{4}$/.test(year)) return year;
  throw new Error(`${file}: year must be YYYY`);
}

function optionalOrder(value: unknown, file: string) {
  if (value == null || value === "") return undefined;
  if (typeof value === "number" && Number.isInteger(value) && value >= 1) return value;
  throw new Error(`${file}: order must be a whole number, 1 or greater`);
}

function resolveYear(file: string, explicit: string | undefined, startDate?: string, endDate?: string) {
  const startYear = startDate?.slice(0, 4);
  const endYear = endDate?.slice(0, 4);
  if (!explicit) {
    const derived = startYear ?? endYear;
    if (!derived) throw new Error(`${file}: set year when startDate and endDate are unknown`);
    return derived;
  }
  if (startYear && endYear && startYear === endYear && explicit !== startYear) {
    throw new Error(`${file}: year ${explicit} does not match the dates in ${startYear}`);
  }
  if (startYear && !endYear && explicit !== startYear) {
    throw new Error(`${file}: year ${explicit} does not match startDate`);
  }
  if (endYear && !startYear && explicit !== endYear) {
    throw new Error(`${file}: year ${explicit} does not match endDate`);
  }
  if (startYear && endYear && startYear !== endYear && explicit !== startYear && explicit !== endYear) {
    throw new Error(`${file}: year must be ${startYear} or ${endYear} when the trip crosses New Year`);
  }
  return explicit;
}

type PhotoInput = { src: string; alt: string; caption?: string };

function readPhotos(value: unknown, file: string): PhotoInput[] {
  if (value == null) return [];
  if (!Array.isArray(value)) throw new Error(`${file}: photos must be a list`);
  if (value.length > 10) {
    throw new Error(`${file}: photos must be 10 or fewer (found ${value.length}). Three is the usual album.`);
  }

  return value.map((item, index) => {
    const label = `photo ${index + 1}`;
    if (!item || typeof item !== "object") throw new Error(`${file}: ${label} must be a mapping with src and alt`);
    const record = item as Record<string, unknown>;
    const src = requiredString(record.src, file, `${label} src`);
    const alt = requiredString(record.alt, file, `${label} alt`);
    if (/^todo\b/i.test(alt)) throw new Error(`${file}: write a real alt for ${src} (it still says TODO)`);

    let caption: string | undefined;
    if (record.caption != null && record.caption !== "") {
      if (typeof record.caption !== "string") throw new Error(`${file}: ${label} caption must be a string`);
      caption = record.caption.trim();
      if (!caption) caption = undefined;
      else if (caption.includes("\n") || caption.length > 160) {
        throw new Error(`${file}: caption for ${src} must be a single line of at most 160 characters`);
      }
    }

    return { src, alt, caption };
  });
}

async function readTrip(slug: string): Promise<Trip> {
  const file = `content/trips/${slug}/index.mdx`;
  const filePath = path.join(tripsDir, slug, "index.mdx");
  if (!fs.existsSync(filePath)) throw new Error(`${file} is missing`);

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const title = requiredString(data.title, file, "title");
  const place = optionalString(data.place, file, "place");
  const country = optionalString(data.country, file, "country");
  const summary = optionalString(data.summary, file, "summary");
  const startDate = optionalDate(data.startDate, file, "startDate");
  const endDate = optionalDate(data.endDate, file, "endDate");
  if (startDate && endDate && endDate < startDate) throw new Error(`${file}: endDate must be on or after startDate`);
  if (typeof data.draft !== "boolean") throw new Error(`${file}: draft must be true or false`);

  const year = resolveYear(file, optionalYear(data.year, file), startDate, endDate);
  const order = optionalOrder(data.order, file);
  if (!startDate && !endDate && order == null) {
    throw new Error(`${file}: set order when dates are unknown, so the trip has a place in ${year}`);
  }

  const inputs = readPhotos(data.photos, file);
  const seen = new Set<string>();
  const loaded: { filePath: string; photo: TripPhoto }[] = [];

  for (const input of inputs) {
    const resolved = resolveTripImage(slug, input.src);
    if (seen.has(resolved.filePath)) throw new Error(`${file}: ${input.src} is listed more than once`);
    seen.add(resolved.filePath);
    const facts = await inspectTripImage(resolved.filePath);
    loaded.push({
      filePath: resolved.filePath,
      photo: {
        src: resolved.url,
        alt: input.alt,
        caption: input.caption,
        width: facts.width,
        height: facts.height,
        blurDataURL: facts.blurDataURL,
      },
    });
  }

  let cover: TripPhoto | undefined;
  if (loaded.length === 0) {
    if (data.cover != null && String(data.cover).trim() !== "") {
      throw new Error(`${file}: cover is set but there are no photos`);
    }
  } else {
    const coverSrc = requiredString(data.cover, file, "cover");
    const coverPath = resolveTripImage(slug, coverSrc).filePath;
    cover = loaded.find((item) => item.filePath === coverPath)?.photo;
    if (!cover) throw new Error(`${file}: cover must be the src of one of the photos`);
  }

  return {
    slug,
    title,
    place,
    country,
    year,
    startDate,
    endDate,
    summary,
    draft: data.draft,
    cover,
    photos: loaded.map((item) => item.photo),
    body: content.trim(),
    order,
  };
}

function tripSlugs() {
  if (!fs.existsSync(tripsDir)) return [];
  return fs
    .readdirSync(tripsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => entry.name);
}

function whenKey(trip: Trip) {
  return trip.startDate ?? trip.endDate ?? null;
}

function compareTrips(a: Trip, b: Trip) {
  if (a.year !== b.year) return a.year < b.year ? 1 : -1;
  const aWhen = whenKey(a);
  const bWhen = whenKey(b);
  if (aWhen && bWhen && aWhen !== bWhen) return aWhen < bWhen ? 1 : -1;
  if (aWhen && !bWhen) return -1;
  if (!aWhen && bWhen) return 1;
  if (!aWhen && !bWhen) {
    const aOrder = a.order ?? Number.MAX_SAFE_INTEGER;
    const bOrder = b.order ?? Number.MAX_SAFE_INTEGER;
    if (aOrder !== bOrder) return aOrder - bOrder;
  } else {
    const aEnd = a.endDate ?? "";
    const bEnd = b.endDate ?? "";
    if (aEnd !== bEnd) return aEnd < bEnd ? 1 : -1;
  }
  return a.title.localeCompare(b.title);
}

async function readAllTrips() {
  const slugs = tripSlugs();
  for (const slug of slugs) {
    if (!isTripSlug(slug)) throw new Error(`content/trips/${slug} must be lowercase kebab-case`);
  }
  const trips = await Promise.all(slugs.map((slug) => readTrip(slug)));
  return trips.sort(compareTrips);
}

let cached: Promise<Trip[]> | null = null;

export function getAllTrips() {
  if (process.env.NODE_ENV === "development") return readAllTrips();
  cached ??= readAllTrips().catch((error: unknown) => {
    cached = null;
    throw error;
  });
  return cached;
}

export async function getPublishedTrips() {
  return (await getAllTrips()).filter((trip) => !trip.draft);
}

export async function getVisibleTrips() {
  const trips = await getAllTrips();
  return draftsAreVisible() ? trips : trips.filter((trip) => !trip.draft);
}

export async function getVisibleTrip(slug: string) {
  const trip = (await getAllTrips()).find((item) => item.slug === slug);
  if (!trip) return undefined;
  if (trip.draft && !draftsAreVisible()) return undefined;
  return trip;
}

/** An album page exists once there is something to read or a photograph to open. */
export function tripHasPage(trip: Pick<Trip, "photos" | "summary" | "body">) {
  return trip.photos.length > 0 || trip.summary.trim().length > 0 || trip.body.trim().length > 0;
}

export function publishedTripStats(trips: Trip[]) {
  const published = trips.filter((trip) => !trip.draft);
  if (published.length === 0) return null;
  const since = published.reduce((min, trip) => (trip.year < min ? trip.year : min), published[0].year);
  return { count: published.length, since };
}

export function groupTripsByYear(trips: Trip[]) {
  const groups: { year: string; trips: Trip[] }[] = [];
  for (const trip of trips) {
    const current = groups[groups.length - 1];
    if (current?.year === trip.year) current.trips.push(trip);
    else groups.push({ year: trip.year, trips: [trip] });
  }
  return groups;
}

export function tripPhotoIndex(value: string | string[] | undefined, count: number) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || !/^\d+$/.test(raw)) return null;
  const number = Number(raw);
  if (number < 1 || number > count) return null;
  return number - 1;
}

function monthName(year: number, month: number, style: "long" | "short") {
  return new Intl.DateTimeFormat("en-GB", { month: style, timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, 1)));
}

function dateParts(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month, day };
}

export function formatTripDates(start: string, end: string) {
  const a = dateParts(start);
  const b = dateParts(end);
  if (start === end) return `${a.day} ${monthName(a.year, a.month, "long")} ${a.year}`;
  if (a.year === b.year && a.month === b.month) {
    return `${a.day}–${b.day} ${monthName(a.year, a.month, "long")} ${a.year}`;
  }
  if (a.year === b.year) {
    return `${a.day} ${monthName(a.year, a.month, "short")} – ${b.day} ${monthName(b.year, b.month, "short")} ${a.year}`;
  }
  return `${a.day} ${monthName(a.year, a.month, "short")} ${a.year} – ${b.day} ${monthName(b.year, b.month, "short")} ${b.year}`;
}

/** Full range, an open start or end, or just the year when both dates are unknown. */
export function formatTripWhen(trip: Pick<Trip, "startDate" | "endDate" | "year">) {
  if (trip.startDate && trip.endDate) return formatTripDates(trip.startDate, trip.endDate);
  if (trip.endDate) {
    const end = dateParts(trip.endDate);
    return `– ${end.day} ${monthName(end.year, end.month, "long")} ${end.year}`;
  }
  if (trip.startDate) {
    const start = dateParts(trip.startDate);
    return `${start.day} ${monthName(start.year, start.month, "long")} ${start.year} –`;
  }
  return trip.year;
}

export function tripDateTime(trip: Pick<Trip, "startDate" | "endDate" | "year">) {
  return trip.startDate ?? trip.endDate ?? trip.year;
}

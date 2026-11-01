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
  startDate: string;
  endDate: string;
  summary: string;
  draft: boolean;
  cover: TripPhoto;
  photos: TripPhoto[];
  body: string;
};

function requiredString(value: unknown, file: string, field: string) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${file}: ${field} is required`);
  return value.trim();
}

type PhotoInput = { src: string; alt: string; caption?: string };

function readPhotos(value: unknown, file: string): PhotoInput[] {
  if (!Array.isArray(value)) throw new Error(`${file}: photos must be a list`);
  if (value.length < 1 || value.length > 10) {
    throw new Error(`${file}: photos must be 1 to 10 (found ${value.length}). Three is the usual album.`);
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
  const place = requiredString(data.place, file, "place");
  const country = requiredString(data.country, file, "country");
  const summary = requiredString(data.summary, file, "summary");
  const coverSrc = requiredString(data.cover, file, "cover");
  const startDate = asDateString(data.startDate, file, "startDate");
  const endDate = asDateString(data.endDate, file, "endDate");
  if (endDate < startDate) throw new Error(`${file}: endDate must be on or after startDate`);
  if (typeof data.draft !== "boolean") throw new Error(`${file}: draft must be true or false`);

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

  const coverPath = resolveTripImage(slug, coverSrc).filePath;
  const cover = loaded.find((item) => item.filePath === coverPath)?.photo;
  if (!cover) throw new Error(`${file}: cover must be the src of one of the photos`);
  const photos = loaded.map((item) => item.photo);

  return {
    slug,
    title,
    place,
    country,
    startDate,
    endDate,
    summary,
    draft: data.draft,
    cover,
    photos,
    body: content.trim(),
  };
}

function tripSlugs() {
  if (!fs.existsSync(tripsDir)) return [];
  return fs
    .readdirSync(tripsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => entry.name);
}

async function readAllTrips() {
  const slugs = tripSlugs();
  for (const slug of slugs) {
    if (!isTripSlug(slug)) throw new Error(`content/trips/${slug} must be lowercase kebab-case`);
  }
  const trips = await Promise.all(slugs.map((slug) => readTrip(slug)));
  return trips.sort((a, b) => {
    if (a.startDate !== b.startDate) return a.startDate < b.startDate ? 1 : -1;
    if (a.endDate !== b.endDate) return a.endDate < b.endDate ? 1 : -1;
    return a.title.localeCompare(b.title);
  });
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

export function groupTripsByYear(trips: Trip[]) {
  const groups: { year: string; trips: Trip[] }[] = [];
  for (const trip of trips) {
    const year = trip.startDate.slice(0, 4);
    const current = groups[groups.length - 1];
    if (current?.year === year) current.trips.push(trip);
    else groups.push({ year, trips: [trip] });
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

export function formatTripDates(start: string, end: string) {
  const [startYear, startMonth, startDay] = start.split("-").map(Number);
  const [endYear, endMonth, endDay] = end.split("-").map(Number);
  const monthName = (year: number, month: number, style: "long" | "short") =>
    new Intl.DateTimeFormat("en-GB", { month: style, timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, 1)));

  if (start === end) return `${startDay} ${monthName(startYear, startMonth, "long")} ${startYear}`;
  if (startYear === endYear && startMonth === endMonth) {
    return `${startDay}–${endDay} ${monthName(startYear, startMonth, "long")} ${startYear}`;
  }
  if (startYear === endYear) {
    return `${startDay} ${monthName(startYear, startMonth, "short")} – ${endDay} ${monthName(endYear, endMonth, "short")} ${startYear}`;
  }
  return `${startDay} ${monthName(startYear, startMonth, "short")} ${startYear} – ${endDay} ${monthName(endYear, endMonth, "short")} ${endYear}`;
}

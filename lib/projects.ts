import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const projectsDir = path.join(process.cwd(), "content/projects");

export type ProjectStatus = "live" | "building" | "placeholder";

export type Project = {
  slug: string;
  title: string;
  summary: string;
  status: ProjectStatus;
  url?: string;
  tags: string[];
  featured: boolean;
  order: number;
  homeOrder?: number;
  kicker?: string;
  cardTitle?: string;
  cardSummary?: string;
  body: string;
};

const statuses = new Set<ProjectStatus>(["live", "building", "placeholder"]);

function optionalString(value: unknown, file: string, field: string) {
  if (value == null || value === "") return undefined;
  if (typeof value !== "string") throw new Error(`${file}: ${field} must be a string`);
  return value.trim();
}

function readProject(fileName: string): Project {
  const raw = fs.readFileSync(path.join(projectsDir, fileName), "utf8");
  const { data, content } = matter(raw);
  const slug = fileName.replace(/\.md$/, "");

  if (typeof data.title !== "string" || !data.title.trim()) {
    throw new Error(`${fileName}: title is required`);
  }
  if (typeof data.summary !== "string" || !data.summary.trim()) {
    throw new Error(`${fileName}: summary is required`);
  }
  if (typeof data.status !== "string" || !statuses.has(data.status as ProjectStatus)) {
    throw new Error(`${fileName}: status must be live, building, or placeholder`);
  }
  if (!Array.isArray(data.tags) || data.tags.some((tag) => typeof tag !== "string")) {
    throw new Error(`${fileName}: tags must be a list of strings`);
  }
  if (typeof data.featured !== "boolean") {
    throw new Error(`${fileName}: featured must be true or false`);
  }
  if (typeof data.order !== "number") {
    throw new Error(`${fileName}: order must be a number`);
  }

  const url = optionalString(data.url, fileName, "url");
  if (url) {
    try {
      new URL(url);
    } catch {
      throw new Error(`${fileName}: url must be absolute`);
    }
  }
  if (data.featured && !url) {
    throw new Error(`${fileName}: a featured project needs a url`);
  }

  const homeOrder = data.homeOrder == null ? undefined : data.homeOrder;
  if (homeOrder != null && typeof homeOrder !== "number") {
    throw new Error(`${fileName}: homeOrder must be a number`);
  }

  return {
    slug,
    title: data.title.trim(),
    summary: data.summary.trim(),
    status: data.status as ProjectStatus,
    url,
    tags: data.tags.map((tag: string) => tag.trim()).filter(Boolean),
    featured: data.featured,
    order: data.order,
    homeOrder,
    kicker: optionalString(data.kicker, fileName, "kicker"),
    cardTitle: optionalString(data.cardTitle, fileName, "cardTitle"),
    cardSummary: optionalString(data.cardSummary, fileName, "cardSummary"),
    body: content.trim(),
  };
}

export function getProjects() {
  return fs
    .readdirSync(projectsDir)
    .filter((file) => file.endsWith(".md") && !file.startsWith("_"))
    .map(readProject)
    .sort((a, b) => a.order - b.order);
}

export function getFeaturedProjects() {
  return getProjects()
    .filter((project) => project.featured)
    .sort((a, b) => (a.homeOrder ?? a.order) - (b.homeOrder ?? b.order));
}

export function statusLabel(status: ProjectStatus) {
  if (status === "live") return "Live";
  if (status === "building") return "Building";
  return "No link yet";
}

export function hostLabel(url: string) {
  return new URL(url).host.replace(/^www\./, "");
}

import type { Project } from "@/lib/projects";
import { hostLabel } from "@/lib/projects";

type Variant = "paper" | "ink" | "clay";
type Mark = "three" | "lines" | "plane";

const presentation: Record<string, { variant: Variant; mark: Mark }> = {
  "tails-over-thames": { variant: "clay", mark: "plane" },
  "three-today": { variant: "paper", mark: "three" },
  "mind-the-timetable": { variant: "ink", mark: "lines" },
  "bangers-and-postcodes": { variant: "paper", mark: "lines" },
};

function MarkIcon({ mark }: { mark: Mark }) {
  if (mark === "three") return "3";
  if (mark === "lines") {
    return (
      <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M4 8h20M4 14h14M4 20h17" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 16.5 25 8l-8.5 14-2.2-6.2L3 16.5z" />
    </svg>
  );
}

export function BuildCard({ project }: { project: Project }) {
  const look = presentation[project.slug] ?? { variant: "paper" as const, mark: "three" as const };
  if (!project.url) return null;

  return (
    <a className={`build build-${look.variant}`} href={project.url}>
      <span className="build-mark" aria-hidden="true">
        <MarkIcon mark={look.mark} />
      </span>
      <span className="kicker">{project.kicker ?? project.title}</span>
      <span className="wordmark-product">{project.title}</span>
      <span className="build-title">{project.cardTitle ?? project.title}</span>
      <span className="build-sub">{project.cardSummary ?? project.summary}</span>
      <span className="build-go">{hostLabel(project.url)} →</span>
    </a>
  );
}

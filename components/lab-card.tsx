import type { Project } from "@/lib/projects";
import { statusLabel } from "@/lib/projects";

const tones = ["navy", "cyan", "yellow", "peach", "pink"] as const;

export type LabTone = (typeof tones)[number];

/** Stable per app. New slugs fall back to the same rotation as their place in the list. */
const toneBySlug: Record<string, LabTone> = {
  "agentic-checkout-index": "navy",
  tradetrek: "cyan",
  strategicpulse: "yellow",
  "first-plate-delaware": "peach",
  "send-a-spark": "pink",
  "delmarva-community-guide": "navy",
  "tails-over-thames": "cyan",
  "mind-the-timetable": "yellow",
  "three-today": "peach",
  "mood-machine": "pink",
  "local-sound": "navy",
};

export function labTone(slug: string, index: number): LabTone {
  return toneBySlug[slug] ?? tones[index % tones.length];
}

export function LabCard({ project, tone }: { project: Project; tone: LabTone }) {
  const body = (
    <>
      <span className="lab-chip">{statusLabel(project.status)}</span>
      <h2>{project.title}</h2>
      <p>{project.summary}</p>
      {project.url ? (
        <span className="lab-go" aria-hidden="true">
          →
        </span>
      ) : null}
    </>
  );

  if (!project.url) {
    return <article className={`lab-card lab-card-${tone}`}>{body}</article>;
  }

  return (
    <a className={`lab-card lab-card-${tone}`} href={project.url}>
      {body}
    </a>
  );
}

import type { Project } from "@/lib/projects";
import { statusLabel } from "@/lib/projects";

const tones = ["navy", "cyan", "yellow", "peach", "pink"] as const;

export type LabTone = (typeof tones)[number];

/**
 * Tried in this order, not the palette sequence, so a row is not a spectrum.
 * Five tones stay apart on the 1-, 2-, 3-, and 4-column grids only when this
 * order repeats. The repeat is offset from every column count, so the same
 * color is never beside itself or stacked in a column.
 */
const toneOrder = ["navy", "yellow", "pink", "cyan", "peach"] as const satisfies readonly LabTone[];

/** `.lab-grid`: 4 columns, 3 below 1100px, 2 below 900px. 1 covers a single column. */
const gridColumns = [1, 2, 3, 4] as const;

function touches(a: number, b: number, columns: number) {
  const rowA = Math.floor(a / columns);
  const colA = a % columns;
  const rowB = Math.floor(b / columns);
  const colB = b % columns;
  const sideBySide = rowA === rowB && Math.abs(colA - colB) === 1;
  const stacked = colA === colB && Math.abs(rowA - rowB) === 1;
  return sideBySide || stacked;
}

export function labTones(count: number): LabTone[] {
  if (toneOrder.length !== tones.length || new Set(toneOrder).size !== tones.length) {
    throw new Error("Lab tone order must list each tone once.");
  }

  const chosen: LabTone[] = [];

  for (let index = 0; index < count; index += 1) {
    const tone = toneOrder.find(
      (candidate) =>
        !chosen.some(
          (used, usedAt) => used === candidate && gridColumns.some((columns) => touches(usedAt, index, columns)),
        ),
    );

    if (!tone) {
      throw new Error(`No lab tone for card ${index} stays off the same color at every grid width.`);
    }

    chosen.push(tone);
  }

  return chosen;
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

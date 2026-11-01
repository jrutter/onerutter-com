import type { Metadata } from "next";
import { LabCard, labTone } from "@/components/lab-card";
import { getProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "The Lab",
  description: "Things Jake Rutter is building, testing, and learning from. Side projects from the lab.",
  alternates: { canonical: "/lab" },
  openGraph: {
    url: "https://onerutter.com/lab",
    title: "The Lab — Jake Rutter",
    description: "Things I'm building, testing, and learning from.",
  },
};

export default function LabPage() {
  const projects = getProjects();

  return (
    <main id="content">
      <div className="wrap">
        <header className="page-head">
          <p className="kicker">Side projects</p>
          <h1 className="title">The Lab</h1>
          <p className="deck">Things I&apos;m building, testing, and learning from.</p>
        </header>

        <div className="essay">
          <p>
            This is where I tinker. Some of these are experiments that turned into real products. Some are weekly builds
            I spin up to learn something specific or test whether an idea has legs. None of them are finished —
            that&apos;s the point. The goal is to stay hands-on, keep building, and let the best ideas grow from there.
          </p>
        </div>

        <ul className="lab-grid">
          {projects.map((project, index) => (
            <li key={project.slug}>
              <LabCard project={project} tone={labTone(project.slug, index)} />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

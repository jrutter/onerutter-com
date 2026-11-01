import type { Metadata } from "next";
import { getProjects, hostLabel, statusLabel } from "@/lib/projects";

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

        <div className="essay stack-28">
          <p>
            This is where I tinker. Some of these are experiments that turned into real products. Some are weekly builds
            I spin up to learn something specific or test whether an idea has legs. None of them are finished —
            that&apos;s the point. The goal is to stay hands-on, keep building, and let the best ideas grow from there.
          </p>
        </div>

        <section className="band" aria-labelledby="weekly-heading">
          <p className="kicker">The lab</p>
          <h2 id="weekly-heading">Weekly builds</h2>
          <p>
            Each week I try to build something new — a niche site, a small tool, a business concept. Some will go
            nowhere. Some might turn into something. All of them teach me something.
          </p>
          <p className="quiet">First build coming soon — check back shortly.</p>
        </section>

        <section className="block" aria-labelledby="longer-heading">
          <p className="kicker">The lab</p>
          <h2 id="longer-heading">Longer-running experiments</h2>
          <p className="lede">These started as experiments and have grown into real products with users.</p>

          {projects.map((project) => (
            <article className="project" key={project.slug}>
              <h2>{project.title}</h2>
              <span className={`pill pill-${project.status === "live" ? "live" : project.status === "building" ? "building" : "placeholder"}`}>
                {statusLabel(project.status)}
              </span>
              {project.status === "placeholder" ? (
                <aside className="needs">
                  <span className="needs-label">Needs Jake</span>
                  {(project.body || project.summary).split(/\n\n+/).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </aside>
              ) : (
                <p className="summary">{project.summary}</p>
              )}
              {project.tags.length > 0 ? (
                <ul className="tags">
                  {project.tags.map((tag) => (
                    <li key={tag}>
                      <span className="tag">{tag}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {project.url ? (
                <p className="visit">
                  <a className="text-link" href={project.url}>
                    {hostLabel(project.url)} →
                  </a>
                </p>
              ) : null}
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

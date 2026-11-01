import type { Metadata } from "next";
import Link from "next/link";
import { BuildCard } from "@/components/build-card";
import { NoteList } from "@/components/note-list";
import { Timeline } from "@/components/timeline";
import { getPublishedNotes } from "@/lib/notes";
import { getFeaturedProjects } from "@/lib/projects";
import { homeYears } from "@/lib/story";
import { profiles, siteDescription, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Jake Rutter" },
  description: siteDescription,
  alternates: { canonical: "/" },
  openGraph: { url: siteUrl, title: "Jake Rutter", description: siteDescription },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jake Rutter",
  url: siteUrl,
  jobTitle: "VP, DTC Engineering & Applied AI",
  worksFor: {
    "@type": "Organization",
    name: "SharkNinja",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Barnes",
    addressRegion: "London",
    addressCountry: "GB",
  },
  sameAs: profiles.map((profile) => profile.href),
};

export default function HomePage() {
  const featured = getFeaturedProjects();
  const latestNotes = getPublishedNotes().slice(0, 3);

  return (
    <main id="content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <div className="wrap">
        <section className="hero">
          <p className="kicker">Barnes, London</p>
          <h1 className="display">Hi, I&apos;m Jake Rutter.</h1>
          <p className="deck">
            I lead DTC engineering at SharkNinja, and I stay ahead by building, tinkering, and learning something new
            every week.
          </p>
          <p className="hero-links">
            <Link href="/story">→ The story</Link>
            <Link href="/lab">→ The lab</Link>
            <Link href="/hello">Say hello</Link>
          </p>
        </section>

        <section className="block" aria-labelledby="lab-heading">
          <p className="kicker">The lab</p>
          <h2 id="lab-heading">Things I&apos;m building, testing, and learning from.</h2>
          <div className="builds">
            {featured.map((project) => (
              <BuildCard key={project.slug} project={project} />
            ))}
          </div>
          <p className="more">
            <Link className="text-link" href="/lab">
              The whole lab →
            </Link>
          </p>
        </section>

        <section className="block" aria-labelledby="years-heading">
          <p className="kicker">Year by year</p>
          <h2 id="years-heading">Selected years</h2>
          <p className="lede">
            A short cut. <Link href="/story">The full story</Link> has the jobs, the book, and the magazine pieces.
          </p>
          <Timeline years={homeYears} />
        </section>

        <section className="block band" aria-labelledby="book-heading">
          <p className="kicker">Wiley · 8 February 2011</p>
          <h2 id="book-heading">Smashing jQuery</h2>
          <p>
            After running a blog for several years, I was approached by Wiley to write a book on jQuery. It took about
            three months and came in over 300 pages. Sold through the major outlets, over 5,000 copies. I sent copies to
            John Resig and Addy Osmani.
          </p>
          <p className="more">
            <Link className="text-link" href="/story#writing">
              The magazine pieces →
            </Link>
          </p>
        </section>

        {latestNotes.length > 0 ? (
          <section className="block" aria-labelledby="notes-heading">
            <p className="kicker">Notes</p>
            <h2 id="notes-heading">Latest notes</h2>
            <NoteList notes={latestNotes} />
            <p className="more">
              <Link className="text-link" href="/notes">
                All notes →
              </Link>
            </p>
          </section>
        ) : null}
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import { Timeline } from "@/components/timeline";
import { storyYears } from "@/lib/story";

export const metadata: Metadata = {
  title: "Story",
  description:
    "Jake Rutter's story, from Champlain College and Direct Wines to VP of DTC engineering at SharkNinja, living in Barnes, London.",
  alternates: { canonical: "/story" },
  openGraph: {
    url: "https://onerutter.com/story",
    title: "Story — Jake Rutter",
    description:
      "Twenty years of ecommerce engineering, from a freelance studio in Connecticut to SharkNinja in London.",
  },
};

const interests = [
  "AI / LLMs",
  "Agentic workflows",
  "eCommerce",
  "Digital transformation",
  "Product management",
  "Next.js / React",
  "Shopify",
  "Salesforce SFRA",
  "Headless CMS",
  "Airtable & Notion",
  "Pickleball",
];

export default function StoryPage() {
  return (
    <main id="content">
      <div className="wrap">
        <header className="page-head">
          <p className="kicker">Story</p>
          <h1 className="title">A little about me</h1>
        </header>

        <div className="essay stack-28">
          <p>
            I&apos;m a seasoned digital technology leader with over two decades of experience in digital marketing,
            e-commerce, and product engineering. Currently at SharkNinja, I&apos;m passionate about building
            high-performing teams and leveraging technology — increasingly AI — to create meaningful digital capabilities
            and experiences.
          </p>
          <p>
            With a solid front-end engineering and user experience foundation, I have held pivotal positions including
            Director of Global Front End Engineering and VP of Digital User Experience. Throughout my career I have
            excelled at leading cross-functional teams, migrating platforms, implementing new architectures, and
            optimizing SDLC processes for global brands like SharkNinja, The North Face, Vans, and Priceline.
          </p>
          <p>
            More recently, I&apos;ve been diving deep into AI — both as a practitioner and a builder. I&apos;ve
            integrated AI-powered features into production applications, built AI-first products from the ground up, and
            actively explore how large language models and agentic workflows can unlock new kinds of user experiences. My
            side projects TradeTrek and StrategicPulse are direct expressions of this interest: real products built with
            AI at the core, not as an afterthought.
          </p>
        </div>

        <section className="block" aria-labelledby="path-heading">
          <p className="kicker">Career</p>
          <h2 id="path-heading">Year by year</h2>
          <aside className="needs stack-20">
            <span className="needs-label">Needs an edit</span>
            <p>
              Roles and dates below come from public LinkedIn, the 2024 resume, and the about and writing pages. The
              sentences were drafted for this layout. Please rewrite anything that doesn&apos;t sound like you.
            </p>
          </aside>
          <Timeline years={storyYears} />
        </section>

        <section className="block" aria-labelledby="work-heading">
          <p className="kicker">How I like to work</p>
          <h2 id="work-heading">Progress over perfection</h2>
          <div className="steps">
            <article>
              <span className="step-num">01</span>
              <h3>Understand the problem</h3>
              <p>What is the problem you are trying to solve. Start with why.</p>
            </article>
            <article>
              <span className="step-num">02</span>
              <h3>Design an MVP</h3>
              <p>What are the possible solutions, and what can we build quickly to get some answers?</p>
            </article>
            <article>
              <span className="step-num">03</span>
              <h3>Test and learn</h3>
              <p>Is this solving the problem statement? Take the learnings and go through it again.</p>
            </article>
          </div>
        </section>

        <section className="block" aria-labelledby="interests-heading">
          <p className="kicker">Off the roadmap</p>
          <h2 id="interests-heading">Interests</h2>
          <ul className="chips">
            {interests.map((interest) => (
              <li className="chip" key={interest}>
                {interest}
              </li>
            ))}
          </ul>
          <p className="lede">
            In my spare time, I like to spend time with friends and family, listen to music, play guitar, read books,
            play pickleball, and I love exploring.
          </p>
        </section>

        <section className="block" aria-labelledby="school-heading">
          <h2 id="school-heading">School</h2>
          <ul className="plain-list">
            <li>B.S. Visual Communications, Westwood College of Technology Online, 2005–2007</li>
            <li>A.A.S. Web Design and Management, Champlain College, Burlington, Vermont, 2001–2003</li>
          </ul>
          <blockquote className="pull">Progress over perfection.</blockquote>
        </section>
      </div>
    </main>
  );
}

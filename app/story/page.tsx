import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Timeline } from "@/components/timeline";
import { travelSectionPublic } from "@/lib/site";
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

        <div className="story-intro stack-28">
          <figure className="story-portrait">
            <Image
              src="/jake-rutter.jpg"
              alt="Jake Rutter"
              width={800}
              height={800}
              sizes="(max-width: 760px) 140px, 184px"
              loading="eager"
            />
          </figure>
          <div className="essay">
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
        </div>

        <section className="block" aria-labelledby="draws-heading">
          <p className="kicker">Small apps</p>
          <h2 id="draws-heading">What draws me in</h2>
          <div className="essay stack-28">
            <p>
              I&apos;ve always been fascinated with hyper local apps like JamBase and Bandsintown. I love music and
              discovering new things, places and travel.
            </p>
            <p>Travel is a huge part of who I am — the offline analog alongside digital nomad.</p>
            <p>
              That is why I build things like Tails over Thames, a plane-spotting app for one spot in London; Mind the
              Timetable, for trains; and Three Today.
            </p>
            {travelSectionPublic ? (
              <p className="more">
                <Link className="text-link" href="/travel">
                  See my travels →
                </Link>
              </p>
            ) : null}
          </div>
        </section>

        <section className="block" aria-labelledby="path-heading">
          <p className="kicker">Career</p>
          <h2 id="path-heading">Year by year</h2>
          <Timeline years={[...storyYears].toReversed()} />
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
      </div>
    </main>
  );
}

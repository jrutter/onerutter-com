# onerutter.com

Jake approved this plan on 1 Nov 2026. The Next.js app in this repo is the site. Canonical URL: `https://onerutter.com`.

## Decisions

- Hello headline, as proposed: “Hi, I'm Jake. I lead DTC engineering at SharkNinja, and I build small apps on the side.”
- Public title: VP, DTC Engineering & Applied AI.
- Home in Barnes, office in Battersea.
- Featured builds, in this order: Tails over Thames, Three Today, Mind the Timetable. TradeTrek and the rest stay in the Lab. Delmarva Community Guide, First Plate Delaware, and Local Sound are not on the site.
- Notes live at `/notes`. Article body stays in Source Serif 4.
- Drafts render in local development and on Vercel preview deploys, with a banner. Production, the RSS feed, and the sitemap omit them.
- Light on operating detail. Team-size, budget, site-count, and conversion figures stay off the page.
- No portrait, no dark mode, no résumé PDF, no phone number, no GPA, no GitHub link, no analytics.
- A future return to the US is omitted. Do not add that chapter back.
- The year-by-year sentences stay marked “Needs an edit.”
- Speedwell stays in the published writing-page sentence. Medium and Substack stay in the footer. Whether Speedwell is that Substack is still unconfirmed, and the site does not assert it.

The look takes its pace from [maxclax.com](https://maxclax.com/): a personal page with a very large hello, a few things he actually built, then a life told year by year. The words, names, and colors are Jake's, not Max's.

## What maxclax.com does well

It is one continuous visit, not a brochure with a hero, a logo wall, and a contact form. A small line says where he is. A huge first-person sentence says who he is and what he is trying to do. Under that, three products sit as physical cards, each with its own material (paper, a saturated color, near-black), a short kicker, a heavy wordmark, and one or two sentences. Then the page slows down into years: a heading, a plain paragraph, another year. Principles come after the life, not before it. Contact is a person writing to a person.

Type is a geometric sans (Be Vietnam Pro) set very large, with tight leading and a little negative tracking. The headline is a gradient. Body copy around the years is about 20px, so the story is easy to read rather than scanned as bullets. Color is warm paper, black text, and a few product colors (coral, orange, gold, ink). Spacing is generous: the first screen is mostly the sentence. Motion is small. Cards lift a few pixels. The sticky header blurs. A dot pulses next to a new note. `prefers-reduced-motion` is respected. There is a light/dark toggle. He does not use stock photography or a component-library look.

The story works because the years are specific. Consoles, editors, keyboards, the apps he shipped. A reader can feel a life in order. The résumé is hidden inside that voice.

## What we borrow

### Layout

- Sticky header on warm paper: wordmark on the left, a short nav, one quiet contact link on the right. On a phone the links wrap onto a second row. No hamburger in the mockup, because four links fit.
- Home is the hello, three featured builds, a short year-by-year cut, then the book.
- Story is the long scroll: published about-paragraphs, then the full timeline, then how he likes to work, interests, school.
- Lab is an editorial list, not a card grid. Name at display size, a status pill, his blurb, a link when one exists.
- Notes index is a stack of dated rows. A note is a single column, serif body, tags at the end.
- Footer is name, Barnes, email, and the profiles already linked from the current sites.

### Type

- Outfit for the interface, headlines, and the timeline. Same job as Be Vietnam Pro on the reference: geometric, large, plain. We do not use Be Vietnam Pro.
- Display: `clamp(40px, 6.2vw, 76px)`, weight 600, line-height 1.05, tracking about `-0.03em`. The home headline is a gradient from Thames green into clay.
- Inner page titles use the same family at a slightly smaller clamp, in ink, not in the gradient. The gradient is a home-only moment, which is how the reference uses it.
- Source Serif 4 for the body of a note only, 21px, line-height 1.6, measure about 66 characters. The index stays in Outfit. A note should feel like writing.
- Kickers are 12px, weight 700, uppercase, tracking `0.16em`, in clay (or gold, on a dark card).
- Article text uses Source Serif 4. Jake kept that.

### Color

The reference is warm paper plus a few saturated inks. We keep that structure and change the hues so this is not a recolor of his brand.

| Role | Hex | Use |
| --- | --- | --- |
| Paper | `#F3EEE6` | Page background |
| Paper deep | `#E7E0D4` | Bands |
| Ink | `#1B1714` | Headlines and body |
| Ink soft | `#3F3A36` | Secondary paragraphs |
| Muted | `#5C564E` | Dates, captions |
| Thames | `#1E4A42` | Live status, note links, the pull quote |
| Clay | `#C45C32` | Kickers, focus ring, the “needs Jake” outline |
| Clay deep | `#8E3B22` | “Say hello”, labels inside the dashed boxes |
| Gold soft | `#F6E2C4` | Draft banner and draft pill |

Featured builds use three materials, as the reference does: a paper-to-green card, an ink card, a clay card. Radius 12px. Shadow `0 14px 42px` at low opacity. Text on the clay and ink cards is cream or white.

The home headline gradient runs `#14352F → #1E4A42 → #8E3B22 → #C45C32`. It stays dark enough to read. The reference gradient (cyan, gold, coral, purple) is not reused.

### Spacing

- 8-point scale. Sections separated by 96px, 56px on a phone.
- Content column 1120px. Gutters 32px, 20px under 760px.
- Header 76px, sticky, paper at 88% opacity, 10px blur, a 1px hairline.
- Cards gap 20px. Timeline rows pad 36px below. A note’s text never runs wider than about 66–68 characters.
- The style guide in `mockups/styleguide.html` shows the scale, the swatches, and the components at both widths.

### Motion

- Cards lift 3px and deepen the shadow, 200ms.
- Links gain a clay underline. They do not change color abruptly.
- The header does not hide on scroll.
- `prefers-reduced-motion: reduce` turns the lift off.
- Not in this version: the particle field, the vertical “scroll” label, the pulsing dot beside Notes, the language switcher, the light/dark crossfade. They are part of why the reference feels alive, and they are easy to add later if he wants them. The first build should feel finished without them.

### How the story is told

Years, not job titles in a table. Each entry is a year or a span, a place, and a short paragraph in the first person. Overlaps stay visible, because the freelance studio ran alongside the staff jobs, and the book happened in the middle of Direct Wines. Each year is an open dot on a hairline.

The home page shows six selected years and links to the full story. The story page is where the employers, the book, and the magazine issues actually get named.

His published about-page paragraphs sit above the timeline, unchanged in substance, so the page opens in a voice that is already his. The timeline sentences under that are new prose built from public facts. They are marked on the page as needing his edit.

Principles come after the life, and only the ones he already published: “Progress over perfection,” and the three steps (understand the problem, design an MVP, test and learn). The long bullet lists under those steps on the current about page are not carried over. They read like a worksheet. The three names are enough unless he wants the lists back.

## Sitemap

| URL | Nav label | Purpose |
| --- | --- | --- |
| `/` | Wordmark | Hello, three featured builds, a short timeline, the book, contact. |
| `/story` | Story | The about prose, the full year-by-year, working style, interests, school. |
| `/lab` | Lab | Side projects from the lab page. Delmarva Community Guide, First Plate Delaware, and Local Sound are not included. |
| `/notes` | Notes | Index of notes. Drafts are badged and, on production, omitted. |
| `/notes/[slug]` | — | One note. Slug is the filename. |
| `/notes/tag/[tag]` | — | Notes with that tag. Same row as the index. Empty tag is a normal empty state, not a 404. |
| `/feed.xml` | — | RSS 2.0 of published notes. Linked from the notes page and the document head. |
| `/sitemap.xml`, `/robots.txt` | — | Generated. Drafts excluded. |

Redirects from the current sites, when this replaces them:

- `/about` → `/story`
- `/writing` → `/notes`
- `/projects` and `/side-projects` → `/lab`

No `/resume` page in the first build. The 2024 PDF and the anonymized résumé on the design site disagree with LinkedIn on dates and titles. See open questions.

Tag pages are specified here and not mocked. They reuse the notes index row, with the title “Notes tagged {tag}”.

## Content model

Notes and projects are files in the repo. An assistant can add a note by adding a file and opening a pull request. No CMS, no database.

### Notes

Path: `content/notes/*.mdx`. A file whose name starts with `_` is a template and is ignored. The slug is the filename, kebab-case, with no date in the name. The date lives in frontmatter so a rename of the title does not require a new URL unless he wants one.

```yaml
---
title: Building in the margins
date: 2026-10-18
summary: One or two sentences. Used on the index, in RSS, and on the social card.
tags:
  - building
  - side-projects
draft: true
# optional
updated: 2026-11-01
image: ./images/example.png
---
```

Required: `title`, `date` (`YYYY-MM-DD`), `summary`, `tags` (array, may be empty), `draft` (boolean). The build fails if a required field is missing, so a bad pull request cannot ship a half-written note.

Tags are lowercase. Multi-word tags use hyphens (`side-projects`). The tag URL is the tag string. `image` is optional and, when present, is the Open Graph image. Otherwise the site generates one from the title and summary.

Template to copy: `content/notes/_template.mdx`, with every required field and a short comment on what each one is for. The README will repeat this block so an assistant can follow it without rereading the plan.

Body is MDX: paragraphs, headings, lists, links. Images used by a note live in `content/notes/images/` and are referenced with a relative path. No invented biography inside a note. If a sentence needs a personal claim that is not already published, the draft says so in a placeholder, or the assistant asks.

`draft: true` means:

- Omitted from production HTML, the RSS feed, and the sitemap.
- Rendered on local dev and on Vercel preview deployments, with the gold draft banner from the mockup.
- Publishing is `draft: false`. That is a deliberate edit, usually Jake’s, in the same pull request or a follow-up.

### Projects

Path: `content/projects/*.md`. Same frontmatter style, no MDX body required. The summary is the card text.

```yaml
---
title: Three Today
summary: A daily focus app with a hard limit of three slots.
status: live # live | building | placeholder
url: https://three-today.com
tags:
  - daily-focus
featured: true
order: 80
---
```

`url` is omitted when there is nothing to link. `status: placeholder` is a card with no link yet. `featured: true` puts it on the home row. `order` follows the lab page. `year` is optional and stays off until Jake supplies it. Launch years are not in the public lab copy, so the plan does not invent them.

### How an assistant adds a note

1. Branch from main. Copy `content/notes/_template.mdx` to `content/notes/<slug>.mdx`.
2. Fill the frontmatter. Start from `draft: true` unless Jake explicitly asked for the note to go live in that pull request.
3. Write the body. Technology, the apps, something he is exploring. Do not invent employers, dates, family, or motives. Use this plan and the published pages as the fact boundary.
4. Open a pull request. The description includes the title, the date, the summary, and whether it is still a draft.
5. Vercel’s preview deploy renders the draft with the banner, so the pull request can be read in the real layout.
6. Jake sets `draft: false` when it should be public. Merging a draft-true file does not publish it.
7. The production build regenerates the index, the tag page, the RSS item, the sitemap entry, and the social card.

A project is the same gesture against `content/projects/`, and it is rarer. The assistant does not add a project Jake has not named.

## Tech stack and Vercel

- Next.js (App Router) and TypeScript. React Server Components for pages. No database, no auth, no CMS.
- Tailwind for layout and the tokens above. The page chrome is custom, matching this mockup. A component library is not part of the first build. The reference is not a dashboard, and the usual component defaults would fight the type and the paper.
- Notes via `gray-matter` and `next-mdx-remote/rsc` (or the equivalent maintained MDX loader if the scaffold has a simpler official path). Compiled at build time.
- Deploy on Vercel with zero config: the framework preset detects Next.js. Production is `main`. Pull requests get preview deployments, which is what makes draft notes reviewable.
- `NEXT_PUBLIC_SITE_URL` defaults to `https://onerutter.com`. Canonical URLs, Open Graph, and the sitemap use it.
- SEO that ships with the app, not as an afterthought: unique `title` and `description` per route, Open Graph images (generated with `next/og` from the title and summary, on the paper background), `sitemap.ts`, `robots.ts`, RSS, and JSON-LD `Person` on the home page. Semantic headings, a skip link, visible focus, and the reduced-motion rule already in the mockup.
- `next/font` for Outfit and Source Serif 4. The mockup vendors the files locally so the screenshots do not depend on a network font. Licenses are in `mockups/fonts/`.
- Light only. Jake declined a dark-mode toggle.
- Node 22, matching current Vercel defaults. No environment secrets required for the first deploy.

## Copy

Three kinds of words are in the mockup. They are easy to tell apart on the page: published paragraphs look like body copy, the timeline carries one “needs an edit” note at the top, and empty spots are dashed clay boxes.

### Published, safe to use

From [onerutter.com/about](https://onerutter.com/about) and the same text on the design site:

- The three about paragraphs beginning “I'm a seasoned digital technology leader…”, including TradeTrek and StrategicPulse as AI products, and the brand list SharkNinja, The North Face, Vans, Priceline.
- “Progress over perfection.”
- The three step names and their one-line descriptions. Not the long bullet lists under them.
- Interests: AI / LLMs, agentic workflows, eCommerce, digital transformation, product management, Next.js / React, Shopify, Salesforce SFRA, headless CMS, Airtable and Notion, pickleball.
- Spare time, in his sentence: friends and family, music, guitar, books, pickleball, exploring.

From [onerutter.com/writing](https://onerutter.com/writing) and the design site’s writing page:

- The book: Wiley approached him after the blog, about three months, 300+ pages, published 8 February 2011 by John Wiley and Sons, over 5,000 copies, copies sent to John Resig and Addy Osmani.
- Web Designer magazine, Imagine Publishing: issue 189, cover story, “jQuery for Designers”; issue 192, twenty jQuery tips in the Hot 100, on the cover; issue 199, a mobile site with Mobify and jQuery.
- “I still write a personal journal almost daily and am starting to get back into blogging.”
- The blog name Always Moving Forward, WordPress, 2008–2012, later moved to Medium.
- His line also says the book and articles were “in 2012,” while the book’s own date on the same page is 8 February 2011. The mockup uses the publication date in the timeline and does not silently “correct” the other sentence. He should pick the line he wants.

From [the lab](https://onerutter-design.vercel.app/side-projects):

- The Lab intro, the weekly-builds paragraph, and “First build coming soon — check back shortly.”
- Blurbs, in his order: TradeTrek, StrategicPulse, First Plate Delaware, Send a Spark, Delmarva Community Guide, Tails over Thames, Mind the Timetable, Three Today, and the creative-music line.
- His tags where he listed them (Next.js, AI/ML, and so on).
- Links that exist on that page: [TradeTrek](https://tradetrek-alpha.vercel.app/), [Send a Spark](https://send-a-spark.vercel.app/), [Delmarva Community Guide](https://delmarvacommunityguide.com/), [Tails over Thames](https://tails-over-thames.vercel.app), [Mind the Timetable](https://mindthetimetable.com), [Three Today](https://three-today.com). StrategicPulse and First Plate Delaware are “Currently Building” and have no URL. The home cards are Tails over Thames, Three Today, and Mind the Timetable. Their card lines are his blurbs, split into a title and a supporting sentence.

From Jake, for this project, not from the old sites:

- He lives in Barnes, London. LinkedIn says the London area and the Battersea office. The site says both: home in Barnes, office in Battersea.

Contact on the site is the /hello form. Profiles: [LinkedIn](https://www.linkedin.com/in/jakerutter/), [Medium](https://jakerutter.medium.com/), [Substack](https://jakerutter.substack.com/), [X](https://twitter.com/jakerutter). The phone number on the 2024 PDF is not used.

### Drafted for this layout

The timeline paragraphs are facts arranged into sentences. He should edit the voice. Sources are his public [LinkedIn](https://www.linkedin.com/in/jakerutter), the [2024 resume PDF](https://onerutter.com/Jake_Rutter_Resume_2024.pdf), the about and writing pages, and the [SharkNinja True Edge note](https://newsroom.sharkninja.com/true-edge-tuesday-with-jake-rutter/).

Included on purpose, because they are public:

- 1999–2000, Stamford: Hathaway, Reiser & Raymond; Offshore Sailing School; Colgate 26s.
- 2001–2003, Champlain College, A.A.S. Web Design and Management. Dean’s List, spring 2002.
- 2002–2014, Rutter Interactive. WordPress, ExpressionEngine, Magento. StamfordCTGuide.com and SoNoCTGuide.com.
- 2003–2009 staff roles: Sellsonic, MusiKube, JupiterMedia, LifeMed / dLife.com, Cullinane, Vertrue, Priceline, FanBoom.com (evenings, closed for lack of funding), RemoTV.
- B.S. Visual Communications, Westwood College of Technology Online, 2005–2007. The PDF also says GPA 3.8 and Dean’s List every semester. That is not on the mockup.
- Direct Wines, 2009–2022, Norwalk, plus Theale for the last few months: senior web designer through VP of Digital User Experience and VP of Global Front-End Engineering. .NET to Oracle ATG, Mobify, React checkout, Optimizely, Contentful (six weeks to two), Next.js and CommerceTools. WSET Level 2 (2015). eCornell Technology Leadership certificate (2022).
- VF Corporation, Connecticut and Delaware, September 2022–October 2024. Director, Global Front-End Engineering. Team of 22. The North Face, Vans, Timberland, Eastpak, JanSport, Kipling, Napapijri, Smartwool, Altra, Icebreaker, Dickies. Commerce Cloud and Vue/Nuxt, eight languages, 24 locales. Contentsquare, December 2023. ELC peer group, 2024–2025.
- SharkNinja from January 2025, Senior Director, Global DTC Engineering, Battersea, after a year remote from the US. True Edge, July 2025. LinkedIn lists VP, DTC Engineering & Applied AI from September 2026.

Left off on purpose, and Jake confirmed the light touch: team size and budget figures, the count of Salesforce sites, the Akamai to Cloudflare cutover, checkout and retention percentages, the small freelance client domains, and the newsroom’s “30 days” line. LinkedIn says six weeks for the Cloudflare cutover, and the newsroom’s 30 days reads like a different episode. The site names neither duration.

The design-site résumé (titles like “Enterprise Retail Company,” and dates that do not match LinkedIn) is not a source for the timeline.

### Approved

- Home headline: “Hi, I'm Jake. I lead DTC engineering at SharkNinja, and I build small apps on the side.”
- Nav: Story, Lab, Notes. URLs `/story`, `/lab`, `/notes`.
- Featured builds: Tails over Thames, Three Today, Mind the Timetable.
- “Selected years” as the home timeline label.
- Monograms on the three home cards (a plane, a 3, a few rules). They are not the real app icons. Real icons can replace them later.

### Still placeholder

- The year-by-year sentences. Facts are public. The wording is drafted and marked “Needs an edit.”

## How to view it

The site is the Next.js app. `npm run dev` serves it locally. Static HTML in `mockups/` is the approved design reference.

- `mockups/index.html` — home
- `mockups/story.html` — story
- `mockups/projects.html` — lab
- `mockups/blog.html` — notes index
- `mockups/post.html` — one note
- `mockups/styleguide.html` — color, type, components, motion

Screenshots of each, at desktop (1440) and mobile (390), are in the artifacts folder for this review.

## Sources

- https://maxclax.com/ — layout, type, color, motion, and the year-by-year shape. Studied 1 Nov 2026. Nothing on that site is reused as content.
- https://onerutter.com, `/about`, `/writing`
- https://onerutter-design.vercel.app, `/about`, `/side-projects`, `/writing`, `/resume`
- https://onerutter.com/Jake_Rutter_Resume_2024.pdf
- https://www.linkedin.com/in/jakerutter
- https://newsroom.sharkninja.com/true-edge-tuesday-with-jake-rutter/
- https://three-today.com, https://mindthetimetable.com, https://tails-over-thames.vercel.app, https://send-a-spark.vercel.app — checked so the lab lines were not expanded past what Jake already published.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# onerutter.com

Canonical guide for coding agents. Jake Rutter's personal site. The running app is the source of truth. [PLAN.md](PLAN.md) is the 1 Nov 2026 design record; later work (Travel, Say hello, Lab color cards) lives in the code. When they disagree, follow the code and this file.

Human overview: [README.md](README.md). How-tos: [docs/](docs/).

## Purpose

A public personal site: who Jake is, the small apps he builds, notes, and a travel timeline. Canonical URL `https://onerutter.com`, hardcoded in `lib/site.ts` (`siteUrl`). There is no CMS, database, or auth. Content is files in this repo, published by merging to `main`.

## Stack

Versions are the ones installed from `package-lock.json`.

| Piece | Version | Role |
| --- | --- | --- |
| Next.js | 16.4.3 | App Router. Read `node_modules/next/dist/docs/` before using a Next API. |
| React / React DOM | 19.3.0 | Server Components by default. `"use client"` only where the file already needs it. |
| TypeScript | 5.9.3 | `strict: true`. Path alias `@/*` → repo root. |
| Tailwind CSS | 4.3.3 | Loaded from `app/globals.css` via `@import "tailwindcss"` and `@tailwindcss/turbopack` in `next.config.ts`. Page chrome is custom CSS in that file, not a component library. |
| ESLint | 9.39.5 | `eslint-config-next` 16.4.3 (`eslint.config.mjs`). |
| MDX | `gray-matter` 4.0.3, `next-mdx-remote` 6.0.0 | Notes and trips are read at build time with `gray-matter`, rendered with `next-mdx-remote/rsc`. |
| sharp | 0.35.5 | Trip photo resize, watermark, and the GPS check. |
| Map | `d3-geo` 3.1.1, `topojson-client` 3.1.0, `world-atlas` 2.0.2 | Static world map on `/travel`. |

`PLAN.md` specifies Node 22 (current Vercel default). This repo has no `engines` field. There is no test script.

## Commands

```bash
npm install
npm run dev       # next dev. Prints its own URL.
npm run build     # next build. Fails on bad frontmatter, a published trip with no places, a centroid finer than two decimals, or a trip photo that still has GPS.
npm start         # next start, after a build.
npm run lint      # eslint
npm run typecheck # tsc --noEmit
```

Trip photographs:

```bash
node scripts/prepare-trip-photos.mjs <slug> <folder-of-photos>
node scripts/prepare-trip-photos.mjs <slug> <folder> --watermark "onerutter.com"
node scripts/prepare-trip-photos.mjs <slug> <folder> --no-watermark
node scripts/generate-sample-album.mjs   # redraws the three sample albums. Not real trips.
```

## Directory map

| Path | What it is |
| --- | --- |
| `app/` | Routes, `layout.tsx`, `globals.css`. |
| `components/` | Header, footer, cards, note list, timeline, trip gallery, travel map, contact form. |
| `content/notes/` | One `.mdx` file per note. `_template.mdx` is ignored. |
| `content/projects/` | One `.md` file per Lab project. |
| `content/trips/<slug>/` | `index.mdx` per trip. Folders starting with `_` are ignored. |
| `lib/` | Loaders, the world map (`world-map.ts`, `map-countries.ts`, `map-types.ts`), and site copy helpers. |
| `public/travel/<slug>/` | Prepared JPEGs. Phone originals do not belong here. |
| `scripts/` | `prepare-trip-photos.mjs`, `generate-sample-album.mjs`. |
| `mockups/` | Approved static HTML reference. Not served by Next. |
| `docs/` | How-tos for notes, trips, and Lab projects. |

## Routes

| URL | Source | What it shows |
| --- | --- | --- |
| `/` | `app/page.tsx` | Hello, three featured builds, six selected years, the book, and up to three latest published notes. JSON-LD `Person`. |
| `/story` | `app/story/page.tsx` | Published about paragraphs, “What draws me in”, full timeline, working style, interests, school. |
| `/lab` | `app/lab/page.tsx` | Every project in `content/projects/`, as color cards. |
| `/notes` | `app/notes/page.tsx` | Dated note rows. |
| `/notes/[slug]` | `app/notes/[slug]/page.tsx` | One note. Slug is the filename. |
| `/notes/tag/[tag]` | `app/notes/tag/[tag]/page.tsx` | Notes with that tag. A tag with no visible notes is a 404. |
| `/travel` | `app/travel/page.tsx` | World map of published places, then a vertical timeline, newest year first. |
| `/travel/[slug]` | `app/travel/[slug]/page.tsx` | Album, only when the trip has a summary, a body, or at least one photo. Other slugs 404. `dynamicParams` is `false`. |
| `/hello` | `app/hello/page.tsx` | Contact form. Header label is “Say hello”. |
| `/feed.xml` | `app/feed.xml/route.ts` | RSS 2.0 of published notes. |
| `/sitemap.xml` | `app/sitemap.ts` | Static routes, published notes, published tags, and published trips that have a page. |
| `/robots.txt` | `app/robots.ts` | Allow `/`, sitemap `https://onerutter.com/sitemap.xml`. |
| `/trip-photos/[slug]/[...file]` | `app/trip-photos/.../route.ts` | Serves a photo that sits beside `index.mdx`, after the GPS check. Prefer `public/travel/`. |

## Content rules

- Do not mention a planned move. `PLAN.md` records that a future return to the US stays off the site. Do not add that chapter.
- Do not invent trip details, captions, place names, or biographical facts. If a sentence needs a personal claim that is not already on the site, leave a placeholder or ask.
- Do not put exact photo locations in alt text, captions, body copy, or image metadata. The build rejects a trip image that still has GPS. The only coordinates in the repo are `places` centroids: a country, capital, or region centre, at most two decimal places. Never a street address or the spot a photograph was taken.
- Keep Jake's wording for the story. The about paragraphs and the “What draws me in” section in `app/story/page.tsx` are his. The year-by-year sentences in `lib/story.ts` are drafted and marked “Needs an edit” on the page. Do not silently rewrite either.
- Drafts stay out of production. `draft: true` is omitted from production HTML, `/feed.xml` (notes), and `/sitemap.xml`. Publishing is an explicit `draft: false`.
- The two files in `content/notes/` are placeholder drafts. They are not Jake's writing. `content/trips/sample-album/`, `sample-strip/`, and `sample-markers/` are generated color fields, not trips he took. Leave them `draft: true`.
- Light touch on operating detail. Team size, budget, site counts, and conversion figures stay off the page, as recorded in `PLAN.md`. No portrait, dark mode, résumé PDF, phone number, GPA, GitHub link, or analytics.

Drafts render when `lib/drafts.ts` says so: `SHOW_DRAFTS=true`, or `VERCEL_ENV=preview`, or `NODE_ENV` is not `production` (local `npm run dev`). A production build (`npm run build` / `npm start`, and the Vercel production deploy) omits them.

`generateStaticParams` for notes returns published notes, and those pages are static. Note and tag routes leave `dynamicParams` at the default, so a preview request can still render a draft. Trip albums set `dynamicParams` to false, and `generateStaticParams` returns only published trips that have a page. Any other slug, including a draft, is a 404 in `next dev`, in `npm start`, and on Vercel. The `/travel` timeline still lists drafts in dev and on preview, and a draft that has photos still shows its strip there. The album route is dynamic (`ƒ` in `next build`) because the page reads `searchParams` for `?photo=`.

## Notes

Path: `content/notes/<slug>.mdx`. The filename is the URL (`building-in-the-margins.mdx` → `/notes/building-in-the-margins`). Lowercase kebab-case. No date in the filename. A file whose name starts with `_` is ignored. Copy `content/notes/_template.mdx`. How-to: [docs/adding-a-note.md](docs/adding-a-note.md).

Required frontmatter, checked in `lib/notes.ts`. The build throws if one is missing or the wrong type.

| Field | Rule |
| --- | --- |
| `title` | Non-empty string. |
| `date` | `YYYY-MM-DD`. Quote it so YAML does not turn it into a Date. A YAML Date is also accepted and stored as UTC `YYYY-MM-DD`. |
| `summary` | Non-empty string. Index line, RSS description, and the social description. |
| `tags` | Array of strings. May be empty. Lowercase; hyphens for more than one word. The tag URL is the tag string. |
| `draft` | Boolean. |
| `updated` | Optional `YYYY-MM-DD`. |
| `image` | Optional path string. The loader stores it. The social card (`app/notes/[slug]/opengraph-image.tsx`) is generated from the title and does not read this field. |

Body is Markdown/MDX: headings, paragraphs, lists, links. Note images go in `content/notes/images/` and are referenced with a relative path. The article body uses Source Serif 4 at 21px / 1.6, measure about 66 characters. Headings inside a note stay in Outfit.

Sort is newest `date` first, then title. Dates on the page use `en-GB` via `formatNoteDate`.

## Trips

Path: `content/trips/<slug>/index.mdx`. The folder name is the URL (`2025-france` → `/travel/2025-france`). Lowercase kebab-case (`lib/trip-assets.ts` `isTripSlug`). Folders starting with `_` are ignored. Copy `content/trips/_template/index.mdx`. One new file is enough for a trip with no photographs. How-to: [docs/adding-a-trip.md](docs/adding-a-trip.md).

Checked in `lib/trips.ts`:

| Field | Rule |
| --- | --- |
| `title` | Required. The timeline name, in Jake's wording (`France`, `Amsterdam / Iceland`). |
| `draft` | Required boolean. |
| `startDate`, `endDate` | Optional. `YYYY-MM-DD` or `YYYY-MM`. Quote them. `endDate` must be on or after `startDate`. A month-only value sorts as the first of that month. |
| `year` | Required only when both dates are absent. Otherwise derived from the dates. A trip that crosses New Year uses `year` when set, and that year must be the start year or the end year. |
| `order` | Required only when both dates are absent. Integer ≥ 1. Lower comes first within that year. |
| `summary` | Optional. Leave it out when there is nothing to write. |
| `place` | Optional string. The timeline and the album show it only when it is set and it is not the same as `title`. This is not the map. |
| `country` | Optional string. Kicker on the album page. This is not the map. |
| `places` | Required when `draft` is false. A draft may omit it. Each entry is `name`, `country`, `lat`, `lng`. `name` is the marker. `country` is the country to tint; a city still names its country (Paris uses France). `lat` and `lng` are a country centroid, a capital, or a region centre, at most two decimal places (`lat` from -90 to 90, `lng` from -180 to 180). Never a street address or an exact photo spot. At least one entry when the field is present. Names in one trip are unique, case-insensitive. |
| `photos` | Optional. Omit the list when there are no photographs. At most 10. Three is the usual set. |
| `cover` | Required when `photos` is set, and it must be one of those `src` values. Forbidden when there are no photos. |

Each photo needs `src` and `alt`. `alt` must be a real description; a value that starts with `TODO` fails the build. `caption` is optional, a single line, at most 160 characters. Album order is the `photos` list. The timeline strip and the album render that whole list. A thumbnail links to `/travel/<slug>?photo=2` (1-based).

The public date line is the month and year of `startDate`, from `formatTripWhen`. Days stay in the file and are what the sort uses. They are not shown. A trip that runs into the next month still shows the start month, so 22 June–5 July 2023 reads June 2023. `startDate: "2026-10"` reads October 2026. If only `endDate` is set, that month is used. With no dates, the line is the year.

`/travel` opens with a static world map (`components/travel-map.tsx`). `buildTravelMap` in `lib/world-map.ts` draws Natural Earth 110m countries (`world-atlas`) with a `d3-geo` Natural Earth projection. Visited countries are tinted. Each `places` entry is a dot. The same `name` on another trip must reuse the same `lat`, `lng`, and `country`, and the marker counts the visits. Dots closer than 6px share one tooltip; each still has its own dot. Tooltip links scroll to that trip’s `id` on the timeline. Drafts are left off the map.

A `country` string has to be a key of `lib/map-countries.ts`. Add its Natural Earth numeric id there when a trip names a country the map does not know yet. `null` means the territory is smaller than the 110m shapes (Saint Martin): it gets a marker and no country fill. A centroid has to fall inside that country’s shape, or the build throws.

Under the map, the line is “N trips · M countries since YEAR”, counted from published trips. M is the number of distinct `places[].country` values. The timeline under that is newest year first. Within a year, dated trips are newest first. A missing start date sorts by the end date. Undated trips follow, by `order`.

With no photographs, the timeline still shows the name and the date, plus “Photos coming soon”. With no photographs, no summary, and no body, the name is plain text and there is no album page. Add a summary, a paragraph, or one photograph and `/travel/<slug>` exists. The sitemap lists that page only then.

`src` is either `/travel/<slug>/01.jpg` (file in `public/travel/<slug>/`) or a relative path beside `index.mdx` such as `01.jpg` (served from `/trip-photos/<slug>/` after the same GPS check). Prefer the script and `public/travel/`.

## Photo pipeline

`scripts/prepare-trip-photos.mjs` is how photographs enter the repo. Phone originals stay out. They carry GPS in EXIF, and sometimes in XMP, and a file in `public/` is world-readable.

```bash
node scripts/prepare-trip-photos.mjs <slug> <folder-of-photos>
```

The script:

- Reads JPEG, PNG, WebP, HEIC, TIFF, or AVIF in that folder only. Nested folders are ignored. Filename order (numeric) is album order.
- Stops if there are more than 10. The error tells you to pick the top 3. Up to 10 is allowed.
- Writes `public/travel/<slug>/01.jpg`, `02.jpg`, and so on.
- Bakes in orientation, scales so the longest side is at most 2400 pixels, and does not enlarge a smaller file.
- Burns `onerutter.com` into the bottom-right: white at 60% opacity, a soft shadow, type and margin about 2.5% of the image width. `--watermark "other text"` changes the words. `--no-watermark` skips it. The two flags cannot be combined.
- Saves a progressive JPEG at quality 82 with EXIF, XMP, and IPTC removed. The watermark is pixels, not metadata.
- Deletes the output and exits if any of that metadata is still present.
- Creates `content/trips/<slug>/index.mdx` with `draft: true` and `alt: "TODO"` when that file does not exist. An existing album is left alone. Add the `photos` list to the file that is already there.

`lib/trip-assets.ts` calls `assertNoGps` (`lib/gps.ts`) for every trip image during the build. The build throws if EXIF contains a GPS IFD (`0x8825`) or if XMP matches GPS latitude, longitude, altitude, or position fields. An EXIF block that cannot be parsed also fails the build. Run the script rather than copying a phone photograph into the repo. Thumbnails use `object-position: right bottom` so the watermarked corner stays in frame.

## Lab

Projects are `content/projects/*.md`, loaded by `lib/projects.ts`. How-to: [docs/adding-a-lab-project.md](docs/adding-a-lab-project.md).

Required: `title`, `summary`, `status` (`live`, `building`, or `placeholder`), `tags` (array of strings), `featured` (boolean), `order` (number). Optional: `url` (absolute; omit when there is nothing to link), `homeOrder`, `kicker`, `cardTitle`, `cardSummary`. A featured project must have a `url`. The build fails otherwise.

`featured: true` plus `homeOrder` puts a project on the home row, in `homeOrder`. The home row is the three Jake chose: Tails over Thames (`homeOrder` 1), Three Today (2), Mind the Timetable (3). Home card materials and monograms are hardcoded in `components/build-card.tsx` for those three slugs. Do not add a project Jake has not named.

Lab cards (`components/lab-card.tsx`) use a stable tone per slug. A new slug falls back to navy, cyan, yellow, peach, pink, repeating with its index. Status text comes from `statusLabel`: Live, Building, or “No link yet”. A card with a `url` is a link. A card without one is an article.

Palette, in `app/globals.css`:

| Tone | Background | Text |
| --- | --- | --- |
| navy | `#0A1045` | `#FFFFFF` |
| cyan | `#00C2D1` | `#0A1045` |
| yellow | `#F9E900` | `#0A1045` |
| peach | `#F6AF65` | `#0A1045` |
| pink | `#ED33B9` | `#0A1045` |

White on `#ED33B9` is 3.64:1, under AA at this size. Navy on pink is 4.92:1, which is why the pink card uses navy text. Keep that pairing. Focus rings on Lab cards are `#0A1045`.

## Design

Tokens live in `app/globals.css` (`:root` and the Tailwind `@theme` block).

| Token | Hex | Use |
| --- | --- | --- |
| Paper | `#F3EEE6` | Page background |
| Paper deep | `#E7E0D4` | Bands |
| Ink | `#1B1714` | Headlines and body |
| Ink soft | `#3F3A36` | Secondary paragraphs |
| Muted | `#5C564E` | Dates, captions |
| Thames | `#1E4A42` | Live status, note links, pull quote |
| Thames deep | `#14352F` | Home headline gradient start |
| Clay | `#C45C32` | Kickers, focus ring |
| Clay deep | `#8E3B22` | “Say hello”, labels |
| Gold soft | `#F6E2C4` | Draft banner and draft pill |
| Cream | `#FBF7F1` | Text on the ink and clay home cards |

Outfit is the interface font, loaded with `next/font` in `app/layout.tsx` (weights 400–800, CSS variable `--font-outfit`). Source Serif 4 (`--font-source-serif`, weights 400 and 600) is for the body of a note and for trip MDX body text. Open Graph images read `mockups/fonts/outfit-600.ttf`. The mockup licenses are in `mockups/fonts/`.

Light only (`color-scheme: light`). Home headline is the gradient from Thames deep through Thames into clay. Focus is a 2px clay outline. `prefers-reduced-motion: reduce` turns animations and transitions off. The visual reference for the first build is `mockups/`. Lab cards are a later treatment and are not in those mockups.

## Contact form

“Say hello” goes to `/hello`. `components/contact-form.tsx` posts to the server action `sendHello` in `app/hello/actions.ts`, which sends through the Resend API (`https://api.resend.com/emails`). Nothing about the recipient or the sender is stored in the repo.

| Variable | Required | What it is |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | API key from Resend. |
| `CONTACT_TO_EMAIL` | yes | Inbox that receives the note. `name@domain` or `Name <name@domain>`. |
| `CONTACT_FROM_EMAIL` | yes | Sender Resend will accept. Same shape. The domain has to be verified in Resend. |
| `SHOW_DRAFTS` | no | `true` forces drafts to render. Preview and `next dev` already show them. |

Set the three required variables in Vercel for Production and Preview, and locally in `.env.local` (gitignored). See `.env.example`. The page still renders when they are missing. A submit then shows “I can't send notes from here yet. Please try again later.”

The honeypot is the field `hp_field`, hidden, `tabIndex={-1}`, `autoComplete="off"`. If it is non-empty, the action returns success and does not send. Name is limited to 80 characters, email to 254, message to 5000.

## Deploy

Vercel, no `vercel.json` and no extra framework config. Production auto-deploys `main`. Each pull request gets a preview deployment. Preview builds set `VERCEL_ENV=preview`, which is what makes drafts visible for review. Production omits drafts.

## Pull requests

Keep a pull request small and focused. Run `npm run lint`, `npm run typecheck`, and `npm run build` before pushing. A UI change needs screenshots. A note PR includes the title, date, summary, whether it is still a draft, and the Vercel preview URL straight to the note (`https://<preview>/notes/<slug>`). That link is the review, not screenshots. A trip PR says whether dates, photographs, and `draft` are final. Leave `draft: true` unless Jake asked for that change to go live.

Merging a file that is still `draft: true` does not publish it.

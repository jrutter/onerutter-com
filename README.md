# onerutter.com

Personal site for Jake Rutter. Next.js (App Router) and TypeScript, ready for Vercel with no extra config. The canonical URL is `https://onerutter.com`.

Design notes and the content rules are in [PLAN.md](PLAN.md). The approved visual reference is the static HTML in `mockups/`.

## Run it locally

```bash
npm install
npm run dev
```

The dev server prints its URL. Production check:

```bash
npm run build
npm start
```

Draft notes and draft trip albums are visible when `NODE_ENV` is not `production` (so, during `npm run dev`) and on Vercel preview deployments. They are omitted from the production site, `/feed.xml` (notes), and `/sitemap.xml`.

## Routes

- `/` home
- `/story`
- `/lab`
- `/notes`
- `/notes/[slug]`
- `/notes/tag/[tag]`
- `/travel`
- `/travel/[slug]`
- `/feed.xml` RSS
- `/sitemap.xml`
- `/robots.txt`

## Adding a note

Notes are MDX files. An assistant, or Jake, adds one by copying the template and opening a pull request. No CMS.

1. Copy `content/notes/_template.mdx` to `content/notes/<slug>.mdx`.
2. The filename is the URL. `content/notes/building-in-the-margins.mdx` is served at `/notes/building-in-the-margins`. Use lowercase kebab-case. Do not put the date in the filename. Files that start with `_` are ignored.
3. Fill the frontmatter. Every field below is required except `updated` and `image`. The build fails if a required field is missing or the wrong type.

```yaml
---
title: Title of the note
date: "2026-11-01"          # YYYY-MM-DD, quoted so it stays a string
summary: One or two sentences for the index, the RSS feed, and the social card.
tags:                       # lowercase, hyphenated when a tag is more than one word
  - technology
draft: true                 # true hides it on production; false publishes it
# updated: "2026-11-02"     # optional
# image: ./images/example.png  # optional social image
---
```

4. Write the body in Markdown (headings, paragraphs, lists, links). Images used by a note go in `content/notes/images/` and are referenced with a relative path.
5. Leave `draft: true` unless Jake has asked for the note to go live in that pull request. A draft shows locally and on the Vercel preview, with a banner, so the pull request can be read in the real layout. It is not in the production HTML, the RSS feed, or the sitemap.
6. Open a pull request. Include the title, date, summary, and whether it is still a draft.
7. Publishing is a deliberate edit: set `draft: false`. Merging a file that is still `draft: true` does not publish it.

Write about technology, the apps, or something Jake is exploring. Do not invent biographical facts. If a sentence needs a personal claim that is not already on the site, mark it as a placeholder or ask.

The two files already in `content/notes/` are placeholder drafts. Replace them. Do not treat them as Jake's writing.

Projects live in `content/projects/*.md` with `title`, `summary`, `status` (`live`, `building`, or `placeholder`), `tags`, `featured`, and `order`. `url` is omitted when there is nothing to link. `featured: true` plus `homeOrder` puts a project on the home row. The home row is the three Jake chose: Tails over Thames, Three Today, and Mind the Timetable.

## Adding a trip

Adding a trip is one new file. Copy `content/trips/_template/index.mdx` to `content/trips/<slug>/index.mdx`. The folder name is the URL: `2025-france` is `/travel/2025-france`, `2017-dublin` is `/travel/2017-dublin`. Use lowercase kebab-case. Folders whose names start with `_` are ignored. No other file, list, or component has to change.

`title` and `draft` are required. Dates, the intro, place, country, and photographs are optional. The build fails if `draft` is missing, a date is not `YYYY-MM-DD`, `photos` has more than 10 entries, or `cover` is set and is not one of those `src` values.

A dated trip:

```yaml
---
title: France
startDate: "2025-06-05"   # YYYY-MM-DD, quoted so YAML does not turn it into a Date
endDate: "2025-06-21"
draft: false              # true hides it on production and in the sitemap
---
```

Dates unknown. The timeline shows the year only, with no month or day. `order` is required then, and lower comes first within that year. Leave a `# TODO:` next to the missing dates.

```yaml
---
title: Paris
year: 2026
order: 1
# TODO: dates unknown.
draft: false
---
```

One known date is enough. Ireland ends on 12 November 2025 and the start is still open, so the file sets `endDate` only and the line reads “– 12 November 2025”.

`title` is the name on the timeline, written the way Jake gave it (`France`, `Amsterdam / Iceland`). Leave `summary` out when there is no intro to write. `place` and `country` are optional; the timeline shows `place` only when it adds something the title does not. A trip that crosses New Year is grouped under `year` when that field is set, otherwise under the year of `startDate`.

`/travel` is a vertical timeline, newest year first. Within a year, trips with dates are newest first. A missing start date sorts by the end date. Trips with no dates follow, in `order`. The small line under the introduction, such as “29 trips since 2009”, is counted from the published trips. Drafts are left out of that count.

With no photographs, the entry still shows the name and the dates, plus a quiet “Photos coming soon”. With no photographs, no summary, and no body, the name is text, not a link, and there is no album page to 404. Add a summary, a paragraph, or at least one photograph and `/travel/<slug>` appears. The sitemap lists that page only then.

Leave `draft: true` unless Jake has asked for the trip to go live in that pull request. A draft shows locally and on the Vercel preview, with a banner. It is omitted from the production HTML and the sitemap. Publishing is setting `draft: false`.

### Photographs

Photographs are added to that same `index.mdx`. Phone originals stay out of the repo. They carry GPS in EXIF, and sometimes in XMP, and a file in `public/` is world-readable.

1. Pick the photographs. Three is the usual album. Up to 10 is allowed. Put only those files in one folder (JPEG, PNG, WebP, HEIC, TIFF, or AVIF). Rename them if the filename order is not the order Jake wants. Nested folders are ignored.
2. Run:

```bash
node scripts/prepare-trip-photos.mjs <slug> <folder-of-photos>
```

The script:

- Writes `public/travel/<slug>/01.jpg`, `02.jpg`, and so on.
- Scales so the longest side is at most 2400 pixels, and does not enlarge a smaller file. That covers the album column and a full-screen view on a typical retina laptop without shipping a 4000-pixel phone original.
- Burns `onerutter.com` into the bottom-right corner: white at 60% opacity, a soft shadow, with the type and the margin about 2.5% of the image width. Change the words with `--watermark "other text"`, or skip it with `--no-watermark`.
- Bakes in orientation, then saves a progressive JPEG at quality 82 with EXIF, XMP, and IPTC removed, including GPS. The watermark is pixels, not metadata.
- Refuses to keep a file if any of that metadata survives.
- Creates `content/trips/<slug>/index.mdx` with `draft: true` when that file does not exist yet. An existing album is left alone. Add the `photos` list to the file that is already there.

3. Point `cover` at one `src` and write a real `alt` for each photo. `alt` cannot stay `TODO`. A caption is optional and must be a single line of at most 160 characters. Album order is the `photos` list. A thumbnail opens `/travel/<slug>?photo=2` (1-based) on that frame.

```yaml
---
title: France
startDate: "2025-06-05"
endDate: "2025-06-21"
cover: /travel/2025-france/01.jpg
draft: false
photos:
  - src: /travel/2025-france/01.jpg
    alt: What is in the photograph, for someone who cannot see it.
    caption: Optional one line. Leave it blank for no caption.
---
```

Images can also sit beside `index.mdx` and be referenced as `01.jpg` (no leading slash). The site serves those from `/trip-photos/<slug>/` after the same GPS check. Prefer the script and `public/travel/<slug>/`.

The build rejects a trip image that still contains GPS EXIF or GPS in XMP, including one that was resized somewhere else. Run the script rather than copying a phone photograph into the repo.

`content/trips/sample-album/`, `sample-strip/`, and `sample-markers/` are draft layout samples in three different years, three colour fields each. They are produced by `node scripts/generate-sample-album.mjs`, which draws the fields and then runs the prepare script so the corner watermark is the real one. They are not photographs and not trips Jake took. They stay `draft: true`, so production, the sitemap, and the trip count leave them out.

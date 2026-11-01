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

Trip albums are folders. An assistant adds one from photographs Jake sends. Do not commit the originals. Phone photographs carry GPS in EXIF, and sometimes in XMP, and a file in `public/` is world-readable.

1. Pick your top 3 photographs. Up to 10 is allowed when three is not enough. Put only those files in one folder (JPEG, PNG, WebP, HEIC, TIFF, or AVIF). Rename them if the filename order is not the order Jake wants. Nested folders are ignored.
2. Run:

```bash
node scripts/prepare-trip-photos.mjs <slug> <folder-of-photos>
```

`<slug>` is lowercase kebab-case and becomes the URL: `lisbon-2026` is `/travel/lisbon-2026`. The script:

- Writes `public/travel/<slug>/01.jpg`, `02.jpg`, and so on.
- Scales so the longest side is at most 2400 pixels, and does not enlarge a smaller file. That covers the album column and a full-screen view on a typical retina laptop without shipping a 4000-pixel phone original.
- Burns `onerutter.com` into the bottom-right corner: white at 60% opacity, a soft shadow, with the type and the margin about 2.5% of the image width. Change the words with `--watermark "other text"`, or skip it with `--no-watermark`.
- Bakes in orientation, then saves a progressive JPEG at quality 82 with EXIF, XMP, and IPTC removed, including GPS. The watermark is pixels, not metadata.
- Refuses to keep a file if any of that metadata survives.
- Creates `content/trips/<slug>/index.mdx` with `draft: true` when that file does not exist yet. It will not overwrite an existing album.

3. Fill the frontmatter. The build fails if a required field is missing, a date is not `YYYY-MM-DD`, there are zero photos or more than 10, or `cover` is not one of the photo `src` values. `alt` cannot stay `TODO`. Three photographs is the layout the timeline and the album are designed around.

```yaml
---
title: Trip title
place: City or region
country: Country
startDate: "2026-06-01"   # quoted so YAML does not turn it into a Date
endDate: "2026-06-07"
cover: /travel/lisbon-2026/01.jpg
summary: One or two sentences. This is the intro on the album and the social description.
draft: true
photos:
  - src: /travel/lisbon-2026/01.jpg
    alt: What is in the photograph, for someone who cannot see it.
    caption: Optional one line. Leave it blank for no caption.
---
```

`/travel` is a vertical timeline, newest first, grouped by the year of `startDate`. Each entry shows the name, place, dates, the summary, and the photographs. A thumbnail opens `/travel/<slug>?photo=2` (1-based) on that frame. Album order is the `photos` list. A caption is optional and must be a single line of at most 160 characters.

Images can also sit beside `index.mdx` and be referenced as `01.jpg` (no leading slash). The site serves those from `/trip-photos/<slug>/` after the same GPS check. Prefer the script and `public/travel/<slug>/`.

4. Leave `draft: true` unless Jake has asked for the album to go live in that pull request. A draft shows locally and on the Vercel preview, with a banner. It is not in the production HTML or the sitemap.
5. Open a pull request. Include the title, place, dates, and whether it is still a draft.
6. Publishing is a deliberate edit: set `draft: false`.

The build also rejects a trip image that still contains GPS EXIF or GPS in XMP, including one that was resized somewhere else. Run the script rather than copying a phone photograph into the repo.

`content/trips/sample-album/`, `sample-strip/`, and `sample-markers/` are draft layout samples in three different years, three colour fields each. They are produced by `node scripts/generate-sample-album.mjs`, which draws the fields and then runs the prepare script so the corner watermark is the real one. They are not photographs and not trips Jake took. Replace them. Do not set those files to `draft: false`.

A copy-ready frontmatter file also lives at `content/trips/_template/index.mdx`. Folders whose names start with `_` are ignored.

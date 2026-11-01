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

Draft notes are visible when `NODE_ENV` is not `production` (so, during `npm run dev`) and on Vercel preview deployments. They are omitted from the production site, `/feed.xml`, and `/sitemap.xml`.

## Routes

- `/` home
- `/story`
- `/lab`
- `/notes`
- `/notes/[slug]`
- `/notes/tag/[tag]`
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

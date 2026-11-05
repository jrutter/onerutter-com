# Adding a note

Notes are MDX files in the repo. There is no CMS. Copy the template and open a pull request.

1. Copy `content/notes/_template.mdx` to `content/notes/<slug>.mdx`.
2. The filename is the URL. `content/notes/having-fun-with-grokbot.mdx` is `/notes/having-fun-with-grokbot`. Use lowercase kebab-case. Do not put the date in the filename. Files that start with `_` are ignored.
3. Fill the frontmatter. `title`, `date`, `summary`, `tags`, and `draft` are required. `date` is the day the note was added. The build fails if one is missing or the wrong type. The index, tag pages, and the note itself show it as “Added 1 Nov 2026”.

```yaml
---
title: Title of the note
date: "2026-11-01"          # the day the note was added. YYYY-MM-DD, quoted so it stays a string
summary: One or two sentences for the index, the RSS feed, and the social card.
tags:                       # lowercase, hyphenated when a tag is more than one word
  - technology
draft: true                 # true hides it on production; false publishes it
cover: /note-covers/title-of-the-note.svg
coverAlt: What the illustration shows.
# updated: "2026-11-02"     # optional revision day; the page then also shows “Updated …”
# image: ./images/example.png  # optional; the generated social card does not read this
---
```

4. Add an illustrated SVG cover at `public/note-covers/<slug>.svg` and point `cover` at `/note-covers/<slug>.svg`. Every new note ships with that file and with `coverAlt`. Draw it in the site’s style: flat shapes on a 1200×750 canvas, using the Lab palette (navy `#0A1045`, cyan `#00C2D1`, yellow `#F9E900`, peach `#F6AF65`, pink `#ED33B9`) with paper `#F3EEE6`, Thames `#1E4A42`, and clay `#C45C32`. Match the covers already in `public/note-covers/`. The notes index uses it on the card. The note page shows the title, the added date, and the tags, then the cover. The social card uses that picture. `coverAlt` describes the drawing. The build fails if the file is missing, the path leaves `public/`, or `coverAlt` is set on its own. Without `cover`, the index draws a colour pattern from the title and tags. A new note still includes the SVG.

5. Write the body in Markdown (headings, paragraphs, lists, links). Images used by a note go in `content/notes/images/` and are referenced with a relative path. The body is set in Source Serif 4.
6. Leave `draft: true` unless Jake has asked for the note to go live in that pull request. A draft shows during `npm run dev` and on a Vercel preview deployment, with a banner. Production HTML, `/feed.xml`, and `/sitemap.xml` omit it.
7. Open a pull request. Include the title, date, summary, and whether it is still a draft. Run `npm run lint`, `npm run typecheck`, and `npm run build` before pushing. Skip screenshots. When the Vercel preview deploy is ready, add the preview URL of each changed page to the pull request and the report, including the note (`https://<preview-host>/notes/<slug>`).
8. Publishing is a deliberate edit: set `draft: false`. Merging a file that is still `draft: true` does not publish it.

Write about technology, the apps, or something Jake is exploring. Do not invent biographical facts. If a sentence needs a personal claim that is not already on the site, mark it as a placeholder or ask.

A tag page is `/notes/tag/<tag>`. A tag with no visible notes is a 404.

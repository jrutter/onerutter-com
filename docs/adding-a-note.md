# Adding a note

Notes are MDX files in the repo. There is no CMS. Copy the template and open a pull request.

1. Copy `content/notes/_template.mdx` to `content/notes/<slug>.mdx`.
2. The filename is the URL. `content/notes/building-in-the-margins.mdx` is `/notes/building-in-the-margins`. Use lowercase kebab-case. Do not put the date in the filename. Files that start with `_` are ignored.
3. Fill the frontmatter. `title`, `date`, `summary`, `tags`, and `draft` are required. The build fails if one is missing or the wrong type.

```yaml
---
title: Title of the note
date: "2026-11-01"          # YYYY-MM-DD, quoted so it stays a string
summary: One or two sentences for the index, the RSS feed, and the social card.
tags:                       # lowercase, hyphenated when a tag is more than one word
  - technology
draft: true                 # true hides it on production; false publishes it
# updated: "2026-11-02"     # optional
# image: ./images/example.png  # optional; the generated social card does not read this
---
```

4. Write the body in Markdown (headings, paragraphs, lists, links). Images used by a note go in `content/notes/images/` and are referenced with a relative path. The body is set in Source Serif 4.
5. Leave `draft: true` unless Jake has asked for the note to go live in that pull request. A draft shows during `npm run dev` and on a Vercel preview deployment, with a banner. Production HTML, `/feed.xml`, and `/sitemap.xml` omit it.
6. Open a pull request. Include the title, date, summary, and whether it is still a draft. When the Vercel preview deploy is ready, add the preview URL of the note itself (`https://<preview-host>/notes/<slug>`). That link is how the note is reviewed. Do not attach screenshots. Run `npm run build` before pushing.
7. Publishing is a deliberate edit: set `draft: false`. Merging a file that is still `draft: true` does not publish it.

Write about technology, the apps, or something Jake is exploring. Do not invent biographical facts. If a sentence needs a personal claim that is not already on the site, mark it as a placeholder or ask.

The two files already in `content/notes/` are placeholder drafts. They are not Jake's writing.

A tag page is `/notes/tag/<tag>`. A tag with no visible notes is a 404.

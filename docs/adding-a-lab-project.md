# Adding a Lab project

Lab entries are Markdown files in `content/projects/`. Add one only when Jake has named the project. The loader is `lib/projects.ts`. The Lab page lists every file except names that start with `_`, sorted by `order`.

Copy an existing file to `content/projects/<slug>.md`. The filename is the slug used for the card color.

```yaml
---
title: Project name
summary: The sentence on the Lab card, in Jake's wording.
status: live            # live, building, or placeholder
url: https://example.com  # omit when there is nothing to link
tags: []
featured: false
order: 100              # Lab sort. Lower comes first.
# homeOrder: 4          # only for a home-row card, together with featured: true
# kicker: Short label
# cardTitle: Home card line
# cardSummary: Home card supporting sentence
---
```

Required: `title`, `summary`, `status`, `tags` (a list of strings), `featured` (boolean), `order` (number). `url` must be absolute when it is set. A `featured: true` project must have a `url`. The build fails if a required field is missing or the wrong type.

Status labels on the card are Live, Building, and “No link yet” (`placeholder`). A card with a `url` links out. A card without one is not a link.

The home row is a separate treatment. It is Tails over Thames (1), Three Today (2), Mind the Timetable (3), and Bangers & Postcodes (4). Their paper, ink, and clay materials and the monograms are hardcoded in `components/build-card.tsx` for those slugs. Putting `featured: true` on another project adds a home card, and an unmapped slug falls back to the paper card with a “3” monogram. Do that only when Jake asks, and give the new slug its own entry in `presentation`.

Lab card colors are assigned in `toneBySlug` inside `components/lab-card.tsx`. Add the new slug there. If you skip it, the card rotates through navy, cyan, yellow, peach, and pink based on its index.

| Tone | Background | Text |
| --- | --- | --- |
| navy | `#0A1045` | white |
| cyan | `#00C2D1` | `#0A1045` |
| yellow | `#F9E900` | `#0A1045` |
| peach | `#F6AF65` | `#0A1045` |
| pink | `#ED33B9` | `#0A1045` |

The pink card uses navy text because white on `#ED33B9` is 3.64:1, under AA at this size. Navy on pink is 4.92:1. Keep that pairing.

Do not invent a summary. Use the line Jake wrote. Local Sound is a placeholder: the public copy does not use that name, and the file says so. Leave it until Jake writes the line.

Run `npm run lint`, `npm run typecheck`, and `npm run build` before pushing. Skip screenshots. When the Vercel preview is ready, add the preview URL of each changed page to the pull request and the report.

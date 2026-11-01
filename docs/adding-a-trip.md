# Adding a trip

A trip with no photographs is one new file. Copy `content/trips/_template/index.mdx` to `content/trips/<slug>/index.mdx`. The folder name is the URL: `2025-france` is `/travel/2025-france`. Use lowercase kebab-case. Folders whose names start with `_` are ignored. No other list or component has to change.

`title` and `draft` are required. Dates, the intro, `place`, `country`, and photographs are optional. The build fails if `draft` is missing, a date is not `YYYY-MM-DD` or `YYYY-MM`, `photos` has more than 10 entries, or `cover` is set and is not one of those `src` values.

Do not invent dates, captions, or place names. Use the title Jake gave (`France`, `Amsterdam / Iceland`). Leave `summary` out when there is no intro to write. `place` is optional and the timeline shows it only when it adds something the title does not.

A dated trip:

```yaml
---
title: France
startDate: "2025-06-05"   # YYYY-MM-DD, quoted
endDate: "2025-06-21"
draft: false
---
```

The page shows the month and year of the start, such as June 2025. Days stay in the file and are what the timeline sorts on. They are not shown. A trip that runs into the next month still shows the start month, so 22 June–5 July 2023 reads June 2023. A month with no day is `startDate: "2026-10"`, quoted, and reads October 2026. If only the end date is known, the line uses that month.

When both dates are unknown, set `year` and `order` (lower comes first within that year). The line is the year only. Leave a `# TODO:` next to the missing dates.

```yaml
---
title: Paris
year: 2026
order: 1
# TODO: dates unknown.
draft: false
---
```

`/travel` is a vertical timeline, newest year first. Within a year, trips with dates are newest first. A missing start date sorts by the end date. Trips with no dates follow, in `order`. The count under the introduction (“N trips since YEAR”) includes published trips only.

With no photographs, the entry still shows the name and the dates, plus “Photos coming soon”. With no photographs, no summary, and no body, the name is text and there is no album page. Add a summary, a paragraph, or at least one photograph and `/travel/<slug>` appears. The sitemap lists that page only then.

Leave `draft: true` unless Jake asked for the trip to go live. A draft is listed on `/travel` during `next dev` and on a Vercel preview, and a draft that has photos still shows its strip there. The album URL is a 404 until `draft` is false: `generateStaticParams` returns only published trips, and `dynamicParams` is false, including under `next dev`. Publishing is `draft: false`.

## Photographs

Phone originals stay out of the repo. They carry GPS, and a file in `public/` is world-readable. Do not put coordinates or an exact spot in `alt`, `caption`, or the body.

1. Pick the photographs. Three is the usual album (the top 3). Up to 10 is allowed. Put only those files in one folder (JPEG, PNG, WebP, HEIC, TIFF, or AVIF). Rename them if the filename order is not the order Jake wants. Nested folders are ignored.
2. Run the prepare script from the repo root:

```bash
node scripts/prepare-trip-photos.mjs <slug> <folder-of-photos>
```

The script writes `public/travel/<slug>/01.jpg`, `02.jpg`, and so on. It bakes in orientation, scales the longest side to at most 2400 pixels (and does not enlarge a smaller file), and saves a progressive JPEG at quality 82. It strips EXIF, XMP, and IPTC, including GPS, and refuses to keep a file if any of that metadata survives.

The watermark is on by default: `onerutter.com`, bottom-right, white at 60% opacity, with a soft shadow. Type size and margin are about 2.5% of the image width. The mark is burned into the pixels.

```bash
node scripts/prepare-trip-photos.mjs <slug> <folder> --watermark "onerutter.com"
node scripts/prepare-trip-photos.mjs <slug> <folder> --no-watermark
```

Use one flag or the other. `--no-watermark` skips the mark. An existing `index.mdx` is left alone. If the file does not exist yet, the script creates one with `draft: true` and `alt: "TODO"`.

3. Point `cover` at one `src` and write a real `alt` for each photo. `alt` cannot stay `TODO`. A caption is optional, a single line of at most 160 characters. Album order is the `photos` list. A thumbnail opens `/travel/<slug>?photo=2` (1-based).

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

Images can also sit beside `index.mdx` and be referenced as `01.jpg`. The site serves those from `/trip-photos/<slug>/` after the same GPS check. Prefer the script and `public/travel/<slug>/`.

`npm run build` rejects a trip image that still contains GPS EXIF or GPS in XMP. Run the script rather than copying a phone photograph into the repo.

`content/trips/sample-album/`, `sample-strip/`, and `sample-markers/` are draft layout samples (three color fields each), produced by `node scripts/generate-sample-album.mjs`. They are not photographs and not trips Jake took. Leave them `draft: true`.

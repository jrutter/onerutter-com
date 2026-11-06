# Adding a trip

A trip with no photographs is one new file. Copy `content/trips/_template/index.mdx` to `content/trips/<slug>/index.mdx`. The folder name is the URL: `2025-france` is `/travel/2025-france`. Use lowercase kebab-case. Folders whose names start with `_` are ignored. No other list or component has to change.

`title` and `draft` are required. `places`, dates, the intro, `place`, `country`, and photographs are optional. The build fails if `draft` is missing, a date is not `YYYY-MM-DD` or `YYYY-MM`, a coordinate has more than two decimal places, `photos` has more than 10 entries, or `cover` is set and is not one of those `src` values.

Do not invent dates, captions, or place names. Use the title Jake gave (`France`, `Amsterdam / Iceland`). Leave `summary` out when there is no intro to write. `place` is an optional string, separate from `places`, and the timeline shows it only when it adds something the title does not.

## Places

`places` is optional. The site stores it and does not draw it. Leave entries that are already in a file. One entry per place: `name`, `country`, `lat`, and `lng`. A city still names its country, the way Paris uses France. `lat` and `lng` are a country centroid, a capital, or a region centre, written to at most two decimal places. Never a street address, and never the exact spot a photograph was taken. Names in one trip are unique, ignoring case. A draft or a published trip may omit the field. When it is present it needs at least one entry.

A dated trip, using the centroid already on the France trip. These examples have no photographs, so they stay off `/travel` until a `photos` list is added:

```yaml
---
title: France
startDate: "2025-06-05"   # YYYY-MM-DD, quoted
endDate: "2025-06-21"
draft: false
places:
  - name: France
    country: France
    lat: 46.23
    lng: 2.21
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
places:
  - name: Paris
    country: France
    lat: 48.86
    lng: 2.35
---
```

`/travel` is a vertical timeline, newest year first. It lists a trip only when that trip has at least one photograph. A trip with no photographs stays in `content/trips/` and is left off the index, the timeline, the sitemap, and `/travel/<slug>`. That URL is a 404. `generateStaticParams` does not include it. Adding a `photos` list is enough for the trip to appear on the next build: the index, the sitemap, and the album page pick it up. No other file has to change. The home page does not list trips. Within a year, trips with dates are newest first. A missing start date sorts by the end date. Trips with no dates follow, in `order`.

If nothing has photographs yet, the page keeps the heading and says photographs will show up here. A short list, even a single album, is the timeline on its own.

Leave `draft: true` unless Jake asked for the trip to go live. A draft with photographs is listed on `/travel` during `next dev` and on a Vercel preview. A draft with no photographs is hidden there too. The album URL is a 404 until `draft` is false and the trip has at least one photograph: `generateStaticParams` returns only published trips that have photographs, and `dynamicParams` is false, including under `next dev`. Publishing is `draft: false`.

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

`position` is optional on a photo. The `/travel` strip crops each thumbnail to 4:3. Leave `position` off and that crop stays at the bottom-right, so the watermark remains in the frame. Set it when the crop cuts off the subject:

| `position` | `object-position` |
| --- | --- |
| omitted | `right bottom` |
| `top` | `center 15%` |
| `center` | `center` |
| `bottom` | `right bottom` |

Any other value fails the build. The album page shows the whole photograph. The gallery applies the same position, and it changes the picture only when that frame is cropped.

```yaml
---
title: France
startDate: "2025-06-05"
endDate: "2025-06-21"
draft: false
places:
  - name: France
    country: France
    lat: 46.23
    lng: 2.21
cover: /travel/2025-france/01.jpg
photos:
  - src: /travel/2025-france/01.jpg
    alt: What is in the photograph, for someone who cannot see it.
    caption: Optional one line. Leave it blank for no caption.
    # position: top
---
```

Images can also sit beside `index.mdx` and be referenced as `01.jpg`. The site serves those from `/trip-photos/<slug>/` after the same GPS check. Prefer the script and `public/travel/<slug>/`.

`npm run build` rejects a trip image that still contains GPS EXIF or GPS in XMP. Run the script rather than copying a phone photograph into the repo.

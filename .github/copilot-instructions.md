# GitHub Copilot

See [AGENTS.md](../AGENTS.md). That file is the canonical guide. Follow it when this summary and the code disagree.

onerutter.com is Jake Rutter's personal site. Next.js 16.4.3 (App Router), React 19.3, TypeScript 5.9, Tailwind CSS 4, MDX via `gray-matter` and `next-mdx-remote`. Vercel deploys `main` to production and opens a preview for each pull request.

Commands: `npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`.

- Notes: `content/notes/<slug>.mdx`. Required frontmatter: `title`, `date` (`YYYY-MM-DD`), `summary`, `tags`, `draft`. Files starting with `_` are ignored.
- Trips: `content/trips/<slug>/index.mdx`. Required: `title`, `draft`. A published trip also needs `places` (country or city centroids, at most two decimal places, never an exact spot). Those places draw the world map on `/travel`. Dates are optional `YYYY-MM-DD` or `YYYY-MM` and display as a month and year. Photographs: usual 3, maximum 10, prepared with `node scripts/prepare-trip-photos.mjs`. Watermark defaults on; `--no-watermark` skips it.
- Do not invent biographical facts, trip details, captions, or place names. Do not mention a planned move. Do not expose exact photo locations. Keep drafts out of production and off the travel map. Keep Jake's story wording.
- Lab cards: `#0A1045`, `#00C2D1`, `#F9E900`, `#F6AF65`, `#ED33B9`. Pink text is navy, because white on `#ED33B9` is under AA.
- Site chrome: Outfit, warm paper `#F3EEE6`, Thames `#1E4A42`, clay `#C45C32`.
- Contact form: Resend server action. Env vars `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`. Honeypot is `hp_field`.

How-tos live in `docs/`.

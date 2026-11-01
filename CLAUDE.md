# Claude Code

Read [AGENTS.md](AGENTS.md) before editing. It is the canonical guide for this repo. This file is only a pointer.

onerutter.com is Jake Rutter's personal site: Next.js 16.4.3 App Router, React 19, TypeScript, MDX content, deployed on Vercel from `main`.

```bash
npm install
npm run dev
npm run build
npm run lint
npm run typecheck
```

Before using a Next.js API, read `node_modules/next/dist/docs/`. The managed block at the top of `AGENTS.md` is kept by `next dev`.

Content rules, in short:

- Do not mention a planned move, and do not invent trip details, captions, or place names.
- Do not put exact photo locations in copy or metadata. Trip photos go through `node scripts/prepare-trip-photos.mjs`. The build rejects GPS.
- Keep Jake's wording on the story page. Keep `draft: true` files out of production.
- Lab card colors are `#0A1045`, `#00C2D1`, `#F9E900`, `#F6AF65`, `#ED33B9`. Pink uses navy text (white on `#ED33B9` fails AA).
- Contact form env: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`. Honeypot field is `hp_field`.

How-tos: [docs/adding-a-note.md](docs/adding-a-note.md), [docs/adding-a-trip.md](docs/adding-a-trip.md), [docs/adding-a-lab-project.md](docs/adding-a-lab-project.md).

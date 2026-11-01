# Contributing

This is Jake Rutter's personal site. Changes land as pull requests into `main`. [AGENTS.md](AGENTS.md) is the guide for agents and for anyone editing the repo. The short human overview is [README.md](README.md).

## Setup

```bash
npm install
npm run dev
```

The contact form needs `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL` in `.env.local`. Names are listed in `.env.example`. The site runs without them. Copy those names and fill the values locally. Do not commit the values.

## Before pushing

```bash
npm run lint
npm run typecheck
npm run build
```

Keep the pull request small and focused. Skip screenshots. When the Vercel preview deploy is ready, add the preview URL of each changed page to the pull request and to the report (`https://<preview>/<path>`). For a note, also name the title, date, summary, and whether it is still a draft. For a trip, say whether the dates, photographs, and draft flag are final.

## Content

- Notes: [docs/adding-a-note.md](docs/adding-a-note.md)
- Trips and photographs: [docs/adding-a-trip.md](docs/adding-a-trip.md)
- Lab projects: [docs/adding-a-lab-project.md](docs/adding-a-lab-project.md)

Leave `draft: true` unless Jake asked for that file to go live. Merging a draft does not publish it. Do not invent biographical facts, trip details, captions, or place names. Do not mention a planned move. Do not put exact photo locations in copy or in image metadata. Phone photographs go through `node scripts/prepare-trip-photos.mjs` so GPS is stripped before they are committed. Keep Jake's wording on the story page.

# onerutter.com

Personal site for Jake Rutter. Next.js (App Router) and TypeScript, deployed on Vercel. The canonical URL is `https://onerutter.com`.

Agents should start at [AGENTS.md](AGENTS.md). That file is the canonical guide: stack, commands, routes, content model, and the rules for notes, trips, and copy. How-tos:

- [Adding a note](docs/adding-a-note.md)
- [Adding a trip](docs/adding-a-trip.md)
- [Adding a Lab project](docs/adding-a-lab-project.md)

Design decisions from 1 Nov 2026 are in [PLAN.md](PLAN.md). The approved visual reference for the first build is the static HTML in `mockups/`. The running app is what ships. [CONTRIBUTING.md](CONTRIBUTING.md) covers pull requests.

## Run it locally

```bash
npm install
npm run dev
```

The dev server prints its URL. Check a production build with:

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

`npm run lint` is ESLint. `npm run typecheck` is `tsc --noEmit`.

Draft notes are visible when `NODE_ENV` is not `production` (so, during `npm run dev`) and on Vercel preview deployments. A draft trip is listed on `/travel` in those same places and is left off the world map. Its album URL is a 404 until `draft` is false. Drafts are omitted from the production site, `/feed.xml` (notes), and `/sitemap.xml`.

The contact form on `/hello` sends through Resend. Variable names are in `.env.example`. Put the values in `.env.local`, which is gitignored. The page still renders without them.

## Routes

- `/` home
- `/story`
- `/lab`
- `/hello`
- `/notes`
- `/notes/[slug]`
- `/notes/tag/[tag]`
- `/travel`
- `/travel/[slug]`
- `/feed.xml` RSS
- `/sitemap.xml`
- `/robots.txt`

## Where content lives

Notes are `content/notes/*.mdx`. Trips are `content/trips/<slug>/index.mdx`. A published trip includes `places`: country or city centroids at two decimal places, never an exact spot. `/travel` opens with a world map drawn from those places, then the timeline. Lab projects are `content/projects/*.md`. The home row is Agentic Checkout Index, Tails over Thames, and Mind the Timetable.

Vercel auto-deploys `main` to production. Each pull request gets a preview deployment.

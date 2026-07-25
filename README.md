# Ceyluxe Tours

A premium, responsive Sri Lanka tour-booking website built with Next.js,
TypeScript, Tailwind CSS, Cloudflare Workers, D1 and Drizzle ORM.

## Features

- Editorial travel landing page with curated Sri Lanka journeys
- Responsive desktop, tablet and mobile layouts
- Custom trip-planning form
- Persistent booking inquiries through a server-side API
- SEO and branded social-sharing metadata
- Cloudflare Worker-compatible production build

## Requirements

- Node.js 22.13.0 or newer
- npm

## Local development

Install dependencies and create a production build:

```bash
npm install
npm run build
```

Initialize the local booking database once:

```bash
npx wrangler d1 execute DB \
  --local \
  --file="./drizzle/0000_furry_robbie_robertson.sql" \
  --config="./dist/server/wrangler.json" \
  --persist-to="./.wrangler/state/v3" \
  --yes
```

Start the frontend and API:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful commands

```bash
npm run dev          # Start local development
npm run build        # Create and validate the production build
npm test             # Build and run the rendered-page checks
npm run db:generate  # Generate a migration after schema changes
```

## Project structure

- `app/page.tsx` — homepage
- `app/globals.css` — site styling
- `app/booking-form.tsx` — trip-planning form
- `app/api/inquiries/route.ts` — booking API
- `db/schema.ts` — booking inquiry schema
- `drizzle/` — database migrations

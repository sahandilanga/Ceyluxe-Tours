# Ceyluxe Tours

A premium, responsive Sri Lanka tour-booking website built with Next.js,
TypeScript and Tailwind CSS, with a separate Express and MongoDB Atlas API.

## Features

- Editorial travel landing page with curated Sri Lanka journeys
- Tour-package catalog with dedicated, SEO-ready itinerary pages
- Day-by-day accordions and package-specific reservation forms
- Responsive desktop, tablet and mobile layouts
- Custom trip-planning form
- Persistent booking inquiries through Express and MongoDB Atlas
- Clerk-protected operations dashboard for bookings and tour management
- Cloudinary tour-image uploads with draft and publish controls
- Published MongoDB tours appear on the public website immediately
- Server-side booking validation and request rate limiting
- SEO and branded social-sharing metadata
- Cloudflare Worker-compatible production build

## Requirements

- Node.js 22.13.0 or newer
- npm

## Local development

Install the frontend and backend dependencies:

```bash
npm install
cd server
npm install
cd ..
```

Create the local environment files:

```bash
cp .env.example .env.local
cp server/.env.example server/.env
```

Replace the placeholder username and password in `server/.env` with a MongoDB
Atlas application user's credentials. Never commit that file.

Start the website and backend together:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The API health endpoint is
available at [http://localhost:5050/api/health](http://localhost:5050/api/health).
The admin dashboard is available at
[http://localhost:3000/admin](http://localhost:3000/admin).

For separate terminals, use `npm run dev:web` for the website and
`npm run dev:server` for the API.

## Useful commands

```bash
npm run dev          # Start the website and API together
npm run dev:web      # Start only the website
npm run dev:server   # Start the Express and MongoDB API
npm run build        # Create and validate the production build
npm run build:server # Type-check and build the backend
npm test             # Build and run the rendered-page checks
```

## Project structure

- `app/page.tsx` — homepage
- `app/packages/page.tsx` — tour-package catalog
- `app/packages/[slug]/page.tsx` — itinerary and package booking page
- `app/globals.css` — site styling
- `app/booking-form.tsx` — trip-planning form
- `lib/tours.ts` — shared package and itinerary content
- `app/admin` — Clerk-protected operations dashboard
- `app/api/admin/[...path]/route.ts` — authenticated admin API proxy
- `app/api/inquiries/route.ts` — secure frontend-to-backend proxy
- `server/src/server.ts` — Express API entry point
- `server/src/models/inquiry.ts` — MongoDB inquiry model
- `server/src/models/tour.ts` — dashboard-managed tour model
- `server/src/routes/admin.ts` — admin booking and tour API
- `server/src/routes/inquiries.ts` — booking API

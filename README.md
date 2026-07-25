# Ceyluxe Tours

A premium, responsive Sri Lanka tour-booking website built with Next.js,
TypeScript and Tailwind CSS, with a separate Express and MongoDB Atlas API.

## Features

- Editorial travel landing page with curated Sri Lanka journeys
- Responsive desktop, tablet and mobile layouts
- Custom trip-planning form
- Persistent booking inquiries through Express and MongoDB Atlas
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

Start the backend:

```bash
npm run dev:server
```

In a second terminal, start the frontend:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The API health endpoint is
available at [http://localhost:5050/api/health](http://localhost:5050/api/health).

## Useful commands

```bash
npm run dev          # Start local development
npm run dev:server   # Start the Express and MongoDB API
npm run build        # Create and validate the production build
npm run build:server # Type-check and build the backend
npm test             # Build and run the rendered-page checks
```

## Project structure

- `app/page.tsx` — homepage
- `app/globals.css` — site styling
- `app/booking-form.tsx` — trip-planning form
- `app/api/inquiries/route.ts` — secure frontend-to-backend proxy
- `server/src/server.ts` — Express API entry point
- `server/src/models/inquiry.ts` — MongoDB inquiry model
- `server/src/routes/inquiries.ts` — booking API

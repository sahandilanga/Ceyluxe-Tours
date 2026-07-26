import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("contains the complete Ceyluxe Tours homepage experience", async () => {
  const page = await readFile(
    new URL("../app/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(page, /Ceyluxe Tours \| Private Sri Lanka Journeys/i);
  assert.match(page, /Sri Lanka,/i);
  assert.match(page, /shaped around you/i);
  assert.match(page, /Signature journeys/i);
  assert.match(page, /<HeroBackdrop \/>/);
  assert.match(page, /<BookingForm \/>/);
  assert.doesNotMatch(page, /codex-preview|Your site is taking shape/i);
});

test("includes a cinematic, accessible Sri Lanka hero slideshow", async () => {
  const [experience, styles] = await Promise.all([
    readFile(new URL("../app/site-experience.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(experience, /heroSlides/);
  assert.match(experience, /Sigiriya/);
  assert.match(experience, /Ella/);
  assert.match(experience, /South Coast/);
  assert.match(experience, /prefers-reduced-motion/);
  assert.match(experience, /Pause hero slideshow/);
  assert.match(styles, /hero-slide\.is-active/);
  assert.match(styles, /@keyframes hero-progress/);
  assert.match(styles, /@keyframes hero-caption-in/);
});

test("connects the booking form to the Express and MongoDB backend", async () => {
  const [proxyRoute, apiRoute, model, server, layout] = await Promise.all([
    readFile(new URL("../app/api/inquiries/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../server/src/routes/inquiries.ts", import.meta.url), "utf8"),
    readFile(new URL("../server/src/models/inquiry.ts", import.meta.url), "utf8"),
    readFile(new URL("../server/src/server.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(proxyRoute, /BACKEND_API_URL/);
  assert.match(apiRoute, /Inquiry\.create/);
  assert.match(model, /model(?:<[^>]+>)?\("Inquiry"/);
  assert.match(server, /connectDatabase/);
  assert.match(layout, /openGraph/);
  assert.match(layout, /twitter/);
});

test("includes in-modal package booking and reservation fields", async () => {
  const [packagePage, bookingForm, tours, experience] = await Promise.all([
    readFile(new URL("../app/packages/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/booking-form.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/tours.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/site-experience.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(packagePage, /Day-by-day plan/i);
  assert.match(packagePage, /BookingForm/);
  assert.match(bookingForm, /arrivalDate/);
  assert.match(bookingForm, /departureDate/);
  assert.match(bookingForm, /mealPlan/);
  assert.match(tours, /The Ceylon Signature/);
  assert.match(tours, /Wild South Escape/);
  assert.match(experience, /Book this journey/);
  assert.match(experience, /<BookingForm/);
  assert.doesNotMatch(experience, /View full itinerary/);
});

test("includes a Clerk-protected MongoDB and Cloudinary admin workflow", async () => {
  const [adminPage, dashboard, proxyRoute, adminRoute, tourRoute, server] =
    await Promise.all([
      readFile(new URL("../app/admin/page.tsx", import.meta.url), "utf8"),
      readFile(
        new URL("../app/admin/admin-dashboard.tsx", import.meta.url),
        "utf8",
      ),
      readFile(
        new URL("../app/api/admin/[...path]/route.ts", import.meta.url),
        "utf8",
      ),
      readFile(
        new URL("../server/src/routes/admin.ts", import.meta.url),
        "utf8",
      ),
      readFile(
        new URL("../server/src/models/tour.ts", import.meta.url),
        "utf8",
      ),
      readFile(new URL("../server/src/server.ts", import.meta.url), "utf8"),
    ]);

  assert.match(adminPage, /SignIn/);
  assert.match(dashboard, /Recent bookings/);
  assert.match(dashboard, /Create a new tour/);
  assert.match(dashboard, /Day-by-day itinerary/);
  assert.match(dashboard, /authLoaded/);
  assert.match(dashboard, /isSignedIn/);
  assert.match(dashboard, /Backend connected/);
  assert.match(dashboard, /WorkspaceError/);
  assert.match(proxyRoute, /request\.headers\.get\("cookie"\)/);
  assert.match(adminRoute, /uploadTourImage/);
  assert.match(adminRoute, /Inquiry\.find/);
  assert.match(tourRoute, /model(?:<[^>]+>)?\("Tour"/);
  assert.match(server, /requireAdmin/);
});

test("publishes database tours through dynamic public pages", async () => {
  const [homePage, packagesPage, packagePage, toursLibrary, publicRoute] =
    await Promise.all([
      readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/packages/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/packages/[slug]/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../lib/tours.ts", import.meta.url), "utf8"),
      readFile(new URL("../server/src/routes/tours.ts", import.meta.url), "utf8"),
    ]);

  for (const page of [homePage, packagesPage, packagePage]) {
    assert.match(page, /dynamic = "force-dynamic"/);
    assert.match(page, /revalidate = 0/);
  }
  assert.match(toursLibrary, /getPublishedTours/);
  assert.match(toursLibrary, /managedSlugs/);
  assert.match(toursLibrary, /cache: "no-store"/);
  assert.match(publicRoute, /isPublished: true/);
  assert.match(publicRoute, /Tour\.distinct\("slug"\)/);
  assert.match(publicRoute, /Cache-Control/);
});

test("keeps local admin authentication on trusted, stable development origins", async () => {
  const [dashboard, serverEnvironment, viteConfig] = await Promise.all([
    readFile(
      new URL("../app/admin/admin-dashboard.tsx", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../server/src/config/env.ts", import.meta.url), "utf8"),
    readFile(new URL("../vite.config.ts", import.meta.url), "utf8"),
  ]);

  assert.match(serverEnvironment, /http:\/\/localhost:3000/);
  assert.match(serverEnvironment, /http:\/\/localhost:3001/);
  assert.match(serverEnvironment, /NODE_ENV === "production"/);
  assert.match(viteConfig, /strictPort: true/);
  assert.match(dashboard, /Session not verified/);
  assert.match(dashboard, /Admin access denied/);
});

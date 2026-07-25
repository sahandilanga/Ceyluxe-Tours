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
  assert.match(page, /<BookingForm \/>/);
  assert.doesNotMatch(page, /codex-preview|Your site is taking shape/i);
});

test("keeps the booking API and database schema in the source", async () => {
  const [route, schema, page, layout] = await Promise.all([
    readFile(new URL("../app/api/inquiries/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(route, /export async function POST/);
  assert.match(route, /db\.insert\(inquiries\)/);
  assert.match(schema, /sqliteTable\("inquiries"/);
  assert.match(page, /<BookingForm \/>/);
  assert.match(layout, /openGraph/);
  assert.match(layout, /twitter/);
});

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
  assert.match(model, /model\("Inquiry"/);
  assert.match(server, /connectDatabase/);
  assert.match(layout, /openGraph/);
  assert.match(layout, /twitter/);
});

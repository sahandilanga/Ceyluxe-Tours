import assert from "node:assert/strict";
import test from "node:test";
import {
  bookingUpdateInput,
  tourInput,
  visibilityInput,
} from "../src/validation/tour.js";

const completeTour = {
  slug: "cultural-wildlife-discovery",
  category: "Cultural",
  title: "Cultural & Wildlife Discovery",
  duration: "7 days",
  nights: "6 nights",
  route: "Colombo · Sigiriya · Kandy",
  alt: "Sigiriya rock above the forest",
  summary: "A complete introduction to Sri Lanka culture and wildlife.",
  intro:
    "Explore ancient kingdoms, wildlife parks and living traditions with a private guide.",
  highlights: ["Climb Sigiriya", "Private wildlife safari"],
  days: [
    {
      title: "Day 01",
      route: "Arrival in Colombo",
      description: "Meet your chauffeur-guide and settle into your first hotel.",
    },
  ],
  isPublished: true,
  sortOrder: 10,
};

test("accepts a complete admin tour", () => {
  assert.equal(tourInput.safeParse(completeTour).success, true);
});

test("rejects unsafe URL slugs and empty itineraries", () => {
  assert.equal(
    tourInput.safeParse({
      ...completeTour,
      slug: "../../not-safe",
      days: [],
    }).success,
    false,
  );
});

test("accepts supported booking status and visibility updates", () => {
  assert.equal(
    bookingUpdateInput.safeParse({ status: "confirmed" }).success,
    true,
  );
  assert.equal(
    visibilityInput.safeParse({ isPublished: false }).success,
    true,
  );
});

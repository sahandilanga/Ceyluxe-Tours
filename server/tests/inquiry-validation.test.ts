import assert from "node:assert/strict";
import test from "node:test";
import { inquiryInput } from "../src/routes/inquiries.js";

test("accepts a complete package booking", () => {
  const result = inquiryInput.safeParse({
    inquiryType: "package_booking",
    packageName: "The Ceylon Signature",
    packageSlug: "ceylon-signature",
    name: "Test Traveller",
    email: "traveller@example.com",
    arrivalDate: "2027-01-10",
    departureDate: "2027-01-22",
    travellers: "2",
    rooms: "1",
    mealPlan: "bed-and-breakfast",
  });

  assert.equal(result.success, true);
});

test("rejects a package booking with an invalid date range", () => {
  const result = inquiryInput.safeParse({
    inquiryType: "package_booking",
    packageName: "The Ceylon Signature",
    packageSlug: "ceylon-signature",
    name: "Test Traveller",
    email: "traveller@example.com",
    arrivalDate: "2027-01-22",
    departureDate: "2027-01-10",
    travellers: "2",
    rooms: "1",
  });

  assert.equal(result.success, false);
});

test("keeps the original custom inquiry flow valid", () => {
  const result = inquiryInput.safeParse({
    name: "Test Traveller",
    email: "traveller@example.com",
    journey: "custom",
    travellers: "3-4",
  });

  assert.equal(result.success, true);
});

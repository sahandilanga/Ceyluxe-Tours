import { randomUUID } from "node:crypto";
import { Router } from "express";
import { z } from "zod";
import { Inquiry } from "../models/inquiry.js";

const router = Router();

const isoDate = /^\d{4}-\d{2}-\d{2}$/;

export const inquiryInput = z.object({
  inquiryType: z
    .enum(["custom_inquiry", "package_booking"])
    .optional()
    .default("custom_inquiry"),
  packageName: z.string().trim().max(120).optional().default(""),
  packageSlug: z.string().trim().max(80).optional().default(""),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(180),
  whatsapp: z.string().trim().max(60).optional().default(""),
  travelDate: z.string().trim().max(20).optional().default(""),
  arrivalDate: z.string().trim().max(10).optional().default(""),
  departureDate: z.string().trim().max(10).optional().default(""),
  travellers: z.string().trim().max(20).optional().default(""),
  rooms: z.string().trim().max(4).optional().default(""),
  mealPlan: z
    .enum(["", "bed-and-breakfast", "half-board", "full-board"])
    .optional()
    .default(""),
  journey: z.string().trim().max(80).optional().default(""),
  budget: z.string().trim().max(40).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
  website: z.string().trim().max(200).optional().default(""),
}).superRefine((data, context) => {
  if (data.inquiryType !== "package_booking") return;

  if (!data.packageName || !data.packageSlug) {
    context.addIssue({
      code: "custom",
      path: ["packageSlug"],
      message: "A valid package is required",
    });
  }
  if (!isoDate.test(data.arrivalDate) || !isoDate.test(data.departureDate)) {
    context.addIssue({
      code: "custom",
      path: ["arrivalDate"],
      message: "Valid arrival and departure dates are required",
    });
  } else if (data.departureDate <= data.arrivalDate) {
    context.addIssue({
      code: "custom",
      path: ["departureDate"],
      message: "Departure must be after arrival",
    });
  }
  const guestCount = Number(data.travellers);
  const roomCount = Number(data.rooms);
  if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 30) {
    context.addIssue({
      code: "custom",
      path: ["travellers"],
      message: "Guest count must be between 1 and 30",
    });
  }
  if (!Number.isInteger(roomCount) || roomCount < 1 || roomCount > 15) {
    context.addIssue({
      code: "custom",
      path: ["rooms"],
      message: "Room count must be between 1 and 15",
    });
  }
});

router.post("/", async (request, response, next) => {
  try {
    const parsed = inquiryInput.safeParse(request.body);

    if (!parsed.success) {
      response.status(400).json({
        error: "Please check your details and try again.",
      });
      return;
    }

    if (parsed.data.website) {
      response.status(201).json({ reference: "CYL-RECEIVED" });
      return;
    }

    const reference = `CYL-${randomUUID().slice(0, 8).toUpperCase()}`;
    const { website: _website, ...inquiry } = parsed.data;
    void _website;
    await Inquiry.create({
      ...inquiry,
      email: inquiry.email.toLowerCase(),
      reference,
    });

    response.status(201).json({ reference });
  } catch (error) {
    next(error);
  }
});

export const inquiryRouter = router;

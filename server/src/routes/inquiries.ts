import { randomUUID } from "node:crypto";
import { Router } from "express";
import { z } from "zod";
import { Inquiry } from "../models/inquiry.js";

const router = Router();

const inquiryInput = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(180),
  whatsapp: z.string().trim().max(60).optional().default(""),
  travelDate: z.string().trim().max(20).optional().default(""),
  travellers: z.string().trim().max(20).optional().default(""),
  journey: z.string().trim().max(80).optional().default(""),
  budget: z.string().trim().max(40).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
  website: z.string().trim().max(200).optional().default(""),
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

    const reference = `CYL-${randomUUID().slice(0, 6).toUpperCase()}`;
    await Inquiry.create({
      ...parsed.data,
      website: undefined,
      email: parsed.data.email.toLowerCase(),
      reference,
    });

    response.status(201).json({ reference });
  } catch (error) {
    next(error);
  }
});

export const inquiryRouter = router;

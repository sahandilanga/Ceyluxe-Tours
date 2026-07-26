import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const tourDayInput = z.object({
  title: z.string().trim().min(1).max(40),
  route: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(1200),
});

export const tourInput = z.object({
  slug: z.string().trim().min(2).max(80).regex(slugPattern),
  category: z.string().trim().min(1).max(60),
  title: z.string().trim().min(2).max(120),
  duration: z.string().trim().min(1).max(40),
  nights: z.string().trim().min(1).max(40),
  route: z.string().trim().min(2).max(300),
  alt: z.string().trim().min(2).max(180),
  summary: z.string().trim().min(10).max(600),
  intro: z.string().trim().min(10).max(2000),
  highlights: z.array(z.string().trim().min(1).max(180)).min(1).max(12),
  days: z.array(tourDayInput).min(1).max(30),
  isPublished: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).max(10000).default(0),
});

export const bookingUpdateInput = z
  .object({
    status: z
      .enum(["new", "contacted", "quoted", "confirmed", "closed"])
      .optional(),
    adminNotes: z.string().trim().max(2000).optional(),
  })
  .refine((data) => data.status !== undefined || data.adminNotes !== undefined);

export const visibilityInput = z.object({
  isPublished: z.boolean(),
});

import { Router } from "express";
import { Tour } from "../models/tour.js";

const router = Router();

router.get("/", async (_request, response, next) => {
  try {
    response.set("Cache-Control", "no-store, max-age=0");
    const [tours, managedSlugs] = await Promise.all([
      Tour.find({ isPublished: true })
        .sort({ sortOrder: 1, createdAt: -1 })
        .lean(),
      Tour.distinct("slug"),
    ]);
    response.json({ tours, managedSlugs });
  } catch (error) {
    next(error);
  }
});

router.get("/:slug", async (request, response, next) => {
  try {
    response.set("Cache-Control", "no-store, max-age=0");
    const tour = await Tour.findOne({
      slug: request.params.slug,
      isPublished: true,
    }).lean();

    if (!tour) {
      response.status(404).json({ error: "Tour not found." });
      return;
    }

    response.json({ tour });
  } catch (error) {
    next(error);
  }
});

export const tourRouter = router;

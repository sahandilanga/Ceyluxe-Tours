import { Router } from "express";
import mongoose from "mongoose";
import multer from "multer";
import { removeTourImage, uploadTourImage } from "../config/cloudinary.js";
import { Inquiry } from "../models/inquiry.js";
import { Tour } from "../models/tour.js";
import {
  bookingUpdateInput,
  tourInput,
  visibilityInput,
} from "../validation/tour.js";

const router = Router();
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 6 * 1024 * 1024, files: 1 },
  fileFilter(_request, file, callback) {
    if (!allowedImageTypes.has(file.mimetype)) {
      callback(new Error("Use a JPG, PNG, or WebP image."));
      return;
    }
    callback(null, true);
  },
});

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

router.get("/overview", async (_request, response, next) => {
  try {
    const [
      totalBookings,
      newBookings,
      confirmedBookings,
      activeTours,
      recentBookings,
    ] = await Promise.all([
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: "new" }),
      Inquiry.countDocuments({ status: "confirmed" }),
      Tour.countDocuments({ isPublished: true }),
      Inquiry.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select(
          "reference name packageName inquiryType status arrivalDate createdAt",
        )
        .lean(),
    ]);

    response.json({
      stats: {
        totalBookings,
        newBookings,
        confirmedBookings,
        activeTours,
      },
      recentBookings,
      system: {
        database: "connected",
        api: "online",
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/bookings", async (request, response, next) => {
  try {
    const status =
      typeof request.query.status === "string" ? request.query.status : "";
    const search =
      typeof request.query.search === "string"
        ? request.query.search.trim().slice(0, 120)
        : "";
    const page = Math.max(Number(request.query.page) || 1, 1);
    const limit = 20;
    const query: Record<string, unknown> = {};

    if (
      ["new", "contacted", "quoted", "confirmed", "closed"].includes(status)
    ) {
      query.status = status;
    }
    if (search) {
      const pattern = new RegExp(escapeRegex(search), "i");
      query.$or = [
        { reference: pattern },
        { name: pattern },
        { email: pattern },
        { packageName: pattern },
      ];
    }

    const [bookings, total] = await Promise.all([
      Inquiry.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Inquiry.countDocuments(query),
    ]);

    response.json({
      bookings,
      pagination: {
        page,
        pages: Math.max(Math.ceil(total / limit), 1),
        total,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/bookings/:id", async (request, response, next) => {
  try {
    if (!mongoose.isValidObjectId(request.params.id)) {
      response.status(400).json({ error: "Invalid booking ID." });
      return;
    }

    const parsed = bookingUpdateInput.safeParse(request.body);
    if (!parsed.success) {
      response.status(400).json({ error: "Invalid booking update." });
      return;
    }

    const booking = await Inquiry.findByIdAndUpdate(
      request.params.id,
      { $set: parsed.data },
      { new: true, runValidators: true },
    ).lean();

    if (!booking) {
      response.status(404).json({ error: "Booking not found." });
      return;
    }

    response.json({ booking });
  } catch (error) {
    next(error);
  }
});

router.get("/tours", async (_request, response, next) => {
  try {
    const tours = await Tour.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
    response.json({ tours });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/tours",
  upload.single("image"),
  async (request, response, next) => {
    let uploadedPublicId = "";

    try {
      if (!request.file) {
        response.status(400).json({ error: "Please choose a tour image." });
        return;
      }

      const parsedJson = JSON.parse(String(request.body.tour ?? "{}")) as unknown;
      const parsed = tourInput.safeParse(parsedJson);
      if (!parsed.success) {
        response.status(400).json({
          error: parsed.error.issues[0]?.message ?? "Invalid tour details.",
        });
        return;
      }

      const existing = await Tour.exists({ slug: parsed.data.slug });
      if (existing) {
        response.status(409).json({
          error: "That URL slug is already used by another tour.",
        });
        return;
      }

      const uploaded = await uploadTourImage(request.file.buffer);
      uploadedPublicId = uploaded.publicId;
      const tour = await Tour.create({
        ...parsed.data,
        image: uploaded.secureUrl,
        imagePublicId: uploaded.publicId,
      });

      response.status(201).json({ tour });
    } catch (error) {
      if (uploadedPublicId) {
        await removeTourImage(uploadedPublicId).catch(() => undefined);
      }
      if (error instanceof SyntaxError) {
        response.status(400).json({ error: "Invalid tour details." });
        return;
      }
      next(error);
    }
  },
);

router.patch(
  "/tours/:id",
  upload.single("image"),
  async (request, response, next) => {
    let uploadedPublicId = "";

    try {
      if (!mongoose.isValidObjectId(request.params.id)) {
        response.status(400).json({ error: "Invalid tour ID." });
        return;
      }

      const current = await Tour.findById(request.params.id);
      if (!current) {
        response.status(404).json({ error: "Tour not found." });
        return;
      }

      const parsedJson = JSON.parse(String(request.body.tour ?? "{}")) as unknown;
      const parsed = tourInput.safeParse(parsedJson);
      if (!parsed.success) {
        response.status(400).json({
          error: parsed.error.issues[0]?.message ?? "Invalid tour details.",
        });
        return;
      }

      const duplicate = await Tour.exists({
        slug: parsed.data.slug,
        _id: { $ne: current._id },
      });
      if (duplicate) {
        response.status(409).json({
          error: "That URL slug is already used by another tour.",
        });
        return;
      }

      let image = current.image;
      let imagePublicId = current.imagePublicId;
      const previousImagePublicId = current.imagePublicId;
      if (request.file) {
        const uploaded = await uploadTourImage(request.file.buffer);
        uploadedPublicId = uploaded.publicId;
        image = uploaded.secureUrl;
        imagePublicId = uploaded.publicId;
      }

      current.set({ ...parsed.data, image, imagePublicId });
      await current.save();

      if (request.file && previousImagePublicId !== uploadedPublicId) {
        await removeTourImage(previousImagePublicId).catch(() => undefined);
      }

      response.json({ tour: current });
    } catch (error) {
      if (uploadedPublicId) {
        await removeTourImage(uploadedPublicId).catch(() => undefined);
      }
      if (error instanceof SyntaxError) {
        response.status(400).json({ error: "Invalid tour details." });
        return;
      }
      next(error);
    }
  },
);

router.patch("/tours/:id/visibility", async (request, response, next) => {
  try {
    if (!mongoose.isValidObjectId(request.params.id)) {
      response.status(400).json({ error: "Invalid tour ID." });
      return;
    }

    const parsed = visibilityInput.safeParse(request.body);
    if (!parsed.success) {
      response.status(400).json({ error: "Invalid visibility setting." });
      return;
    }

    const tour = await Tour.findByIdAndUpdate(
      request.params.id,
      { $set: { isPublished: parsed.data.isPublished } },
      { new: true, runValidators: true },
    ).lean();

    if (!tour) {
      response.status(404).json({ error: "Tour not found." });
      return;
    }

    response.json({ tour });
  } catch (error) {
    next(error);
  }
});

export const adminRouter = router;

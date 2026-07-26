import mongoose, { Schema } from "mongoose";

type TourDayRecord = {
  title: string;
  route: string;
  description: string;
};

type TourRecord = {
  slug: string;
  category: string;
  title: string;
  duration: string;
  nights: string;
  route: string;
  image: string;
  imagePublicId: string;
  alt: string;
  summary: string;
  intro: string;
  highlights: string[];
  days: TourDayRecord[];
  isPublished: boolean;
  sortOrder: number;
};

const tourDaySchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 40 },
    route: { type: String, required: true, trim: true, maxlength: 160 },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1200,
    },
  },
  { _id: false },
);

const tourSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    category: { type: String, required: true, trim: true, maxlength: 60 },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    duration: { type: String, required: true, trim: true, maxlength: 40 },
    nights: { type: String, required: true, trim: true, maxlength: 40 },
    route: { type: String, required: true, trim: true, maxlength: 300 },
    image: { type: String, required: true, trim: true },
    imagePublicId: { type: String, required: true, trim: true },
    alt: { type: String, required: true, trim: true, maxlength: 180 },
    summary: { type: String, required: true, trim: true, maxlength: 600 },
    intro: { type: String, required: true, trim: true, maxlength: 2000 },
    highlights: {
      type: [{ type: String, trim: true, maxlength: 180 }],
      validate: {
        validator: (items: string[]) => items.length >= 1 && items.length <= 12,
        message: "Tours need between 1 and 12 highlights",
      },
    },
    days: {
      type: [tourDaySchema],
      validate: {
        validator: (items: unknown[]) => items.length >= 1 && items.length <= 30,
        message: "Tours need between 1 and 30 itinerary days",
      },
    },
    isPublished: { type: Boolean, default: false, index: true },
    sortOrder: { type: Number, default: 0, min: 0, max: 10000 },
  },
  { timestamps: true, versionKey: false },
);

tourSchema.index({ isPublished: 1, sortOrder: 1, createdAt: -1 });

export const Tour: mongoose.Model<TourRecord> =
  (mongoose.models.Tour as mongoose.Model<TourRecord> | undefined) ??
  mongoose.model<TourRecord>("Tour", tourSchema);

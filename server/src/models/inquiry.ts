import mongoose, { Schema } from "mongoose";

type InquiryRecord = {
  reference: string;
  inquiryType: "custom_inquiry" | "package_booking";
  packageName: string;
  packageSlug: string;
  name: string;
  email: string;
  whatsapp: string;
  travelDate: string;
  arrivalDate: string;
  departureDate: string;
  travellers: string;
  rooms: string;
  mealPlan: "" | "bed-and-breakfast" | "half-board" | "full-board";
  journey: string;
  budget: string;
  message: string;
  status: "new" | "contacted" | "quoted" | "confirmed" | "closed";
  adminNotes: string;
};

const inquirySchema = new Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    inquiryType: {
      type: String,
      enum: ["custom_inquiry", "package_booking"],
      default: "custom_inquiry",
      index: true,
    },
    packageName: { type: String, trim: true, maxlength: 120, default: "" },
    packageSlug: { type: String, trim: true, maxlength: 80, default: "" },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 180,
    },
    whatsapp: { type: String, trim: true, maxlength: 60, default: "" },
    travelDate: { type: String, trim: true, maxlength: 20, default: "" },
    arrivalDate: { type: String, trim: true, maxlength: 10, default: "" },
    departureDate: { type: String, trim: true, maxlength: 10, default: "" },
    travellers: { type: String, trim: true, maxlength: 20, default: "" },
    rooms: { type: String, trim: true, maxlength: 4, default: "" },
    mealPlan: {
      type: String,
      enum: ["", "bed-and-breakfast", "half-board", "full-board"],
      default: "",
    },
    journey: { type: String, trim: true, maxlength: 80, default: "" },
    budget: { type: String, trim: true, maxlength: 40, default: "" },
    message: { type: String, trim: true, maxlength: 2000, default: "" },
    status: {
      type: String,
      enum: ["new", "contacted", "quoted", "confirmed", "closed"],
      default: "new",
      index: true,
    },
    adminNotes: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
  },
  { timestamps: true, versionKey: false },
);

export const Inquiry: mongoose.Model<InquiryRecord> =
  (mongoose.models.Inquiry as mongoose.Model<InquiryRecord> | undefined) ??
  mongoose.model<InquiryRecord>("Inquiry", inquirySchema);

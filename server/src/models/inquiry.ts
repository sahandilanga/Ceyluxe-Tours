import mongoose, { Schema } from "mongoose";

const inquirySchema = new Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
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
    travellers: { type: String, trim: true, maxlength: 20, default: "" },
    journey: { type: String, trim: true, maxlength: 80, default: "" },
    budget: { type: String, trim: true, maxlength: 40, default: "" },
    message: { type: String, trim: true, maxlength: 2000, default: "" },
    status: {
      type: String,
      enum: ["new", "contacted", "quoted", "confirmed", "closed"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Inquiry =
  mongoose.models.Inquiry ?? mongoose.model("Inquiry", inquirySchema);

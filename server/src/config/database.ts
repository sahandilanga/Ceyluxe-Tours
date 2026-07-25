import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDatabase() {
  mongoose.set("strictQuery", true);

  await mongoose.connect(env.MONGODB_URI, {
    appName: "Ceyluxe Tours API",
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10_000,
  });

  console.log("MongoDB Atlas connected");
}

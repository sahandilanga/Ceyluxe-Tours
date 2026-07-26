import { config } from "dotenv";
import { z } from "zod";

// The backend keeps its secrets in server/.env. During local development the
// frontend publishable key can also be read from the root .env.local file.
config({ path: [".env", "../.env.local"] });

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(5050),
  MONGODB_URI: z
    .string()
    .min(1, "MONGODB_URI is required")
    .startsWith("mongodb", "MONGODB_URI must be a MongoDB connection string"),
  CLIENT_URL: z.string().min(1).default("http://localhost:3000"),
  CLERK_PUBLISHABLE_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1).optional(),
  CLERK_SECRET_KEY: z.string().min(1, "CLERK_SECRET_KEY is required"),
  ADMIN_USER_IDS: z.string().min(1, "ADMIN_USER_IDS is required"),
  CLOUDINARY_CLOUD_NAME: z
    .string()
    .min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z
    .string()
    .min(1, "CLOUDINARY_API_SECRET is required"),
  CLOUDINARY_FOLDER: z.string().trim().min(1).default("ceyluxe-tours"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const message = parsed.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join(", ");
  throw new Error(`Invalid server environment: ${message}`);
}

const clerkPublishableKey =
  parsed.data.CLERK_PUBLISHABLE_KEY ??
  parsed.data.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error(
    "Invalid server environment: CLERK_PUBLISHABLE_KEY is required",
  );
}

const configuredClientOrigins = parsed.data.CLIENT_URL.split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);
const localDevelopmentOrigins =
  parsed.data.NODE_ENV === "production"
    ? []
    : [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
      ];

export const env = {
  ...parsed.data,
  clerkPublishableKey,
  clientOrigins: [...new Set([...configuredClientOrigins, ...localDevelopmentOrigins])],
  adminUserIds: new Set(
    parsed.data.ADMIN_USER_IDS.split(",")
      .map((userId) => userId.trim())
      .filter(Boolean),
  ),
};

import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import express from "express";
import { ipKeyGenerator, rateLimit } from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { requireAdmin } from "./middleware/admin-auth.js";
import { adminRouter } from "./routes/admin.js";
import { inquiryRouter } from "./routes/inquiries.js";
import { tourRouter } from "./routes/tours.js";

const app = express();
const allowedOrigins = env.clientOrigins;

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origin is not allowed"));
    },
    methods: ["GET", "POST", "PATCH"],
  }),
);
app.use(express.json({ limit: "32kb" }));

const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator(request) {
    const email =
      typeof request.body?.email === "string"
        ? request.body.email.trim().toLowerCase()
        : "";
    return email ? `email:${email}` : `ip:${ipKeyGenerator(request.ip ?? "")}`;
  },
  message: {
    error: "Too many requests were sent. Please wait a few minutes and try again.",
  },
});

app.get("/api/health", (_request, response) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  response.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? "ok" : "degraded",
    database: databaseConnected ? "connected" : "disconnected",
  });
});

app.use("/api/inquiries", inquiryLimiter, inquiryRouter);
app.use("/api/tours", tourRouter);
app.use(
  "/api/admin",
  clerkMiddleware({
    publishableKey: env.clerkPublishableKey,
    secretKey: env.CLERK_SECRET_KEY,
    authorizedParties: allowedOrigins,
  }),
  requireAdmin,
  adminRouter,
);

app.use(
  (
    error: unknown,
    _request: express.Request,
    response: express.Response,
    _next: express.NextFunction,
  ) => {
    void _next;
    console.error(error);
    const isUploadError = error instanceof Error && error.name === "MulterError";
    response.status(isUploadError ? 400 : 500).json({
      error: isUploadError
        ? "The image is too large. Use an image under 6 MB."
        : "The request could not be completed. Please try again.",
    });
  },
);

async function start() {
  await connectDatabase();
  app.listen(env.PORT, () => {
    console.log(`Ceyluxe Tours API listening on port ${env.PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start Ceyluxe Tours API", error);
  process.exit(1);
});

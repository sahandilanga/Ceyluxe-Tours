import cors from "cors";
import express from "express";
import { ipKeyGenerator, rateLimit } from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { inquiryRouter } from "./routes/inquiries.js";

const app = express();
const allowedOrigins = env.CLIENT_URL.split(",").map((origin) => origin.trim());

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
    methods: ["GET", "POST"],
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

app.use(
  (
    error: unknown,
    _request: express.Request,
    response: express.Response,
    _next: express.NextFunction,
  ) => {
    void _next;
    console.error(error);
    response.status(500).json({
      error: "We could not save your request. Please try again.",
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

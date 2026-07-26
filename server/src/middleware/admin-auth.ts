import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";

export function requireAdmin(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const { isAuthenticated, userId } = getAuth(request);

  if (!isAuthenticated || !userId) {
    response.status(401).json({ error: "Please sign in to continue." });
    return;
  }

  if (!env.adminUserIds.has(userId)) {
    response.status(403).json({
      error: "This account does not have Ceyluxe administrator access.",
    });
    return;
  }

  next();
}

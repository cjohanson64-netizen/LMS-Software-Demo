import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/auth.js";

export type AuthedRequest = Request & {
  auth?: { userId: string; role: "TEACHER" | "STUDENT" };
};

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ error: "Missing Bearer token" });

  const token = header.slice("Bearer ".length);
  try {
    const payload = verifyToken(token);
    req.auth = payload;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// TODO: Replace local auth state with backend session check

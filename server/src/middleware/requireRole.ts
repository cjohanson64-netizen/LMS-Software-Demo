import type { Response, NextFunction } from "express";
import type { AuthedRequest } from "./requireAuth.js";

export function requireRole(...allowed: Array<"TEACHER" | "STUDENT">) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    const role = req.auth?.role;
    if (!role) return res.status(401).json({ error: "Not authenticated" });
    if (!allowed.includes(role)) return res.status(403).json({ error: "Forbidden" });
    return next();
  };
}

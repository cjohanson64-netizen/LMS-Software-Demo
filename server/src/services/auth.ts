import bcrypt from "bcrypt";
import jwt, { type Secret } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as Secret;
if (!JWT_SECRET) throw new Error("Missing JWT_SECRET in .env");

export type JwtPayload = { userId: string; role: "TEACHER" | "STUDENT" };

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, JWT_SECRET);

  if (typeof decoded !== "object" || decoded === null) {
    throw new Error("Invalid token payload");
  }

  const maybe = decoded as Partial<JwtPayload>;
  if (!maybe.userId || !maybe.role) {
    throw new Error("Invalid token payload");
  }

  return { userId: maybe.userId, role: maybe.role };
}

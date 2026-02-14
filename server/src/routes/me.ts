import { Router } from "express";
import { prisma } from "../db/prisma.js";
import { requireAuth, type AuthedRequest } from "../middleware/requireAuth.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthedRequest, res) => {
  const userId = req.auth!.userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true, createdAt: true },
  });

  return res.json({ user });
});

export default router;

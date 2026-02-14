import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db/prisma.js";
import { requireAuth, type AuthedRequest } from "../middleware/requireAuth.js";

const router = Router();

const assignmentIdParamsSchema = z.object({
  assignmentId: z.string().min(1),
});

/**
 * GET /assignments/:assignmentId
 * Auth required: teacher of the course OR enrolled student can view
 * Returns: assignment
 */
router.get("/:assignmentId", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const paramsParsed = assignmentIdParamsSchema.safeParse(req.params);
    if (!paramsParsed.success) return res.status(400).json({ error: "Invalid assignmentId" });

    const { assignmentId } = paramsParsed.data;
    const userId = req.auth!.userId;

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      select: {
        id: true,
        title: true,
        instructions: true,
        dueAt: true,
        points: true,
        createdAt: true,
        courseId: true,
        course: {
          select: {
            teacherId: true,
            enrollments: {
              where: { userId },
              select: { id: true },
            },
          },
        },
      },
    });

    if (!assignment) return res.status(404).json({ error: "Assignment not found" });

    const isTeacher = assignment.course.teacherId === userId;
    const isEnrolled = assignment.course.enrollments.length > 0;

    if (!isTeacher && !isEnrolled) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { course, ...assignmentDto } = assignment;

    return res.json({ assignment: assignmentDto });
  } catch (err) {
    console.error("GET /assignments/:assignmentId error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;

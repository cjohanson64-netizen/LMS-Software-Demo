import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db/prisma.js";
import { requireAuth, type AuthedRequest } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

/* SCHEMAS */

const assignmentIdParamsSchema = z.object({
  assignmentId: z.string().min(1),
});

const submissionIdParamsSchema = z.object({
  submissionId: z.string().min(1),
});

const createSubmissionSchema = z.object({
  content: z.string().min(1),
});

const gradeSubmissionSchema = z.object({
  grade: z.number().int().min(0),
  feedback: z.string().optional(),
});

/* ROUTES */

//POST /assignments/:assignmentId/submissions
router.post(
  "/assignments/:assignmentId/submissions",
  requireAuth,
  requireRole("STUDENT"),
  async (req: AuthedRequest, res) => {
    try {
      const paramsParsed = assignmentIdParamsSchema.safeParse(req.params);
      if (!paramsParsed.success) return res.status(400).json({ error: "Invalid assignmentId" });
      const { assignmentId } = paramsParsed.data;

      const bodyParsed = createSubmissionSchema.safeParse(req.body);
      if (!bodyParsed.success) return res.status(400).json({ error: bodyParsed.error.flatten() });

      const studentId = req.auth!.userId;

      const assignment = await prisma.assignment.findUnique({
        where: { id: assignmentId },
        select: { id: true, courseId: true },
      });
      if (!assignment) return res.status(404).json({ error: "Assignment not found" });

      const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: studentId, courseId: assignment.courseId } },
        select: { id: true },
      });
      if (!enrollment) return res.status(403).json({ error: "Not enrolled in this course" });

      const submission = await prisma.submission.upsert({
        where: { assignmentId_studentId: { assignmentId, studentId } },
        create: {
          assignmentId,
          studentId,
          content: bodyParsed.data.content,
          submittedAt: new Date(),
        },
        update: {
          content: bodyParsed.data.content,
          submittedAt: new Date(),
        },
        select: {
          id: true,
          assignmentId: true,
          studentId: true,
          content: true,
          submittedAt: true,
          createdAt: true,
          grade: true,
          feedback: true,
          gradedAt: true,
        },
      });

      return res.status(201).json({ submission });
    } catch (err) {
      console.error("POST /assignments/:assignmentId/submissions error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

//GET /assignments/:assignmentId/my-submission
router.get(
  "/assignments/:assignmentId/my-submission",
  requireAuth,
  requireRole("STUDENT"),
  async (req: AuthedRequest, res) => {
    try {
      const paramsParsed = assignmentIdParamsSchema.safeParse(req.params);
      if (!paramsParsed.success) return res.status(400).json({ error: "Invalid assignmentId" });
      const { assignmentId } = paramsParsed.data;

      const studentId = req.auth!.userId;

      const submission = await prisma.submission.findUnique({
        where: { assignmentId_studentId: { assignmentId, studentId } },
        select: {
          id: true,
          assignmentId: true,
          studentId: true,
          content: true,
          submittedAt: true,
          createdAt: true,
          grade: true,
          feedback: true,
          gradedAt: true,
        },
      });

      return res.json({ submission: submission ?? null });
    } catch (err) {
      console.error("GET /assignments/:assignmentId/my-submission error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

//GET /assignments/:assignmentId/submissions
router.get(
  "/assignments/:assignmentId/submissions",
  requireAuth,
  requireRole("TEACHER"),
  async (req: AuthedRequest, res) => {
    try {
      const paramsParsed = assignmentIdParamsSchema.safeParse(req.params);
      if (!paramsParsed.success) return res.status(400).json({ error: "Invalid assignmentId" });
      const { assignmentId } = paramsParsed.data;

      const teacherId = req.auth!.userId;

      const assignment = await prisma.assignment.findUnique({
        where: { id: assignmentId },
        select: { course: { select: { teacherId: true } } },
      });
      if (!assignment) return res.status(404).json({ error: "Assignment not found" });
      if (assignment.course.teacherId !== teacherId) return res.status(403).json({ error: "Forbidden" });

      const submissions = await prisma.submission.findMany({
        where: { assignmentId },
        select: {
          id: true,
          content: true,
          submittedAt: true,
          createdAt: true,
          grade: true,
          feedback: true,
          gradedAt: true,
          student: { select: { id: true, email: true } },
        },
        orderBy: { submittedAt: "desc" },
      });

      return res.json({ submissions });
    } catch (err) {
      console.error("GET /assignments/:assignmentId/submissions error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

//PATCH /submissions/:submissionId/grade
router.patch(
  "/submissions/:submissionId/grade",
  requireAuth,
  requireRole("TEACHER"),
  async (req: AuthedRequest, res) => {
    try {
      const paramsParsed = submissionIdParamsSchema.safeParse(req.params);
      if (!paramsParsed.success) return res.status(400).json({ error: "Invalid submissionId" });
      const { submissionId } = paramsParsed.data;

      const bodyParsed = gradeSubmissionSchema.safeParse(req.body);
      if (!bodyParsed.success) return res.status(400).json({ error: bodyParsed.error.flatten() });

      const teacherId = req.auth!.userId;

      const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
        select: {
          id: true,
          assignment: {
            select: {
              course: { select: { teacherId: true } },
            },
          },
        },
      });

      if (!submission) return res.status(404).json({ error: "Submission not found" });
      if (submission.assignment.course.teacherId !== teacherId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const updated = await prisma.submission.update({
        where: { id: submissionId },
        data: {
          grade: bodyParsed.data.grade,
          ...(bodyParsed.data.feedback !== undefined ? { feedback: bodyParsed.data.feedback } : {}),
          gradedAt: new Date(),
        },
        select: {
          id: true,
          grade: true,
          feedback: true,
          gradedAt: true,
        },
      });

      return res.json({ submission: updated });
    } catch (err) {
      console.error("PATCH /submissions/:submissionId/grade error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

export default router;

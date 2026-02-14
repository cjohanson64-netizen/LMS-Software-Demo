import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db/prisma.js";
import { requireAuth, type AuthedRequest } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

const createCourseSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

const courseIdParamsSchema = z.object({
  courseId: z.string().min(1),
});

const enrollSchema = z.object({
  studentEmail: z.string().email(),
});

const createModuleSchema = z.object({
  title: z.string().min(1),
});

const reorderModulesSchema = z.object({
  moduleIdsInOrder: z.array(z.string().min(1)).min(1),
});

const createAssignmentSchema = z.object({
  title: z.string().min(1),
  instructions: z.string().optional(),
  dueAt: z.coerce.date().optional(),     // accepts ISO string, returns Date
  points: z.number().int().positive().optional(),
});


async function canAccessCourse(courseId: string, userId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { teacherId: true },
  });
  if (!course) return { ok: false as const, reason: "not_found" as const };

  if (course.teacherId === userId) return { ok: true as const, teacherId: course.teacherId };

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    select: { id: true },
  });

  if (!enrollment) return { ok: false as const, reason: "forbidden" as const };
  return { ok: true as const, teacherId: course.teacherId };
}

/**
 * POST /courses
 * TEACHER only: create a course
 */
router.post("/", requireAuth, requireRole("TEACHER"), async (req: AuthedRequest, res) => {
  try {
    const parsed = createCourseSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const teacherId = req.auth!.userId;
    const { title, description } = parsed.data;

    const course = await prisma.course.create({
      data: {
        title,
        teacherId,
        ...(description !== undefined ? { description } : {}),
      },
      select: { id: true, title: true, description: true, teacherId: true, createdAt: true },
    });

    return res.status(201).json({ course });
  } catch (err) {
    console.error("POST /courses error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /courses
 * Auth required: list courses user teaches OR is enrolled in
 */
router.get("/", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const userId = req.auth!.userId;

    const [taught, enrolled] = await Promise.all([
      prisma.course.findMany({
        where: { teacherId: userId },
        select: { id: true, title: true, description: true, teacherId: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.course.findMany({
        where: { enrollments: { some: { userId } } },
        select: { id: true, title: true, description: true, teacherId: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return res.json({ taught, enrolled });
  } catch (err) {
    console.error("GET /courses error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /courses/:courseId
 * Auth required: teacher of course OR enrolled student can view
 * Returns: course + modules + assignments
 */

/**
 * GET /courses/me
 * Auth required: returns the current user's relevant courses
 * - STUDENT: courses they are enrolled in
 * - TEACHER: courses they teach
 */
router.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const userId = req.auth!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const courses = await prisma.course.findMany({
      where:
        user.role === "TEACHER"
          ? { teacherId: userId }
          : { enrollments: { some: { userId } } },
      select: { id: true, title: true, description: true, teacherId: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ courses });
  } catch (err) {
    console.error("GET /courses/me error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/:courseId", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const paramsParsed = courseIdParamsSchema.safeParse(req.params);
    if (!paramsParsed.success) return res.status(400).json({ error: "Invalid courseId" });

    const { courseId } = paramsParsed.data;
    const userId = req.auth!.userId;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        description: true,
        teacherId: true,
        createdAt: true,
        modules: {
          select: { id: true, title: true, order: true, createdAt: true },
          orderBy: { order: "asc" },
        },
        assignments: {
          select: { id: true, title: true, instructions: true, dueAt: true, points: true, createdAt: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!course) return res.status(404).json({ error: "Course not found" });

    const isTeacher = course.teacherId === userId;

    let isEnrolled = false;
    if (!isTeacher) {
      const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId } },
        select: { id: true },
      });
      isEnrolled = !!enrollment;
    }

    if (!isTeacher && !isEnrolled) {
      return res.status(403).json({ error: "Forbidden" });
    }

    return res.json({ course });
  } catch (err) {
    console.error("GET /courses/:courseId error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /courses/:courseId/enroll
 * TEACHER only: enroll a student by email
 * (v1: only the teacher of this course can enroll)
 */
router.post("/:courseId/enroll", requireAuth, requireRole("TEACHER"), async (req: AuthedRequest, res) => {
  try {
    const bodyParsed = enrollSchema.safeParse(req.body);
    if (!bodyParsed.success) return res.status(400).json({ error: bodyParsed.error.flatten() });

    const paramsParsed = courseIdParamsSchema.safeParse(req.params);
    if (!paramsParsed.success) return res.status(400).json({ error: "Invalid courseId" });

    const { courseId } = paramsParsed.data;
    const teacherId = req.auth!.userId;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { teacherId: true },
    });
    if (!course) return res.status(404).json({ error: "Course not found" });
    if (course.teacherId !== teacherId) {
      return res.status(403).json({ error: "Only this course's teacher can enroll students" });
    }

    const student = await prisma.user.findUnique({
      where: { email: bodyParsed.data.studentEmail },
      select: { id: true, email: true, role: true },
    });
    if (!student) return res.status(404).json({ error: "Student not found" });
    if (student.role !== "STUDENT") return res.status(400).json({ error: "User is not a STUDENT" });

    const enrollment = await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: student.id, courseId } },
      create: { userId: student.id, courseId },
      update: {},
      select: { id: true, userId: true, courseId: true, createdAt: true },
    });

    return res.status(201).json({ enrollment });
  } catch (err) {
    console.error("POST /courses/:courseId/enroll error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /courses/:courseId/modules
 * TEACHER only: add a module (appends to end)
 */
router.post("/:courseId/modules", requireAuth, requireRole("TEACHER"), async (req: AuthedRequest, res) => {
  try {
    const paramsParsed = courseIdParamsSchema.safeParse(req.params);
    if (!paramsParsed.success) return res.status(400).json({ error: "Invalid courseId" });
    const { courseId } = paramsParsed.data;

    const bodyParsed = createModuleSchema.safeParse(req.body);
    if (!bodyParsed.success) return res.status(400).json({ error: bodyParsed.error.flatten() });

    const userId = req.auth!.userId;

    // access helper already returns teacherId; use it instead of querying Course again
    const access = await canAccessCourse(courseId, userId);
    if (!access.ok) {
      return res.status(access.reason === "not_found" ? 404 : 403).json({
        error: access.reason === "not_found" ? "Course not found" : "Forbidden",
      });
    }
    if (access.teacherId !== userId) {
      return res.status(403).json({ error: "Only this course's teacher can add modules" });
    }

    const maxOrder = await prisma.module.aggregate({
      where: { courseId },
      _max: { order: true },
    });

    const nextOrder = (maxOrder._max.order ?? 0) + 1;

    const moduleRow = await prisma.module.create({
      data: {
        title: bodyParsed.data.title,
        courseId,
        order: nextOrder,
      },
      select: { id: true, title: true, order: true, createdAt: true },
    });

    return res.status(201).json({ module: moduleRow });
  } catch (err) {
    console.error("POST /courses/:courseId/modules error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /courses/:courseId/modules
 * Teacher OR  STUDENT: list modules
 */
router.get("/:courseId/modules", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const paramsParsed = courseIdParamsSchema.safeParse(req.params);
    if (!paramsParsed.success) return res.status(400).json({ error: "Invalid courseId" });
    const { courseId } = paramsParsed.data;

    const userId = req.auth!.userId;
    const access = await canAccessCourse(courseId, userId);
    if (!access.ok) {
      return res.status(access.reason === "not_found" ? 404 : 403).json({
        error: access.reason === "not_found" ? "Course not found" : "Forbidden",
      });
    }

    const modules = await prisma.module.findMany({
      where: { courseId },
      select: { id: true, title: true, order: true, createdAt: true },
      orderBy: { order: "asc" },
    });

    return res.json({ modules });
  } catch (err) {
    console.error("GET /courses/:courseId/modules error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * PATCH /courses/:courseId/modules/reorder
 * TEACHER only: reorder modules by id list
 */
router.patch("/:courseId/modules/reorder", requireAuth, requireRole("TEACHER"), async (req: AuthedRequest, res) => {
  try {
    const paramsParsed = courseIdParamsSchema.safeParse(req.params);
    if (!paramsParsed.success) return res.status(400).json({ error: "Invalid courseId" });
    const { courseId } = paramsParsed.data;

    const bodyParsed = reorderModulesSchema.safeParse(req.body);
    if (!bodyParsed.success) return res.status(400).json({ error: bodyParsed.error.flatten() });

    const userId = req.auth!.userId;

    const course = await prisma.course.findUnique({ where: { id: courseId }, select: { teacherId: true } });
    if (!course) return res.status(404).json({ error: "Course not found" });
    if (course.teacherId !== userId) return res.status(403).json({ error: "Only this course's teacher can reorder modules" });

    const count = await prisma.module.count({
      where: { courseId, id: { in: bodyParsed.data.moduleIdsInOrder } },
    });
    if (count !== bodyParsed.data.moduleIdsInOrder.length) {
      return res.status(400).json({ error: "One or more moduleIds are invalid for this course" });
    }

    await prisma.$transaction(
      bodyParsed.data.moduleIdsInOrder.map((id, index) =>
        prisma.module.update({ where: { id }, data: { order: index + 1 } })
      )
    );

    return res.json({ ok: true });
  } catch (err) {
    console.error("PATCH /courses/:courseId/modules/reorder error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /courses/:courseId/assignments
 * TEACHER only: create assignments by id list
 */
router.post(
  "/:courseId/assignments",
  requireAuth,
  requireRole("TEACHER"),
  async (req: AuthedRequest, res) => {
    try {
      const paramsParsed = courseIdParamsSchema.safeParse(req.params);
      if (!paramsParsed.success) return res.status(400).json({ error: "Invalid courseId" });
      const { courseId } = paramsParsed.data;

      const bodyParsed = createAssignmentSchema.safeParse(req.body);
      if (!bodyParsed.success) return res.status(400).json({ error: bodyParsed.error.flatten() });

      const userId = req.auth!.userId;

      const access = await canAccessCourse(courseId, userId);
      if (!access.ok) {
        return res.status(access.reason === "not_found" ? 404 : 403).json({
          error: access.reason === "not_found" ? "Course not found" : "Forbidden",
        });
      }
      if (access.teacherId !== userId) {
        return res.status(403).json({ error: "Only this course's teacher can add assignments" });
      }

      const { title, instructions, dueAt, points } = bodyParsed.data;

      const assignment = await prisma.assignment.create({
        data: {
          title,
          courseId,
          ...(instructions !== undefined ? { instructions } : {}),
          ...(dueAt !== undefined ? { dueAt } : {}),
          ...(points !== undefined ? { points } : {}),
        },
        select: {
          id: true,
          title: true,
          instructions: true,
          dueAt: true,
          points: true,
          courseId: true,
          createdAt: true,
        },
      });

      return res.status(201).json({ assignment });
    } catch (err) {
      console.error("POST /courses/:courseId/assignments error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

/**
 * GET /courses/:courseId/assignments
 * TEACHER or STUDENT access assignment by id list
 */
router.get("/:courseId/assignments", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const paramsParsed = courseIdParamsSchema.safeParse(req.params);
    if (!paramsParsed.success) return res.status(400).json({ error: "Invalid courseId" });
    const { courseId } = paramsParsed.data;

    const userId = req.auth!.userId;

    const access = await canAccessCourse(courseId, userId);
    if (!access.ok) {
      return res.status(access.reason === "not_found" ? 404 : 403).json({
        error: access.reason === "not_found" ? "Course not found" : "Forbidden",
      });
    }

    const assignments = await prisma.assignment.findMany({
      where: { courseId },
      select: { id: true, title: true, instructions: true, dueAt: true, points: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ assignments });
  } catch (err) {
    console.error("GET /courses/:courseId/assignments error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});



export default router;
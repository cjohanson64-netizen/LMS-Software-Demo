import bcrypt from "bcrypt";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  await prisma.submission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.module.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const teacherPw = await bcrypt.hash("Teacher123!", 10);
  const studentPw = await bcrypt.hash("Student123!", 10);

  const teacher = await prisma.user.create({
    data: {
      email: "teacher@demo.com",
      passwordHash: teacherPw,
      role: Role.TEACHER,
    },
  });

  const student = await prisma.user.create({
    data: {
      email: "student@demo.com",
      passwordHash: studentPw,
      role: Role.STUDENT,
    },
  });

  const course = await prisma.course.create({
    data: {
      title: "Intro to Canvas-Lite",
      description: "Sample LMS backend.",
      teacherId: teacher.id,
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course.id,
    },
  });

  await prisma.module.create({
    data: {
      title: "Week 1: Getting Started",
      order: 1,
      courseId: course.id,
    },
  });

  const assignment = await prisma.assignment.create({
    data: {
      title: "First Submission",
      instructions: "Paste a link to your Song Maker melody and reflect.",
      points: 10,
      courseId: course.id,
    },
  });

  console.log("Seeded: true");
  console.log("Teacher login:", "teacher@demo.com / Teacher123!");
  console.log("Student login:", "student@demo.com / Student123!");
  console.log("AssignmentId:", assignment.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

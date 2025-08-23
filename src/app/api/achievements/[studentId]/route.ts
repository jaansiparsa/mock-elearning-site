import { NextRequest, NextResponse } from "next/server";

import { db } from "@/server/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ studentId: string }> },
) {
  const { studentId } = await params;
  try {
    // Verify student exists
    const student = await prisma.user.findFirst({
      where: {
        id: studentId,
        role: "student",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        currentStreak: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Get student achievements
    const achievements = await prisma.achievement.findMany({
      where: { studentId },
      select: {
        achievementId: true,
        badgeType: true,
        earnedAt: true,
      },
      orderBy: {
        earnedAt: "desc",
      },
    });

    // Get learning statistics for context
    const enrollments = await db.courseEnrollment.findMany({
      where: { studentId },
      select: {
        course: {
          select: {
            title: true,
            category: true,
          },
        },
        lessonsCompleted: true,
      },
    });

    const totalCourses = enrollments.length;
    const totalLessonsCompleted = enrollments.reduce(
      (sum, enrollment) => sum + enrollment.lessonsCompleted,
      0,
    );

    const achievementsData = {
      student: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        username: student.username,
        currentStreak: student.currentStreak,
      },
      achievements,
      statistics: {
        totalAchievements: achievements.length,
        totalCourses,
        totalLessonsCompleted,
      },
    };

    return NextResponse.json({ data: achievementsData });
  } catch (error) {
    console.error("Get achievements error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

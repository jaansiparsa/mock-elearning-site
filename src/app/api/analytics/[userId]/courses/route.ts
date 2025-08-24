import { NextRequest, NextResponse } from "next/server";

import { db } from "@/server/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;

    // Get user's course enrollments with lessons and completion data
    const enrollments = await db.courseEnrollment.findMany({
      where: {
        studentId: userId,
      },
      include: {
        course: {
          include: {
            lessons: {
              orderBy: {
                order: "asc",
              },
            },
          },
        },
        lessonCompletions: true,
      },
    });

    return NextResponse.json({
      enrollments: enrollments.map((enrollment) => ({
        enrollmentId: enrollment.enrollmentId,
        course: {
          courseId: enrollment.course.courseId,
          title: enrollment.course.title,
          category: enrollment.course.category,
          difficultyLevel: enrollment.course.difficultyLevel,
          lessons: enrollment.course.lessons.map((lesson) => ({
            lessonId: lesson.lessonId,
            title: lesson.title,
            estimatedTime: lesson.estimatedTime,
          })),
        },
        lessonCompletions: enrollment.lessonCompletions.map((completion) => ({
          lessonId: completion.lessonId,
          completedAt: completion.completedAt,
        })),
      })),
    });
  } catch (error) {
    console.error("Error fetching course data:", error);
    return NextResponse.json(
      { error: "Failed to fetch course data" },
      { status: 500 },
    );
  }
}

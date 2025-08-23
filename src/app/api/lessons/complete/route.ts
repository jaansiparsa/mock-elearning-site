import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/server/auth";
import { db } from "@/server/db";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const body = (await request.json()) as {
      lessonId?: string;
      courseId?: string;
    };

    const { lessonId, courseId } = body;

    if (!lessonId || !courseId) {
      return NextResponse.json(
        { error: "Lesson ID and Course ID are required" },
        { status: 400 },
      );
    }

    const studentId = session.user.id;

    // Check if user is enrolled in the course
    const enrollment = await db.courseEnrollment.findFirst({
      where: {
        courseId,
        studentId,
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "You are not enrolled in this course" },
        { status: 400 },
      );
    }

    // Get the lesson to check its order
    const lesson = await db.lesson.findUnique({
      where: { lessonId },
      select: { order: true },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Check if lesson completion already exists
    const existingCompletion = await db.lessonCompletion.findUnique({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.enrollmentId,
          lessonId: lessonId,
        },
      },
    });

    if (existingCompletion) {
      return NextResponse.json(
        { error: "Lesson already completed" },
        { status: 400 },
      );
    }

    // Create lesson completion
    await db.lessonCompletion.create({
      data: {
        enrollmentId: enrollment.enrollmentId,
        lessonId: lessonId,
      },
    });

    return NextResponse.json(
      { message: "Lesson marked as complete" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error marking lesson complete:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

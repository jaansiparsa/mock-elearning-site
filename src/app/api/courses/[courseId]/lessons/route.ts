import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/server/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { courseId: string } },
) {
  try {
    const { courseId } = params;
    const body = await request.json();
    const { title, description, order, estimatedTime, instructorId } = body;

    // Validation
    if (!title || !description || !order || !estimatedTime || !instructorId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Verify course exists and instructor owns it
    const course = await prisma.course.findFirst({
      where: {
        courseId,
        instructorId,
      },
    });

    if (!course) {
      return NextResponse.json(
        {
          error: "Course not found or you don't have permission to add lessons",
        },
        { status: 404 },
      );
    }

    // Verify instructor role
    const instructor = await prisma.user.findFirst({
      where: {
        id: instructorId,
        role: "instructor",
      },
    });

    if (!instructor) {
      return NextResponse.json(
        { error: "User is not an instructor" },
        { status: 403 },
      );
    }

    // Check if lesson order already exists
    const existingLesson = await prisma.lesson.findFirst({
      where: {
        courseId,
        order,
      },
    });

    if (existingLesson) {
      return NextResponse.json(
        { error: "Lesson with this order already exists in the course" },
        { status: 409 },
      );
    }

    // Create lesson
    const lesson = await prisma.lesson.create({
      data: {
        courseId,
        title,
        description,
        order,
        estimatedTime,
      },
      select: {
        lessonId: true,
        courseId: true,
        title: true,
        description: true,
        order: true,
        estimatedTime: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Lesson created successfully",
        data: lesson,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create lesson error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


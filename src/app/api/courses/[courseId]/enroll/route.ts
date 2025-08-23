import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/server/auth";
import { db } from "@/server/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { courseId: string } },
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const { courseId } = params;
    const studentId = session.user.id;

    // Check if course exists
    const course = await db.course.findUnique({
      where: { courseId },
      select: { courseId: true },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if already enrolled
    const existingEnrollment = await db.courseEnrollment.findFirst({
      where: {
        courseId,
        studentId,
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Already enrolled in this course" },
        { status: 400 },
      );
    }

    // Create enrollment
    await db.courseEnrollment.create({
      data: {
        courseId,
        studentId,
        enrolledAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Successfully enrolled in course" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error enrolling in course:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { courseId: string } },
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const { courseId } = params;
    const studentId = session.user.id;

    // Check if enrolled
    const enrollment = await db.courseEnrollment.findFirst({
      where: {
        courseId,
        studentId,
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Not enrolled in this course" },
        { status: 400 },
      );
    }

    // Delete enrollment
    await db.courseEnrollment.delete({
      where: {
        enrollmentId: enrollment.enrollmentId,
      },
    });

    return NextResponse.json(
      { message: "Successfully cancelled enrollment" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error cancelling enrollment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

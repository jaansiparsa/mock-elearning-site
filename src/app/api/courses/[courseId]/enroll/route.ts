import { NextRequest, NextResponse } from "next/server";

import { HTTPStatus } from "@/types";
import { auth } from "@/server/auth";
import { db } from "@/server/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { courseId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: HTTPStatus.UNAUTHORIZED },
      );
    }

    // Check if user is a student
    if (session.user.role !== "student") {
      return NextResponse.json(
        { error: "Only students can enroll in courses" },
        { status: HTTPStatus.FORBIDDEN },
      );
    }

    // Check if course exists
    const course = await db.course.findUnique({
      where: { courseId },
      include: {
        assignments: true,
        lessons: true,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: HTTPStatus.NOT_FOUND },
      );
    }

    // Check if already enrolled
    const existingEnrollment = await db.courseEnrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: session.user.id,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Already enrolled in this course" },
        { status: HTTPStatus.BAD_REQUEST },
      );
    }

    // Create enrollment
    const enrollment = await db.courseEnrollment.create({
      data: {
        studentId: session.user.id,
        courseId,
      },
    });

    // Create AssignmentSubmission records for all assignments in the course
    const submissions = [];
    for (const assignment of course.assignments) {
      const submission = await db.assignmentSubmission.create({
        data: {
          studentId: session.user.id,
          assignmentId: assignment.assignmentId,
          status: "not_started",
          assignedAt: new Date(),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default due date: 30 days from now
        },
      });
      submissions.push(submission);
    }

    console.log(
      `Created ${submissions.length} assignment submissions for student ${session.user.id} in course ${courseId}`,
    );

    return NextResponse.json({
      message: "Successfully enrolled in course",
      enrollment,
      submissions,
    });
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      { error: "Failed to enroll in course" },
      { status: HTTPStatus.SERVER_ERROR },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { courseId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: HTTPStatus.UNAUTHORIZED },
      );
    }

    // Check if user is a student
    if (session.user.role !== "student") {
      return NextResponse.json(
        { error: "Only students can cancel enrollment" },
        { status: HTTPStatus.FORBIDDEN },
      );
    }

    // Check if enrolled
    const enrollment = await db.courseEnrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: session.user.id,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Not enrolled in this course" },
        { status: HTTPStatus.NOT_FOUND },
      );
    }

    // Delete all AssignmentSubmission records for this student and course
    const course = await db.course.findUnique({
      where: { courseId },
      include: { assignments: true },
    });

    if (course) {
      for (const assignment of course.assignments) {
        await db.assignmentSubmission.deleteMany({
          where: {
            studentId: session.user.id,
            assignmentId: assignment.assignmentId,
          },
        });
      }
    }

    // Delete enrollment
    await db.courseEnrollment.delete({
      where: { enrollmentId: enrollment.enrollmentId },
    });

    return NextResponse.json({
      message: "Successfully cancelled enrollment",
    });
  } catch (error) {
    console.error("Cancel enrollment error:", error);
    return NextResponse.json(
      { error: "Failed to cancel enrollment" },
      { status: HTTPStatus.SERVER_ERROR },
    );
  }
}

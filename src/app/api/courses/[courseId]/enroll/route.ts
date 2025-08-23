import { NextRequest, NextResponse } from "next/server";

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
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const studentId = session.user.id;

    // Check if course exists and get its assignments
    const course = await db.course.findUnique({
      where: { courseId },
      include: {
        assignments: {
          orderBy: { createdAt: "asc" },
        },
        lessons: {
          orderBy: { order: "asc" },
        },
      },
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
    const enrollment = await db.courseEnrollment.create({
      data: {
        courseId,
        studentId,
        enrolledAt: new Date(),
      },
    });

    // Create GivenAssignment records for all assignments in the course
    const givenAssignments = [];
    for (let i = 0; i < course.assignments.length; i++) {
      const assignment = course.assignments[i];
      const lesson = course.lessons[i] || null; // Associate with corresponding lesson if available

      const givenAssignment = await db.givenAssignment.create({
        data: {
          studentId,
          courseId,
          assignmentId: assignment.assignmentId,
          lessonId: lesson?.lessonId || null,
          status: "not_started",
          dueDate: assignment.dueDate, // Use the assignment's original due date
          assignedAt: new Date(),
        },
      });

      givenAssignments.push(givenAssignment);
    }

    console.log(
      `Created ${givenAssignments.length} given assignments for student ${studentId} in course ${courseId}`,
    );

    return NextResponse.json(
      {
        message: "Successfully enrolled in course",
        assignmentsCreated: givenAssignments.length,
      },
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
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { courseId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

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

    // Delete all GivenAssignment records for this student and course
    await db.givenAssignment.deleteMany({
      where: {
        courseId,
        studentId,
      },
    });

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

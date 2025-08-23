import { NextRequest, NextResponse } from "next/server";

import { db } from "@/server/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assignmentId, studentId, fileUrl, rubricUrl } = body;

    // Validation
    if (!assignmentId || !studentId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Verify assignment exists
    const assignment = await db.assignment.findUnique({
      where: { assignmentId },
      select: {
        assignmentId: true,
        courseId: true,
        title: true,
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 },
      );
    }

    // Verify student exists
    const student = await db.user.findFirst({
      where: {
        id: studentId,
        role: "student",
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found or user is not a student" },
        { status: 400 },
      );
    }

    // Check if student is enrolled in the course
    const enrollment = await db.courseEnrollment.findFirst({
      where: {
        studentId,
        courseId: assignment.courseId,
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Student is not enrolled in this course" },
        { status: 403 },
      );
    }

    // Check if AssignmentSubmission record exists
    const existingSubmission = await db.assignmentSubmission.findUnique({
      where: {
        studentId_assignmentId: {
          studentId,
          assignmentId,
        },
      },
    });

    if (existingSubmission) {
      // Update existing submission
      const updatedSubmission = await db.assignmentSubmission.update({
        where: {
          studentId_assignmentId: {
            studentId,
            assignmentId,
          },
        },
        data: {
          status: "completed",
          endedAt: new Date(),
        },
        select: {
          submissionId: true,
          assignmentId: true,
          studentId: true,
          status: true,
          endedAt: true,
        },
      });

      return NextResponse.json({
        message: "Assignment submission updated successfully",
        data: updatedSubmission,
      });
    }

    // Create new AssignmentSubmission record if it doesn't exist
    const submission = await db.assignmentSubmission.create({
      data: {
        assignmentId,
        studentId,
        status: "completed",
        assignedAt: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default due date
        endedAt: new Date(),
      },
      select: {
        submissionId: true,
        assignmentId: true,
        studentId: true,
        status: true,
        endedAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Assignment submitted successfully",
        data: submission,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Submit assignment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

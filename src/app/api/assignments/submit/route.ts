import { NextRequest, NextResponse } from "next/server";

import { SubmissionStatus } from "@/types";
import { prisma } from "@/server/db";

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
    const assignment = await prisma.assignment.findUnique({
      where: { assignmentId },
      select: {
        assignmentId: true,
        courseId: true,
        title: true,
        dueDate: true,
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 },
      );
    }

    // Verify student exists
    const student = await prisma.user.findFirst({
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
    const enrollment = await prisma.courseEnrollment.findFirst({
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

    // Check if submission already exists
    const existingSubmission = await prisma.assignmentSubmission.findUnique({
      where: {
        studentId_assignmentId: {
          studentId,
          assignmentId,
        },
      },
    });

    if (existingSubmission) {
      // Update existing submission
      const updatedSubmission = await prisma.assignmentSubmission.update({
        where: {
          studentId_assignmentId: {
            studentId,
            assignmentId,
          },
        },
        data: {
          status: SubmissionStatus.SUBMITTED,
          submittedAt: new Date(),
          fileUrl: fileUrl || existingSubmission.fileUrl,
          rubricUrl: rubricUrl || existingSubmission.rubricUrl,
        },
        select: {
          submissionId: true,
          assignmentId: true,
          studentId: true,
          status: true,
          submittedAt: true,
          fileUrl: true,
          rubricUrl: true,
        },
      });

      return NextResponse.json({
        message: "Assignment submission updated successfully",
        data: updatedSubmission,
      });
    }

    // Create new submission
    const submission = await prisma.assignmentSubmission.create({
      data: {
        assignmentId,
        studentId,
        status: SubmissionStatus.SUBMITTED,
        submittedAt: new Date(),
        fileUrl,
        rubricUrl,
      },
      select: {
        submissionId: true,
        assignmentId: true,
        studentId: true,
        status: true,
        submittedAt: true,
        fileUrl: true,
        rubricUrl: true,
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


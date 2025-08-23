import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/server/auth";
import { db } from "@/server/db";

export async function POST(request: NextRequest) {
  try {
    console.log("Assignment submit API called");
    const body = (await request.json()) as {
      assignmentId: string;
      submissionContent?: string;
      fileUrl?: string;
      fileName?: string;
    };
    console.log("Request body:", body);
    const { assignmentId, submissionContent, fileUrl, fileName } = body;

    // Validation
    if (!assignmentId || (!submissionContent && !fileUrl)) {
      console.log("Validation failed:", {
        assignmentId,
        submissionContent,
        fileUrl,
      });
      return NextResponse.json(
        {
          error:
            "Assignment ID and either submission content or file URL are required",
        },
        { status: 400 },
      );
    }

    // Get student ID from session
    console.log("Getting session...");
    const session = await auth();
    console.log("Session:", session);
    if (!session?.user?.id) {
      console.log("No session or user ID found");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }
    const studentId = session.user.id;
    console.log("Student ID:", studentId);

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

    // Always create a new submission for multiple submissions support
    const submission = await db.assignmentSubmission.create({
      data: {
        assignmentId,
        studentId,
        status: "completed",
        assignedAt: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default due date
        endedAt: new Date(),
        submissionContent: submissionContent ?? null,
        fileUrl: fileUrl ?? null,
        fileName: fileName ?? null,
        submittedAt: new Date(),
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

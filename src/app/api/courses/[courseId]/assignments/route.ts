import { NextRequest, NextResponse } from "next/server";

import { db } from "@/server/db";

type AssignmentWithSubmissions = {
  assignmentId: string;
  title: string;
  description: string;
  dueDate: Date;
  points: number;
  createdAt: Date;
  submissions?: {
    submissionId: string;
    status: string;
    submittedAt: Date | null;
    grade: number | null;
    feedback: string | null;
  }[];
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { courseId } = await params;
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    // Verify course exists
    const course = await db.course.findUnique({
      where: { courseId },
      select: {
        courseId: true,
        title: true,
        instructorId: true,
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Get assignments with optional student submission data
    const assignments = await db.assignment.findMany({
      where: { courseId },
      select: {
        assignmentId: true,
        title: true,
        description: true,
        dueDate: true,
        points: true,
        createdAt: true,
        ...(studentId && {
          submissions: {
            where: { studentId },
            select: {
              submissionId: true,
              status: true,
              submittedAt: true,
              grade: true,
              feedback: true,
            },
          },
        }),
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    // Format assignments with submission status
    const formattedAssignments = assignments.map((assignment) => {
      const submission = studentId && assignment.submissions?.[0];

      return {
        assignmentId: assignment.assignmentId,
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate,
        points: assignment.points,
        createdAt: assignment.createdAt,
        ...(studentId && {
          submission: submission ?? {
            status: "not_started",
            submittedAt: null,
            grade: null,
            feedback: null,
          },
        }),
      };
    });

    return NextResponse.json({
      data: {
        course: {
          courseId: course.courseId,
          title: course.title,
        },
        assignments: formattedAssignments,
        totalAssignments: formattedAssignments.length,
      },
    });
  } catch (error) {
    console.error("Get assignments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

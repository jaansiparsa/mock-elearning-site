import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/server/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } },
) {
  try {
    const { courseId } = params;
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    // Verify course exists
    const course = await prisma.course.findUnique({
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
    const assignments = await prisma.assignment.findMany({
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
          submission: submission || {
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


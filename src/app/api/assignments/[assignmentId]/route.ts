import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/server/auth";
import { db } from "@/server/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> },
) {
  try {
    const { assignmentId } = await params;

    // Get assignment with course and lesson info
    const assignment = await db.assignment.findUnique({
      where: { assignmentId },
      include: {
        course: {
          select: {
            courseId: true,
            title: true,
            category: true,
            difficultyLevel: true,
          },
        },
        lesson: {
          select: {
            lessonId: true,
            title: true,
            order: true,
          },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 },
      );
    }

    // Get the current user's session
    const session = await auth();
    let userSubmissions = [];

    if (session?.user?.id) {
      // Get all user's submissions for this assignment (multiple submissions support)
      userSubmissions = await db.assignmentSubmission.findMany({
        where: {
          studentId: session.user.id,
          assignmentId: assignmentId,
        },
        orderBy: {
          submittedAt: "desc",
        },
      });
    }

    return NextResponse.json({
      assignment,
      userSubmissions,
    });
  } catch (error) {
    console.error("Error fetching assignment data:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignment data" },
      { status: 500 },
    );
  }
}

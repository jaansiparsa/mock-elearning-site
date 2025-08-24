import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/server/auth";
import { db } from "@/server/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> },
) {
  try {
    console.log("Assignment API called with params:", await params);
    const { assignmentId } = await params;
    console.log("Processing assignment ID:", assignmentId);

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
      console.log(
        "Getting submissions for user:",
        session.user.id,
        "assignment:",
        assignmentId,
      );

      // Get all user's submissions for this assignment (multiple submissions support)
      const query = {
        where: {
          studentId: session.user.id,
          assignmentId: assignmentId,
        },
        orderBy: [
          {
            submittedAt: "desc",
          },
          {
            assignedAt: "desc", // Fallback ordering
          },
        ],
      };

      console.log("Query for submissions:", JSON.stringify(query, null, 2));

      try {
        userSubmissions = await db.assignmentSubmission.findMany(query);
        console.log("Found submissions:", userSubmissions);
        console.log("Query details:", {
          studentId: session.user.id,
          assignmentId: assignmentId,
          submissionsCount: userSubmissions.length,
        });
      } catch (error) {
        console.error("Error querying submissions:", error);
        userSubmissions = [];
      }

      // Also try a simpler query to see if there are any submissions at all
      try {
        const allSubmissionsForAssignment =
          await db.assignmentSubmission.findMany({
            where: { assignmentId: assignmentId },
          });
        console.log(
          "All submissions for assignment (any user):",
          allSubmissionsForAssignment,
        );
      } catch (error) {
        console.error("Error querying all submissions for assignment:", error);
      }

      try {
        const allSubmissionsForUser = await db.assignmentSubmission.findMany({
          where: { studentId: session.user.id },
        });
        console.log(
          "All submissions for user (any assignment):",
          allSubmissionsForUser,
        );
      } catch (error) {
        console.error("Error querying all submissions for user:", error);
      }
    } else {
      console.log("No session or user ID found");
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

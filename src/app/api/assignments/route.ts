import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/server/auth";
import { db } from "@/server/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "dueDate";
    const status = searchParams.get("status") || "all";
    const course = searchParams.get("course") || "all";

    // First, get all courses the user is enrolled in
    const userEnrollments = await db.courseEnrollment.findMany({
      where: { studentId: session.user.id },
      include: {
        course: {
          include: {
            assignments: true,
          },
        },
      },
    });

    // Get all assignments from enrolled courses
    const allAssignments = [];
    const coursesMap = new Map();

    for (const enrollment of userEnrollments) {
      const course = enrollment.course;

      // Add course to courses map
      coursesMap.set(course.courseId, {
        courseId: course.courseId,
        title: course.title,
      });

      // Process each assignment in the course
      for (const assignment of course.assignments) {
        // Check if there's a GivenAssignment record for this assignment
        const givenAssignment = await db.givenAssignment.findUnique({
          where: {
            studentId_assignmentId: {
              studentId: session.user.id,
              assignmentId: assignment.assignmentId,
            },
          },
        });

        const now = new Date();
        const dueDate = new Date(assignment.dueDate);
        const isOverdue =
          dueDate < now && givenAssignment?.status !== "completed";
        const isDueToday = dueDate.toDateString() === now.toDateString();
        const isDueThisWeek =
          dueDate <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) &&
          dueDate > now;

        // Map status - use GivenAssignment status if available, otherwise default to "not_started"
        let uiStatus: "not_started" | "in_progress" | "submitted" | "graded" =
          "not_started";

        if (givenAssignment) {
          switch (givenAssignment.status) {
            case "not_started":
              uiStatus = "not_started";
              break;
            case "in_progress":
              uiStatus = "in_progress";
              break;
            case "submitted":
              uiStatus = "submitted";
              break;
            case "completed":
              uiStatus = "graded";
              break;
            case "overdue":
              uiStatus = "not_started";
              break;
            default:
              uiStatus = "not_started";
          }
        }

        allAssignments.push({
          assignmentId: assignment.assignmentId,
          givenAssignmentId: givenAssignment?.givenAssignmentId || null,
          title: assignment.title,
          description: assignment.description,
          dueDate: assignment.dueDate,
          points: assignment.points,
          status: uiStatus,
          courseTitle: course.title,
          courseId: course.courseId,
          lessonTitle: null, // Will be populated if lesson association exists
          lessonId: givenAssignment?.lessonId || null,
          grade: givenAssignment?.grade || null,
          feedback: givenAssignment?.feedback || null,
          notes: givenAssignment?.notes || null,
          assignedAt: givenAssignment?.assignedAt || enrollment.enrolledAt,
          startedAt: givenAssignment?.startedAt || null,
          completedAt: givenAssignment?.completedAt || null,
          isOverdue,
          isDueToday,
          isDueThisWeek,
        });
      }
    }

    // Apply filters
    let filteredAssignments = allAssignments;

    if (status !== "all") {
      filteredAssignments = filteredAssignments.filter(
        (a) => a.status === status,
      );
    }

    if (course !== "all") {
      filteredAssignments = filteredAssignments.filter(
        (a) => a.courseId === course,
      );
    }

    // Apply sorting
    switch (sort) {
      case "course":
        filteredAssignments.sort((a, b) =>
          a.courseTitle.localeCompare(b.courseTitle),
        );
        break;
      case "title":
        filteredAssignments.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "dueDate":
        filteredAssignments.sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
        );
        break;
      case "status":
        filteredAssignments.sort((a, b) => a.status.localeCompare(b.status));
        break;
      case "points":
        filteredAssignments.sort((a, b) => b.points - a.points);
        break;
      default:
        filteredAssignments.sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
        );
    }

    // Calculate overview stats
    const totalAssignments = allAssignments.length;
    const completedAssignments = allAssignments.filter(
      (a) => a.status === "graded",
    ).length;
    const overdueAssignments = allAssignments.filter((a) => a.isOverdue).length;
    const upcomingAssignments = allAssignments.filter(
      (a) => !a.isOverdue && a.status !== "graded",
    ).length;

    const courses = Array.from(coursesMap.values());

    return NextResponse.json({
      assignments: filteredAssignments,
      overview: {
        total: totalAssignments,
        completed: completedAssignments,
        overdue: overdueAssignments,
        upcoming: upcomingAssignments,
      },
      courses,
    });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignments" },
      { status: 500 },
    );
  }
}

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
    const sort = searchParams.get("sort") ?? "dueDate";
    const status = searchParams.get("status") ?? "all";
    const course = searchParams.get("course") ?? "all";

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
        // Get the latest submission for this assignment (multiple submissions support)
        const submissions = await db.assignmentSubmission.findMany({
          where: {
            studentId: session.user.id,
            assignmentId: assignment.assignmentId,
          },
          orderBy: {
            submittedAt: "desc",
          },
          take: 1,
        });

        const submission = submissions[0] ?? null;

        const now = new Date();
        const dueDate =
          submission?.dueDate ??
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default to 30 days from now
        const isOverdue =
          dueDate < now &&
          submission?.status !== "completed" &&
          submission?.status !== "graded";
        const isDueToday = dueDate.toDateString() === now.toDateString();
        const isDueThisWeek =
          dueDate <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) &&
          dueDate > now;

        // Map status - use submission status if available, otherwise default to "not_started"
        let uiStatus:
          | "not_started"
          | "in_progress"
          | "completed"
          | "graded"
          | "overdue" = "not_started";

        if (submission) {
          switch (submission.status) {
            case "not_started":
              uiStatus = "not_started";
              break;
            case "in_progress":
              uiStatus = "in_progress";
              break;
            case "completed":
              uiStatus = "completed";
              break;
            case "graded":
              uiStatus = "graded";
              break;
            case "overdue":
              uiStatus = "overdue";
              break;
            default:
              uiStatus = "not_started";
          }
        }

        allAssignments.push({
          id: assignment.assignmentId,
          type: "assignment",
          assignmentId: assignment.assignmentId,
          submissionId: submission?.submissionId ?? null,
          title: assignment.title,
          description: assignment.description,
          dueDate: dueDate,
          points: assignment.points,
          status: uiStatus,
          courseTitle: course.title,
          courseId: course.courseId,
          lessonTitle: null, // Will be populated if lesson association exists
          lessonId: assignment.lessonId ?? null,
          grade: submission?.grade ?? null,
          feedback: submission?.feedback ?? null,
          assignedAt: submission?.assignedAt ?? enrollment.enrolledAt,
          startedAt: submission?.startedAt ?? null,
          completedAt: submission?.endedAt ?? null,
          isOverdue,
          isDueToday,
          isDueThisWeek,
        });
      }

      // Process each quiz in the course
      const quizzes = await db.quiz.findMany({
        where: { courseId: course.courseId },
      });

      for (const quiz of quizzes) {
        // Get the latest submission for this quiz
        const submissions = await db.quizSubmission.findMany({
          where: {
            studentId: session.user.id,
            quizId: quiz.quizId,
          },
          orderBy: {
            submittedAt: "desc",
          },
          take: 1,
        });

        const submission = submissions[0] ?? null;

        const now = new Date();
        const dueDate =
          submission?.dueDate ??
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default to 30 days from now
        const isOverdue =
          dueDate < now &&
          submission?.status !== "completed" &&
          submission?.status !== "graded";
        const isDueToday = dueDate.toDateString() === now.toDateString();
        const isDueThisWeek =
          dueDate <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) &&
          dueDate > now;

        // Map status for quizzes
        let uiStatus:
          | "not_started"
          | "in_progress"
          | "completed"
          | "graded"
          | "overdue" = "not_started";

        if (submission) {
          switch (submission.status) {
            case "not_started":
              uiStatus = "not_started";
              break;
            case "in_progress":
              uiStatus = "in_progress";
              break;
            case "completed":
              uiStatus = "completed";
              break;
            case "graded":
              uiStatus = "graded";
              break;
            case "overdue":
              uiStatus = "overdue";
              break;
            default:
              uiStatus = "not_started";
          }
        }

        allAssignments.push({
          id: quiz.quizId,
          type: "quiz",
          assignmentId: quiz.quizId,
          submissionId: submission?.submissionId ?? null,
          title: quiz.title,
          description: quiz.description ?? "",
          dueDate: dueDate,
          points: quiz.totalPoints,
          status: uiStatus,
          courseTitle: course.title,
          courseId: course.courseId,
          lessonTitle: null,
          lessonId: null,
          grade: submission?.score ?? null,
          feedback: submission?.feedback ?? null,
          assignedAt: submission?.assignedAt ?? enrollment.enrolledAt,
          startedAt: submission?.startedAt ?? null,
          completedAt: submission?.endedAt ?? null,
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
      (a) => a.status === "graded" || a.status === "completed",
    ).length;
    const overdueAssignments = allAssignments.filter((a) => a.isOverdue).length;
    const upcomingAssignments = allAssignments.filter(
      (a) => !a.isOverdue && a.status !== "graded" && a.status !== "completed",
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

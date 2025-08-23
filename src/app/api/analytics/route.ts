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
    const userId = searchParams.get("userId");
    const period = searchParams.get("period") ?? "week";

    if (!userId || userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "quarter":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "year":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Get period-specific data
    const periodLessons = await db.lessonCompletion.findMany({
      where: {
        enrollment: {
          studentId: userId,
        },
        completedAt: { gte: startDate },
      },
    });

    const periodAssignments = await db.assignmentSubmission.findMany({
      where: {
        studentId: userId,
        submittedAt: { gte: startDate },
        status: { in: ["completed", "graded"] },
      },
    });

    // Calculate period metrics
    const periodLessonsCount = periodLessons.length;
    const periodAssignmentsCount = periodAssignments.length;

    // Get course enrollment data
    const enrollments = await db.courseEnrollment.findMany({
      where: { studentId: userId },
      include: {
        course: true,
      },
    });

    const coursesInProgress = enrollments.length;
    const coursesCompleted = 0; // For now, assume no courses are fully completed

    // Get assignment scores (including quizzes)
    const gradedAssignments = await db.assignmentSubmission.findMany({
      where: {
        studentId: userId,
        status: "graded",
        grade: { not: null },
      },
      include: {
        assignment: {
          select: {
            title: true,
            points: true,
          },
        },
      },
    });

    // Separate quizzes from regular assignments
    const quizAssignments = gradedAssignments.filter((submission) =>
      submission.assignment.title.toLowerCase().includes("quiz"),
    );
    const regularAssignments = gradedAssignments.filter(
      (submission) =>
        !submission.assignment.title.toLowerCase().includes("quiz"),
    );

    // Calculate average assignment score as percentage
    let averageAssignmentScore = 0;
    if (gradedAssignments.length > 0) {
      const totalPercentage = gradedAssignments.reduce((sum, submission) => {
        if (submission.grade && submission.assignment.points) {
          return sum + (submission.grade / submission.assignment.points) * 100;
        }
        return sum;
      }, 0);
      averageAssignmentScore = totalPercentage / gradedAssignments.length;
    }

    // Calculate average quiz score separately
    let averageQuizScore = 0;
    if (quizAssignments.length > 0) {
      const totalQuizPercentage = quizAssignments.reduce((sum, submission) => {
        if (submission.grade && submission.assignment.points) {
          return sum + (submission.grade / submission.assignment.points) * 100;
        }
        return sum;
      }, 0);
      averageQuizScore = totalQuizPercentage / quizAssignments.length;
    }

    // Get overall statistics
    const totalLessonsCompleted = await db.lessonCompletion.count({
      where: {
        enrollment: {
          studentId: userId,
        },
      },
    });

    const totalAssignmentsCompleted = await db.assignmentSubmission.count({
      where: {
        studentId: userId,
        status: { in: ["completed", "graded"] },
      },
    });

    const totalAchievements = await db.achievement.count({
      where: {
        studentId: userId,
      },
    });

    // Get current streak from user
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { currentStreak: true },
    });

    // Prepare response data
    const analyticsData = {
      overview: {
        totalLessonsCompleted,
        totalAssignmentsCompleted,
        coursesCompleted,
        coursesInProgress,
        averageQuizScore: Math.round(averageQuizScore * 100) / 100, // Round to 2 decimal places
        averageAssignmentScore: Math.round(averageAssignmentScore * 100) / 100,
        currentStreak: user?.currentStreak ?? 0,
        totalAchievements,
      },
      periodData: {
        lessonsCompleted: periodLessonsCount,
        assignmentsCompleted: periodAssignmentsCount,
      },
      quizData: {
        totalQuizzes: quizAssignments.length,
        totalRegularAssignments: regularAssignments.length,
        averageQuizScore: Math.round(averageQuizScore * 100) / 100,
        averageRegularAssignmentScore:
          regularAssignments.length > 0
            ? Math.round(
                (regularAssignments.reduce((sum, submission) => {
                  if (submission.grade && submission.assignment.points) {
                    return (
                      sum +
                      (submission.grade / submission.assignment.points) * 100
                    );
                  }
                  return sum;
                }, 0) /
                  regularAssignments.length) *
                  100,
              ) / 100
            : 0,
        quizBreakdown: quizAssignments.map((submission) => ({
          title: submission.assignment.title,
          score: submission.grade,
          maxPoints: submission.assignment.points,
          percentage:
            submission.grade && submission.assignment.points
              ? Math.round(
                  (submission.grade / submission.assignment.points) * 100 * 100,
                ) / 100
              : 0,
        })),
      },
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 },
    );
  }
}

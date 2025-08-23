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

    // Get progress summary (create if doesn't exist)
    let progressSummary = await db.progressSummary.findUnique({
      where: { userId },
    });

    // If no progress summary exists, create one with default values
    if (!progressSummary) {
      progressSummary = await db.progressSummary.create({
        data: {
          userId,
          totalStudyHours: 0,
          totalSessions: 0,
          totalCoursesEnrolled: 0,
          totalCoursesCompleted: 0,
          totalLessonsCompleted: 0,
          totalAssignmentsCompleted: 0,
          averageQuizScore: 0,
          currentStreak: 0,
          longestStreak: 0,
          averageSessionLength: 0,
          totalAchievements: 0,
        },
      });
    }

    // Get period-specific data
    let periodSessions: any[] = [];
    try {
      periodSessions = await db.studySession.findMany({
        where: {
          userId,
          startTime: { gte: startDate },
          status: "completed",
        },
      });
    } catch (error) {
      console.log("No study sessions found or table doesn't exist yet");
    }

    const periodLessons = await db.lessonCompletion.findMany({
      where: {
        enrollment: {
          studentId: userId,
        },
        completedAt: { gte: startDate },
      },
    });

    const periodAssignments = await db.givenAssignment.findMany({
      where: {
        studentId: userId,
        completedAt: { gte: startDate },
        status: "graded",
      },
    });

    // Calculate period metrics
    const periodStudyHours = periodSessions.reduce((total, session) => {
      return total + (session.duration || 0) / 60;
    }, 0);

    const periodSessionsCount = periodSessions.length;
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

    // Get quiz scores
    const quizSubmissions = await db.quizSubmission.findMany({
      where: { studentId: userId },
    });

    const averageQuizScore =
      quizSubmissions.length > 0
        ? quizSubmissions.reduce((sum, quiz) => sum + quiz.score, 0) /
          quizSubmissions.length
        : 0;

    // Prepare response data
    const analyticsData = {
      overview: {
        totalStudyHours: progressSummary?.totalStudyHours || 0,
        totalSessions: progressSummary?.totalSessions || 0,
        coursesCompleted,
        coursesInProgress,
        averageQuizScore,
        currentStreak: progressSummary?.currentStreak || 0,
        longestStreak: progressSummary?.longestStreak || 0,
      },
      periodData: {
        studyHours: periodStudyHours,
        sessions: periodSessionsCount,
        lessonsCompleted: periodLessonsCount,
        assignmentsCompleted: periodAssignmentsCount,
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

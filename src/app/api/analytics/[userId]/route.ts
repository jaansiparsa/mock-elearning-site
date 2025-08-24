import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/server/auth";
import { db } from "@/server/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") ?? "week";

    // Verify the user is authenticated and requesting their own data
    const session = await auth();
    if (!session?.user?.id || session.user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Calculate date ranges
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get user's course enrollments and lesson completions
    const enrollments = await db.courseEnrollment.findMany({
      where: { studentId: userId },
      include: {
        course: {
          include: {
            lessons: {
              select: {
                lessonId: true,
                estimatedTime: true,
              },
            },
          },
        },
        lessonCompletions: {
          select: {
            lessonId: true,
            completedAt: true,
          },
        },
      },
    });

    // Calculate study time based on completed lessons
    let totalStudyTime = 0;
    let weeklyStudyTime = 0;
    let monthlyStudyTime = 0;

    for (const enrollment of enrollments) {
      for (const completion of enrollment.lessonCompletions) {
        const lesson = enrollment.course.lessons.find(
          (l) => l.lessonId === completion.lessonId,
        );
        if (lesson) {
          totalStudyTime += lesson.estimatedTime;

          const completionDate = new Date(completion.completedAt);
          if (completionDate >= startOfWeek) {
            weeklyStudyTime += lesson.estimatedTime;
          }
          if (completionDate >= startOfMonth) {
            monthlyStudyTime += lesson.estimatedTime;
          }
        }
      }
    }

    // Calculate course progress
    let completedCourses = 0;
    let inProgressCourses = 0;
    const totalCourses = enrollments.length;

    for (const enrollment of enrollments) {
      const totalLessons = enrollment.course.lessons.length;
      const completedLessons = enrollment.lessonCompletions.length;

      if (completedLessons === totalLessons && totalLessons > 0) {
        completedCourses++;
      } else if (completedLessons > 0) {
        inProgressCourses++;
      }
    }

    // Get assignment performance data (excluding quizzes)
    const assignmentSubmissions = await db.assignmentSubmission.findMany({
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

    const totalAssignments = assignmentSubmissions.length;
    let averageAssignmentScore = 0;

    if (totalAssignments > 0) {
      const totalPercentage = assignmentSubmissions.reduce(
        (sum, submission) => {
          if (submission.grade && submission.assignment.points) {
            return (
              sum + (submission.grade / submission.assignment.points) * 100
            );
          }
          return sum;
        },
        0,
      );
      averageAssignmentScore = Math.round(totalPercentage / totalAssignments);
    }

    // Get quiz performance data
    const quizSubmissions = await db.quizSubmission.findMany({
      where: {
        studentId: userId,
        status: "graded",
        score: { not: null },
      },
      select: {
        submissionId: true,
        studentId: true,
        quizId: true,
        score: true,
        maxScore: true,
        submittedAt: true,
        quiz: {
          select: {
            title: true,
            totalPoints: true,
          },
        },
      },
    });

    const totalQuizzes = quizSubmissions.length;
    let averageQuizScore = 0;

    if (totalQuizzes > 0) {
      const totalPercentage = quizSubmissions.reduce((sum, submission) => {
        if (submission.score && submission.maxScore) {
          return sum + (submission.score / submission.maxScore) * 100;
        }
        return sum;
      }, 0);
      averageQuizScore = Math.round(totalPercentage / totalQuizzes);
    }

    // Calculate combined average score (weighted average of assignments and quizzes)
    let combinedAverageScore = 0;
    const totalSubmissions = totalAssignments + totalQuizzes;

    if (totalSubmissions > 0) {
      // Calculate total points available across all assignments and quizzes
      const totalAssignmentPoints = assignmentSubmissions.reduce(
        (sum, submission) => {
          return sum + (submission.assignment.points ?? 0);
        },
        0,
      );

      const totalQuizPoints = quizSubmissions.reduce((sum, submission) => {
        return sum + (submission.maxScore ?? 0);
      }, 0);

      const totalPoints = totalAssignmentPoints + totalQuizPoints;

      if (totalPoints > 0) {
        // Calculate total score earned across all assignments and quizzes
        const totalAssignmentScore = assignmentSubmissions.reduce(
          (sum, submission) => {
            return sum + (submission.grade ?? 0);
          },
          0,
        );

        const totalQuizScore = quizSubmissions.reduce((sum, submission) => {
          return sum + (submission.score ?? 0);
        }, 0);

        const totalScore = totalAssignmentScore + totalQuizScore;

        // Calculate weighted average: (total score earned / total points possible) * 100
        combinedAverageScore = Math.round((totalScore / totalPoints) * 100);
      }
    }

    // Calculate grade trend (simplified - could be enhanced with historical data)
    const gradeTrend = 0; // Placeholder for now

    // Get learning streak and achievements
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        currentStreak: true,
        achievements: {
          select: { achievementId: true },
        },
      },
    });

    const currentStreak = user?.currentStreak ?? 0;
    const totalAchievements = user?.achievements.length ?? 0;

    // For now, use current streak as longest (could be enhanced with historical tracking)
    const longestStreak = currentStreak;

    // Generate recent activity data
    const recentActivity = [];
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    });

    for (const date of last7Days) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      let dayLessonsCompleted = 0;
      let dayTimeStudied = 0;

      for (const enrollment of enrollments) {
        for (const completion of enrollment.lessonCompletions) {
          const completionDate = new Date(completion.completedAt);
          if (completionDate >= startOfDay && completionDate <= endOfDay) {
            dayLessonsCompleted++;
            const lesson = enrollment.course.lessons.find(
              (l) => l.lessonId === completion.lessonId,
            );
            if (lesson) {
              dayTimeStudied += lesson.estimatedTime;
            }
          }
        }
      }

      if (dayLessonsCompleted > 0) {
        recentActivity.push({
          date: date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
          lessonsCompleted: dayLessonsCompleted,
          timeStudied: dayTimeStudied,
        });
      }
    }

    // Reverse to show most recent first
    recentActivity.reverse();

    // Get user's weekly learning goal
    const userGoal = await db.user.findUnique({
      where: { id: userId },
      select: { weeklyLearningGoal: true },
    });

    const weeklyLearningGoal = userGoal?.weeklyLearningGoal ?? 300; // Default to 5 hours

    // Calculate weekly goal progress
    const weeklyGoalProgress = {
      completed: weeklyStudyTime,
      goal: weeklyLearningGoal,
      percentage: Math.min(
        Math.round((weeklyStudyTime / weeklyLearningGoal) * 100),
        100,
      ),
      remaining: Math.max(weeklyLearningGoal - weeklyStudyTime, 0),
      isOnTrack: weeklyStudyTime >= weeklyLearningGoal,
    };

    return NextResponse.json({
      studyTime: {
        thisWeek: weeklyStudyTime,
        thisMonth: monthlyStudyTime,
        total: totalStudyTime,
      },
      courses: {
        completed: completedCourses,
        inProgress: inProgressCourses,
        total: totalCourses,
      },
      performance: {
        averageQuizScore,
        averageAssignmentScore,
        totalQuizzes,
        totalAssignments,
        combinedAverageScore,
      },
      streaks: {
        current: currentStreak,
        longest: longestStreak,
        totalAchievements: totalAchievements,
      },
      weeklyLearningGoal,
      weeklyGoalProgress,
      recentActivity: recentActivity,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}

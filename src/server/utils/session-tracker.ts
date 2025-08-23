import { db } from "@/server/db";

export interface SessionStartData {
  userId: string;
  courseId: string;
  lessonId?: string;
  assignmentId?: string;
  activityType: "lesson" | "quiz" | "assignment" | "reading";
}

export interface SessionEndData {
  sessionId: string;
  status: "completed" | "abandoned";
  metadata?: Record<string, any>;
}

/**
 * Start a new study session
 */
export async function startStudySession(data: SessionStartData) {
  try {
    const session = await db.studySession.create({
      data: {
        userId: data.userId,
        courseId: data.courseId,
        lessonId: data.lessonId,
        assignmentId: data.assignmentId,
        activityType: data.activityType,
        startTime: new Date(),
        status: "in_progress",
      },
    });

    // Log learning event
    await db.learningEvent.create({
      data: {
        userId: data.userId,
        eventType: "session_started",
        sessionId: session.sessionId,
        courseId: data.courseId,
        lessonId: data.lessonId,
        assignmentId: data.assignmentId,
        timestamp: new Date(),
      },
    });

    return session;
  } catch (error) {
    console.error("Error starting study session:", error);
    throw error;
  }
}

/**
 * End a study session and calculate duration
 */
export async function endStudySession(data: SessionEndData) {
  try {
    const session = await db.studySession.findUnique({
      where: { sessionId: data.sessionId },
    });

    if (!session) {
      throw new Error("Session not found");
    }

    const endTime = new Date();
    const duration = Math.round(
      (endTime.getTime() - session.startTime.getTime()) / (1000 * 60),
    ); // Duration in minutes

    // Update session
    const updatedSession = await db.studySession.update({
      where: { sessionId: data.sessionId },
      data: {
        endTime,
        duration,
        status: data.status,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      },
    });

    // Log learning event
    await db.learningEvent.create({
      data: {
        userId: session.userId,
        eventType: "session_ended",
        sessionId: session.sessionId,
        courseId: session.courseId,
        lessonId: session.lessonId,
        assignmentId: session.assignmentId,
        timestamp: endTime,
        metadata: JSON.stringify({
          duration,
          status: data.status,
          ...data.metadata,
        }),
      },
    });

    // Update progress summary
    await updateProgressSummary(session.userId);

    return updatedSession;
  } catch (error) {
    console.error("Error ending study session:", error);
    throw error;
  }
}

/**
 * Update progress summary for a user
 */
async function updateProgressSummary(userId: string) {
  try {
    // Get completed sessions
    const completedSessions = await db.studySession.findMany({
      where: {
        userId,
        status: "completed",
        duration: { not: null },
      },
    });

    // Get course enrollments
    const enrollments = await db.courseEnrollment.findMany({
      where: { studentId: userId },
    });

    // Get completed lessons
    const completedLessons = await db.lessonCompletion.findMany({
      where: {
        enrollment: { studentId: userId },
      },
    });

    // Get completed assignments
    const completedAssignments = await db.givenAssignment.findMany({
      where: {
        studentId: userId,
        status: "graded",
      },
    });

    // Get quiz scores
    const quizSubmissions = await db.quizSubmission.findMany({
      where: { studentId: userId },
    });

    // Calculate metrics
    const totalStudyHours = completedSessions.reduce(
      (total, session) => total + (session.duration || 0) / 60,
      0,
    );

    const averageQuizScore =
      quizSubmissions.length > 0
        ? quizSubmissions.reduce((sum, quiz) => sum + quiz.score, 0) /
          quizSubmissions.length
        : 0;

    const averageSessionLength =
      completedSessions.length > 0
        ? completedSessions.reduce(
            (sum, session) => sum + (session.duration || 0),
            0,
          ) / completedSessions.length
        : 0;

    // Calculate learning streak (simplified - based on days with completed sessions)
    const currentStreak = await calculateLearningStreak(userId);
    const longestStreak = await calculateLongestStreak(userId);

    // Upsert progress summary
    await db.progressSummary.upsert({
      where: { userId },
      update: {
        lastUpdated: new Date(),
        totalStudyHours,
        totalSessions: completedSessions.length,
        totalCoursesEnrolled: enrollments.length,
        totalCoursesCompleted: 0, // TODO: Implement course completion logic
        totalLessonsCompleted: completedLessons.length,
        totalAssignmentsCompleted: completedAssignments.length,
        averageQuizScore,
        currentStreak,
        longestStreak,
        averageSessionLength,
        totalAchievements: 0, // TODO: Implement achievement counting
      },
      create: {
        userId,
        totalStudyHours,
        totalSessions: completedSessions.length,
        totalCoursesEnrolled: enrollments.length,
        totalCoursesCompleted: 0,
        totalLessonsCompleted: completedLessons.length,
        totalAssignmentsCompleted: completedAssignments.length,
        averageQuizScore,
        currentStreak,
        longestStreak,
        averageSessionLength,
        totalAchievements: 0,
      },
    });
  } catch (error) {
    console.error("Error updating progress summary:", error);
    throw error;
  }
}

/**
 * Calculate current learning streak
 */
async function calculateLearningStreak(userId: string): Promise<number> {
  try {
    const completedSessions = await db.studySession.findMany({
      where: {
        userId,
        status: "completed",
        endTime: { not: null },
      },
      orderBy: { endTime: "desc" },
    });

    if (completedSessions.length === 0) return 0;

    let streak = 0;
    const now = new Date();
    let currentDate = new Date(now);

    for (let i = 0; i < 30; i++) {
      // Check last 30 days
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      const hasActivity = completedSessions.some(
        (session) => session.endTime! >= dayStart && session.endTime! <= dayEnd,
      );

      if (hasActivity) {
        streak++;
      } else {
        break;
      }

      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  } catch (error) {
    console.error("Error calculating learning streak:", error);
    return 0;
  }
}

/**
 * Calculate longest learning streak
 */
async function calculateLongestStreak(userId: string): Promise<number> {
  try {
    const completedSessions = await db.studySession.findMany({
      where: {
        userId,
        status: "completed",
        endTime: { not: null },
      },
      orderBy: { endTime: "asc" },
    });

    if (completedSessions.length === 0) return 0;

    let maxStreak = 0;
    let currentStreak = 0;
    let lastDate: Date | null = null;

    for (const session of completedSessions) {
      const sessionDate = new Date(session.endTime!);
      sessionDate.setHours(0, 0, 0, 0);

      if (lastDate === null) {
        currentStreak = 1;
      } else {
        const dayDiff = Math.floor(
          (sessionDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (dayDiff === 1) {
          currentStreak++;
        } else if (dayDiff > 1) {
          maxStreak = Math.max(maxStreak, currentStreak);
          currentStreak = 1;
        }
      }

      lastDate = sessionDate;
    }

    maxStreak = Math.max(maxStreak, currentStreak);
    return maxStreak;
  } catch (error) {
    console.error("Error calculating longest streak:", error);
    return 0;
  }
}

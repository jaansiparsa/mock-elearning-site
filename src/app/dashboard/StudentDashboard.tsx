import type {
  BadgeType,
  CourseCategory,
  DifficultyLevel,
} from "@prisma/client";

import { CourseDashboard } from "@/components/course-dashboard";
import CourseRecommendations from "./CourseRecommendations";
import { db } from "@/server/db";

interface StudentDashboardProps {
  userId: string;
}

async function getStudentData(userId: string) {
  try {
    const [user, enrollments, achievements] = await Promise.all([
      db.user.findUnique({
        where: { id: userId },
        select: {
          firstName: true,
          lastName: true,
          username: true,
          currentStreak: true,
          lastLearned: true,
          avatarUrl: true,
        },
      }),
      db.courseEnrollment.findMany({
        where: { studentId: userId },
        include: {
          course: {
            include: {
              instructor: {
                select: {
                  firstName: true,
                  lastName: true,
                  username: true,
                },
              },
              lessons: {
                select: {
                  lessonId: true,
                  order: true,
                  estimatedTime: true,
                },
                orderBy: { order: "asc" },
              },
              ratings: {
                select: { rating: true },
              },
              assignments: {
                select: { assignmentId: true },
              },
            },
          },
        },
        orderBy: { enrolledAt: "desc" },
      }),
      db.achievement.findMany({
        where: { studentId: userId },
        orderBy: { earnedAt: "desc" },
        take: 5,
      }),
    ]);

    // Simplified progress calculation - just count lessons
    const enrollmentsWithProgress = enrollments.map((enrollment) => {
      const totalLessons = enrollment.course.lessons.length;
      const completedLessons = 0; // Simplified for now
      const progressPercent = 0; // Simplified for now
      const estimatedTimeRemaining = 0; // Simplified for now

      return {
        ...enrollment,
        progressPercent,
        estimatedTimeRemaining,
        lessonsCompleted: completedLessons,
      };
    });

    return { user, enrollments: enrollmentsWithProgress, achievements };
  } catch (error) {
    console.error("Error fetching student data:", error);
    // Return empty data on error
    return {
      user: null,
      enrollments: [],
      achievements: [],
    };
  }
}

function getCategoryColor(category: CourseCategory) {
  const colors = {
    programming: "bg-blue-100 text-blue-800",
    design: "bg-purple-100 text-purple-800",
    business: "bg-green-100 text-green-800",
    marketing: "bg-yellow-100 text-yellow-800",
    science: "bg-red-100 text-red-800",
    language: "bg-indigo-100 text-indigo-800",
    music: "bg-pink-100 text-pink-800",
    art: "bg-orange-100 text-orange-800",
    other: "bg-gray-100 text-gray-800",
  };
  return colors[category] || colors.other;
}

function getDifficultyColor(difficulty: DifficultyLevel) {
  const colors = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800",
  };
  return colors[difficulty];
}

function getBadgeIcon(badgeType: BadgeType) {
  const icons = {
    first_course: "🎓",
    seven_day_streak: "🔥",
    high_scorer: "⭐",
    early_bird: "🌅",
    perfect_score: "🏆",
    course_completer: "✅",
    streak_master: "🔥🔥",
    social_learner: "👥",
  };
  return icons[badgeType] || "🏅";
}

export default async function StudentDashboard({
  userId,
}: StudentDashboardProps) {
  const { user, enrollments, achievements } = await getStudentData(userId);

  if (!user) return null;

  const totalCourses = enrollments.length;
  const totalLessonsCompleted = enrollments.reduce(
    (sum, enrollment) => sum + enrollment.lessonsCompleted,
    0,
  );
  const totalLessons = enrollments.reduce(
    (sum, enrollment) => sum + enrollment.course.lessons.length,
    0,
  );
  const totalAssignments = enrollments.reduce(
    (sum, enrollment) => sum + enrollment.course.assignments.length,
    0,
  );

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Enrolled Courses
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalCourses}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Lessons Completed
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalLessonsCompleted}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3">
              <svg
                className="h-6 w-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Lessons</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalLessons}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-100 p-3">
              <svg
                className="h-6 w-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Assignments</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalAssignments}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Streak */}
      <div className="rounded-lg bg-gradient-to-r from-orange-400 to-pink-400 p-6 text-white shadow">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="mb-2 text-lg font-semibold">Learning Streak</h3>
            <p className="text-3xl font-bold">{user.currentStreak} days</p>
            <p className="text-orange-100">
              {user.lastLearned
                ? `Last learned: ${new Date(user.lastLearned).toLocaleDateString()}`
                : "Start your learning journey today!"}
            </p>
          </div>
          <div className="text-6xl">🔥</div>
        </div>
      </div>

      {/* Enhanced Course Dashboard */}
      <div className="rounded-lg bg-white shadow">
        <div className="p-6">
          <CourseDashboard enrollments={enrollments} />
        </div>
      </div>

      {/* Course Recommendations */}
      <CourseRecommendations
        userId={userId}
        enrolledCourses={enrollments.map((e) => ({
          course: {
            courseId: e.course.courseId,
            category: e.course.category as string,
          },
        }))}
      />

      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">
              Recent Achievements
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.achievementId}
                  className="flex items-center rounded-lg bg-gray-50 p-3"
                >
                  <div className="mr-3 text-2xl">
                    {getBadgeIcon(achievement.badgeType)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {achievement.badgeType.replace(/_/g, " ")}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(achievement.earnedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

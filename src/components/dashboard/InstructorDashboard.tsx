import type { CourseCategory, DifficultyLevel } from "@prisma/client";

import { db } from "@/server/db";

interface InstructorDashboardProps {
  userId: string;
}

async function getInstructorData(userId: string) {
  const [user, courses] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        username: true,
        avatarUrl: true,
      },
    }),
    db.course.findMany({
      where: { instructorId: userId },
      include: {
        lessons: {
          select: { lessonId: true },
        },
        assignments: {
          select: { assignmentId: true },
        },
        enrollments: {
          include: {
            student: {
              select: {
                firstName: true,
                lastName: true,
                username: true,
              },
            },
          },
        },
        ratings: {
          select: { rating: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { user, courses };
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

export default async function InstructorDashboard({
  userId,
}: InstructorDashboardProps) {
  const { user, courses } = await getInstructorData(userId);

  if (!user) return null;

  const totalCourses = courses.length;
  const totalStudents = courses.reduce(
    (sum, course) => sum + course.enrollments.length,
    0,
  );
  const totalLessons = courses.reduce(
    (sum, course) => sum + course.lessons.length,
    0,
  );
  const totalAssignments = courses.reduce(
    (sum, course) => sum + course.assignments.length,
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
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Students
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalStudents}
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

      {/* Welcome Message */}
      <div className="rounded-lg bg-gradient-to-r from-blue-400 to-indigo-400 p-6 text-white shadow">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="mb-2 text-lg font-semibold">
              Welcome back, {user.firstName}!
            </h3>
            <p className="text-blue-100">
              You&apos;re teaching {totalCourses} course
              {totalCourses !== 1 ? "s" : ""} to {totalStudents} student
              {totalStudents !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="text-6xl">👨‍🏫</div>
        </div>
      </div>

      {/* Teaching Courses */}
      <div className="rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">Your Courses</h3>
        </div>
        <div className="p-6">
          {courses.length === 0 ? (
            <div className="py-8 text-center">
              <div className="mb-4 text-6xl">📚</div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No courses created yet
              </h3>
              <p className="text-gray-600">
                Start teaching by creating your first course!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => {
                const averageRating =
                  course.ratings.length > 0
                    ? course.ratings.reduce(
                        (sum, rating) => sum + rating.rating,
                        0,
                      ) / course.ratings.length
                    : 0;

                return (
                  <div
                    key={course.courseId}
                    className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="mb-1 font-medium text-gray-900">
                          {course.title}
                        </h4>
                        <p className="mb-2 text-sm text-gray-600">
                          Created:{" "}
                          {new Date(course.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <img
                        src={
                          course.thumbnailUrl ||
                          "https://placekitten.com/100/100"
                        }
                        alt={course.title}
                        className="h-16 w-16 rounded object-cover"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(course.category)}`}
                        >
                          {course.category}
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getDifficultyColor(course.difficultyLevel)}`}
                        >
                          {course.difficultyLevel}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Students</p>
                          <p className="font-medium text-gray-900">
                            {course.enrollments.length}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Lessons</p>
                          <p className="font-medium text-gray-900">
                            {course.lessons.length}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Assignments</p>
                          <p className="font-medium text-gray-900">
                            {course.assignments.length}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Rating</p>
                          <p className="font-medium text-gray-900">
                            {averageRating > 0
                              ? averageRating.toFixed(1)
                              : "N/A"}
                          </p>
                        </div>
                      </div>

                      {course.enrollments.length > 0 && (
                        <div className="border-t border-gray-100 pt-3">
                          <p className="mb-2 text-xs text-gray-600">
                            Recent Students:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {course.enrollments
                              .slice(0, 3)
                              .map((enrollment) => (
                                <span
                                  key={enrollment.studentId}
                                  className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                                >
                                  {enrollment.student.firstName}{" "}
                                  {enrollment.student.lastName}
                                </span>
                              ))}
                            {course.enrollments.length > 3 && (
                              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                                +{course.enrollments.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <button className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors hover:border-blue-400 hover:bg-blue-50">
              <div className="text-center">
                <div className="mb-2 text-3xl">➕</div>
                <p className="font-medium text-gray-900">Create New Course</p>
                <p className="text-sm text-gray-600">
                  Start teaching something new
                </p>
              </div>
            </button>

            <button className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors hover:border-green-400 hover:bg-green-50">
              <div className="text-center">
                <div className="mb-2 text-3xl">📝</div>
                <p className="font-medium text-gray-900">Add Lesson</p>
                <p className="text-sm text-gray-600">
                  Expand your course content
                </p>
              </div>
            </button>

            <button className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors hover:border-purple-400 hover:bg-purple-50">
              <div className="text-center">
                <div className="mb-2 text-3xl">📊</div>
                <p className="font-medium text-gray-900">View Analytics</p>
                <p className="text-sm text-gray-600">Track student progress</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

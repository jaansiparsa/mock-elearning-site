import type { CourseCategory, DifficultyLevel } from "@prisma/client";

import Link from "next/link";

interface CourseCardProps {
  course: {
    courseId: string;
    title: string;
    description: string;
    thumbnailUrl?: string;
    category: CourseCategory;
    difficultyLevel: DifficultyLevel;
    instructor: {
      firstName: string;
      lastName: string;
      username: string;
    };
    averageRating?: number;
    totalLessons?: number;
    totalEnrollments?: number;
    totalRatings?: number;
  };
  showInstructor?: boolean;
  showStats?: boolean;
  className?: string;
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

function getDifficultyIcon(difficulty: DifficultyLevel) {
  const icons = {
    beginner: "🌱",
    intermediate: "🚀",
    advanced: "🔥",
  };
  return icons[difficulty];
}

export default function CourseCard({
  course,
  showInstructor = true,
  showStats = true,
  className = "",
}: CourseCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-lg ${className}`}
    >
      <div className="flex">
        {/* Course Thumbnail */}
        <div className="relative w-48 flex-shrink-0 overflow-hidden">
          <img
            src={course.thumbnailUrl || "https://placekitten.com/400/300"}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(
                course.category,
              )}`}
            >
              {course.category}
            </span>
          </div>

          {/* Difficulty Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getDifficultyColor(
                course.difficultyLevel,
              )}`}
            >
              {getDifficultyIcon(course.difficultyLevel)}{" "}
              {course.difficultyLevel}
            </span>
          </div>
        </div>

        {/* Course Content */}
        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            {/* Course Title */}
            <Link href={`/courses/${course.courseId}`}>
              <h3 className="mb-2 line-clamp-2 cursor-pointer text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                {course.title}
              </h3>
            </Link>

            {/* Course Description */}
            <p className="mb-4 line-clamp-2 text-sm text-gray-600">
              {course.description}
            </p>

            {/* Instructor Info */}
            {showInstructor && (
              <div className="mb-4 flex items-center">
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                  <span className="text-sm font-medium text-gray-700">
                    {course.instructor.firstName[0]}
                    {course.instructor.lastName[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {course.instructor.firstName} {course.instructor.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    @{course.instructor.username}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Section with Stats and Actions */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            {/* Course Stats */}
            {showStats && (
              <div className="flex space-x-6">
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">
                    {course.totalLessons || 0}
                  </p>
                  <p className="text-xs text-gray-500">Lessons</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">
                    {course.totalEnrollments || 0}
                  </p>
                  <p className="text-xs text-gray-500">Students</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">
                    {course.averageRating && course.averageRating > 0
                      ? course.averageRating.toFixed(1)
                      : "N/A"}
                  </p>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
              </div>
            )}

            {/* Action Button and Rating */}
            <div className="flex items-center space-x-4">
              {/* Rating Display */}
              {course.averageRating &&
                course.averageRating > 0 &&
                course.totalRatings &&
                course.totalRatings > 0 && (
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(course.averageRating!)
                              ? "fill-current text-yellow-400"
                              : "text-gray-300"
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-xs text-gray-500">
                      ({course.totalRatings})
                    </span>
                  </div>
                )}

              <Link
                href={`/courses/${course.courseId}`}
                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
              >
                View Course
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

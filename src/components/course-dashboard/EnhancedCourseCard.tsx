import { Clock, Play, Star } from "lucide-react";
import type { CourseCategory, DifficultyLevel } from "@prisma/client";

import Link from "next/link";

interface EnhancedCourseCardProps {
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
    lessons: Array<{
      lessonId: string;
      order: number;
      estimatedTime: number;
    }>;
    averageRating?: number;
    totalRatings?: number;
  };
  enrollment: {
    lessonsCompleted: number;
    enrolledAt: Date;
    progressPercent: number;
    estimatedTimeRemaining: number;
  };
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

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

export default function EnhancedCourseCard({
  course,
  enrollment,
  className = "",
}: EnhancedCourseCardProps) {
  const totalLessons = course.lessons.length;
  const progressPercent = enrollment.progressPercent;
  const estimatedTimeRemaining = enrollment.estimatedTimeRemaining;

  const remainingLessons = course.lessons.slice(enrollment.lessonsCompleted);

  const nextLesson = remainingLessons[0];
  const hasNextLesson =
    nextLesson && enrollment.lessonsCompleted < totalLessons;

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-lg ${className}`}
    >
      <div className="flex">
        {/* Course Thumbnail */}
        <div className="relative w-48 flex-shrink-0 overflow-hidden">
          <img
            src={course.thumbnailUrl ?? "https://placekitten.com/400/300"}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(course.category)}`}
            >
              {course.category}
            </span>
          </div>

          {/* Difficulty Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getDifficultyColor(course.difficultyLevel)}`}
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
            <h3 className="mb-2 line-clamp-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
              {course.title}
            </h3>

            {/* Course Description */}
            <p className="mb-4 line-clamp-2 text-sm text-gray-600">
              {course.description}
            </p>

            {/* Instructor Info */}
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

            {/* Rating */}
            {course.averageRating && course.totalRatings && (
              <div className="mb-4 flex items-center">
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="mr-1 h-4 w-4 fill-current text-yellow-400" />
                  <span className="font-medium">
                    {course.averageRating.toFixed(1)}
                  </span>
                  <span className="ml-1 text-gray-500">
                    ({course.totalRatings} reviews)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Progress and Actions */}
          <div className="space-y-4 border-t border-gray-100 pt-4">
            {/* Progress Bar */}
            <div>
              <div className="mb-2 flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>
                  {enrollment.lessonsCompleted}/{totalLessons} lessons
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {progressPercent}% complete
              </p>
            </div>

            {/* Time Information */}
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="mr-1 h-4 w-4" />
              <span>Time remaining: {formatTime(estimatedTimeRemaining)}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <Link
                href={`/courses/${course.courseId}`}
                className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
              >
                View Course
              </Link>

              {hasNextLesson && (
                <Link
                  href={`/courses/${course.courseId}/lessons/${nextLesson.lessonId}`}
                  className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Continue Learning
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

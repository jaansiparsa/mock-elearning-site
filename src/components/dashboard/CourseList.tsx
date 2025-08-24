import { BookOpen, Calendar, Clock, Play, Star } from "lucide-react";
import type { CourseCategory, DifficultyLevel } from "@prisma/client";

import Link from "next/link";

interface CourseListProps {
  enrollments: Array<{
    enrollmentId: string;
    lessonsCompleted: number;
    enrolledAt: Date;
    progressPercent: number;
    estimatedTimeRemaining: number;
    course: {
      courseId: string;
      title: string;
      description: string;
      thumbnailUrl?: string;
      category: string;
      difficultyLevel: string;
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
      ratings: Array<{
        rating: number;
      }>;
    };
  }>;
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
  return colors[category] ?? colors.other;
}

function getDifficultyColor(difficulty: DifficultyLevel) {
  const colors = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800",
  };
  return colors[difficulty];
}

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

export default function CourseList({
  enrollments,
  className = "",
}: CourseListProps) {
  if (enrollments.length === 0) {
    return (
      <div className={`py-12 text-center ${className}`}>
        <div className="mb-4 text-6xl">📚</div>
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          No courses enrolled yet
        </h3>
        <p className="text-gray-600">
          Start your learning journey by enrolling in a course!
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {enrollments.map((enrollment) => {
        const totalLessons = enrollment.course.lessons.length;
        const progressPercent = enrollment.progressPercent;

        // Find the earliest uncompleted lesson by checking lesson order
        const sortedLessons = [...enrollment.course.lessons].sort(
          (a, b) => a.order - b.order,
        );
        const nextLesson = sortedLessons[enrollment.lessonsCompleted];
        const hasNextLesson =
          nextLesson && enrollment.lessonsCompleted < totalLessons;

        const estimatedTimeRemaining = enrollment.estimatedTimeRemaining;

        // Calculate average rating
        const averageRating =
          enrollment.course.ratings.length > 0
            ? enrollment.course.ratings.reduce((acc, r) => acc + r.rating, 0) /
              enrollment.course.ratings.length
            : undefined;

        return (
          <div
            key={enrollment.enrollmentId}
            className="group rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex items-start space-x-6">
              {/* Course Thumbnail */}
              <div className="relative w-32 flex-shrink-0 overflow-hidden rounded-lg">
                <img
                  src={
                    enrollment.course.thumbnailUrl ??
                    "https://placekitten.com/300/200"
                  }
                  alt={enrollment.course.title}
                  className="h-24 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Course Content */}
              <div className="min-w-0 flex-1">
                <div className="mb-3 flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <Link href={`/courses/${enrollment.course.courseId}`}>
                      <h3 className="cursor-pointer truncate text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                        {enrollment.course.title}
                      </h3>
                    </Link>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                      {enrollment.course.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="ml-4 flex flex-col items-end space-y-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(enrollment.course.category as CourseCategory)}`}
                    >
                      {enrollment.course.category}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getDifficultyColor(enrollment.course.difficultyLevel as DifficultyLevel)}`}
                    >
                      {enrollment.course.difficultyLevel}
                    </span>
                  </div>
                </div>

                {/* Instructor and Rating */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                      <span className="text-sm font-medium text-gray-700">
                        {enrollment.course.instructor.firstName[0]}
                        {enrollment.course.instructor.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {enrollment.course.instructor.firstName}{" "}
                        {enrollment.course.instructor.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        @{enrollment.course.instructor.username}
                      </p>
                    </div>
                  </div>

                  {averageRating && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="mr-1 h-4 w-4 fill-current text-yellow-400" />
                      <span className="font-medium">
                        {averageRating.toFixed(1)}
                      </span>
                      <span className="ml-1 text-gray-500">
                        ({enrollment.course.ratings.length})
                      </span>
                    </div>
                  )}
                </div>

                {/* Progress and Time */}
                <div className="space-y-3">
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

                  {/* Time and Enrollment Info */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>
                          Time remaining: {formatTime(estimatedTimeRemaining)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        <span>
                          Enrolled:{" "}
                          {new Date(enrollment.enrolledAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                  <Link
                    href={`/courses/${enrollment.course.courseId}`}
                    className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                  >
                    View Course
                  </Link>

                  {hasNextLesson && (
                    <Link
                      href={`/courses/${enrollment.course.courseId}/lessons/${nextLesson.lessonId}`}
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
        );
      })}
    </div>
  );
}

import type { CourseCategory, DifficultyLevel } from "@/types";
import Link from "next/link";

interface VerticalCourseCardProps {
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

export default function VerticalCourseCard({
  course,
  className = "",
}: VerticalCourseCardProps) {
  return (
    <Link
      href={`/courses/${course.courseId}`}
      className={`group block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md ${className}`}
    >
      {/* Course Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={course.thumbnailUrl || "https://placekitten.com/400/300"}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(
              course.category,
            )}`}
          >
            {course.category}
          </span>
        </div>

        {/* Difficulty Badge */}
        <div className="absolute top-2 right-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getDifficultyColor(
              course.difficultyLevel,
            )}`}
          >
            {getDifficultyIcon(course.difficultyLevel)}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
          {course.title}
        </h3>

        {/* Description */}
        <p className="mb-3 line-clamp-2 text-sm text-gray-600">
          {course.description}
        </p>

        {/* Instructor */}
        <div className="mb-3 flex items-center text-sm text-gray-500">
          <span className="mr-1">👨‍🏫</span>
          <span>
            {course.instructor.firstName} {course.instructor.lastName}
          </span>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          {/* Lessons */}
          <div className="flex items-center">
            <span className="mr-1">📚</span>
            <span>{course.totalLessons || 0} lessons</span>
          </div>

          {/* Students */}
          <div className="flex items-center">
            <span className="mr-1">👥</span>
            <span>{course.totalEnrollments || 0} students</span>
          </div>

          {/* Rating */}
          {course.averageRating && (
            <div className="flex items-center">
              <span className="mr-1">⭐</span>
              <span>{course.averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

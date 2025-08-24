"use client";

import { Award, BookOpen, Clock, Users } from "lucide-react";
import type { CourseCategory, DifficultyLevel } from "@prisma/client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CourseHeaderProps {
  course: {
    courseId: string;
    title: string;
    description: string;
    thumbnailUrl?: string;
    category: CourseCategory;
    difficultyLevel: DifficultyLevel;
    instructor: {
      id: string;
      firstName: string;
      lastName: string;
      username: string;
      avatarUrl?: string;
    };
    lessons: Array<{
      lessonId: string;
      title: string;
      order: number;
      estimatedTime: number;
    }>;
    totalLessons: number;
    totalTime: number;
    totalEnrollments: number;
    totalAssignments: number;
    isEnrolled: boolean;
    completedLessonIds?: string[];
  };
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

export default function CourseHeader({ course }: CourseHeaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(course.isEnrolled);
  const router = useRouter();

  // Calculate next lesson for enrolled users
  const getNextLesson = () => {
    if (!course.lessons || !course.completedLessonIds) return null;

    // Sort lessons by order
    const sortedLessons = [...course.lessons].sort((a, b) => a.order - b.order);

    // Find the first lesson that hasn't been completed
    const nextLesson = sortedLessons.find(
      (lesson) => !course.completedLessonIds!.includes(lesson.lessonId),
    );

    return nextLesson;
  };

  const nextLesson = getNextLesson();
  const hasNextLesson =
    nextLesson &&
    course.completedLessonIds &&
    course.completedLessonIds.length < course.totalLessons;

  const checkAuthAndRedirect = async (): Promise<boolean> => {
    try {
      console.log("Checking authentication...");
      // Check if user is authenticated by trying to access a protected API
      const response = await fetch("/api/auth/check", { method: "GET" });
      console.log("Auth check response status:", response.status);
      console.log("Auth check response ok:", response.ok);

      if (!response.ok) {
        console.log("User is not authenticated, redirecting to login");
        // User is not authenticated, redirect to login
        router.push("/auth/signin");
        return false;
      }

      const authData = (await response.json()) as {
        authenticated: boolean;
        user: { id: string; email: string };
      };
      console.log("Auth check successful:", authData);
      return true;
    } catch (error) {
      console.error("Error occurred during auth check:", error);
      // Error occurred, redirect to login
      router.push("/auth/signin");
      return false;
    }
  };

  const handleEnroll = async () => {
    console.log("Enroll button clicked for course:", course.courseId);

    // Check authentication first
    const isAuthenticated = await checkAuthAndRedirect();
    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to login");
      return;
    }

    console.log("User authenticated, proceeding with enrollment");
    setIsLoading(true);

    try {
      console.log(
        "Making enrollment API call to:",
        `/api/courses/${course.courseId}/enroll`,
      );

      const response = await fetch(`/api/courses/${course.courseId}/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Enrollment response status:", response.status);
      console.log("Enrollment response ok:", response.ok);

      if (response.ok) {
        const result = (await response.json()) as {
          message: string;
          assignmentsCreated: number;
        };
        console.log("Enrollment successful:", result);
        setIsEnrolled(true);
        // Optionally refresh the page or show success message
        window.location.reload();
      } else if (response.status === 401) {
        console.log("Unauthorized, redirecting to login");
        // Unauthorized, redirect to login
        router.push("/auth/signin");
      } else {
        const errorData = (await response
          .json()
          .catch(() => ({ error: "Unknown error" }))) as { error: string };
        console.error(
          "Failed to enroll in course:",
          response.status,
          errorData,
        );
        alert(`Failed to enroll: ${errorData.error ?? "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
      alert("Network error occurred while enrolling. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEnrollment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/courses/${course.courseId}/enroll`, {
        method: "DELETE",
      });

      if (response.ok) {
        setIsEnrolled(false);
      } else {
        console.error("Failed to cancel enrollment");
      }
    } catch (error) {
      console.error("Error canceling enrollment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center space-x-2 text-sm text-gray-600">
        <Link href="/explore" className="hover:text-blue-600">
          Explore
        </Link>
        <span>/</span>
        <Link
          href={`/explore?category=${course.category}`}
          className="hover:text-blue-600"
        >
          {course.category}
        </Link>
        <span>/</span>
        <span className="text-gray-900">{course.title}</span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Course Info */}
        <div className="lg:col-span-2">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            {course.title}
          </h1>
          <p className="mb-6 text-lg text-gray-600">{course.description}</p>

          {/* Instructor Info */}
          <div className="mb-6 flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
              {course.instructor.avatarUrl ? (
                <img
                  src={course.instructor.avatarUrl}
                  alt={`${course.instructor.firstName} ${course.instructor.lastName}`}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-lg font-medium text-gray-700">
                  {course.instructor.firstName[0]}
                  {course.instructor.lastName[0]}
                </span>
              )}
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                {course.instructor.firstName} {course.instructor.lastName}
              </p>
              <p className="text-gray-600">@{course.instructor.username}</p>
            </div>
          </div>

          {/* Course Stats */}
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {course.totalLessons}
              </p>
              <p className="text-sm text-gray-600">Lessons</p>
            </div>
            <div className="text-center">
              <div className="mb-2 flex items-center justify-center">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatTime(course.totalTime)}
              </p>
              <p className="text-sm text-gray-600">Duration</p>
            </div>
            <div className="text-center">
              <div className="mb-2 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {course.totalEnrollments}
              </p>
              <p className="text-sm text-gray-600">Students</p>
            </div>
            <div className="text-center">
              <div className="mb-2 flex items-center justify-center">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {course.totalAssignments}
              </p>
              <p className="text-sm text-gray-600">Assignments</p>
            </div>
          </div>
        </div>

        {/* Course Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            {/* Course Thumbnail */}
            <div className="relative mb-4 aspect-video overflow-hidden rounded-lg">
              <img
                src={course.thumbnailUrl ?? "https://placekitten.com/400/300"}
                alt={course.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Tags */}
            <div className="mb-4 flex gap-2">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(course.category)}`}
              >
                {course.category}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getDifficultyColor(course.difficultyLevel)}`}
              >
                {getDifficultyIcon(course.difficultyLevel)}{" "}
                {course.difficultyLevel}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {isEnrolled ? (
                <>
                  {hasNextLesson ? (
                    <Link
                      href={`/courses/${course.courseId}/lessons/${nextLesson.lessonId}`}
                      className="block w-full rounded-lg bg-green-600 px-4 py-3 text-center font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Continue Learning - Lesson {nextLesson.order}
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard"
                      className="block w-full rounded-lg bg-green-600 px-4 py-3 text-center font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Course Complete
                    </Link>
                  )}
                  <button
                    onClick={handleCancelEnrollment}
                    className="w-full rounded-lg border border-red-300 px-4 py-3 font-medium text-red-700 transition-colors hover:bg-red-50 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Cancel Enrollment"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEnroll}
                    className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Enroll Now"}
                  </button>
                  <button
                    onClick={async () => {
                      const isAuthenticated = await checkAuthAndRedirect();
                      if (isAuthenticated) {
                        // TODO: Implement wishlist functionality
                        alert("Wishlist feature coming soon!");
                      }
                    }}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Add to Wishlist
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

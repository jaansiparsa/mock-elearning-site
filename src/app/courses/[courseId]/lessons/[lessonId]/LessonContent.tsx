"use client";

import { ArrowLeft, ArrowRight, CheckCircle, Play } from "lucide-react";

import Link from "next/link";
import { useState } from "react";

interface LessonContentProps {
  lessonData: {
    lesson: {
      lessonId: string;
      title: string;
      description: string;
      order: number;
      estimatedTime: number;
      course: {
        courseId: string;
        title: string;
        instructor: {
          firstName: string;
          lastName: string;
          username: string;
        };
      };
    };
    isCompleted: boolean;
    nextLesson?: {
      lessonId: string;
      title: string;
      order: number;
    };
    totalLessons: number;
    currentLessonIndex: number;
  };
}

export default function LessonContent({ lessonData }: LessonContentProps) {
  const [isCompleted, setIsCompleted] = useState(lessonData.isCompleted);
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkComplete = async () => {
    if (isCompleted) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/lessons/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lessonId: lessonData.lesson.lessonId,
          courseId: lessonData.lesson.course.courseId,
        }),
      });

      if (response.ok) {
        setIsCompleted(true);
      } else {
        const error = await response.json();
        alert(
          `Failed to mark lesson complete: ${error.error || "Unknown error"}`,
        );
      }
    } catch (error) {
      console.error("Error marking lesson complete:", error);
      alert("Failed to mark lesson as complete. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {lessonData.lesson.title}
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              {lessonData.lesson.description}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">
              Lesson {lessonData.lesson.order} of {lessonData.totalLessons}
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {lessonData.lesson.estimatedTime < 60
                ? `${lessonData.lesson.estimatedTime}m`
                : `${Math.floor(lessonData.lesson.estimatedTime / 60)}h ${lessonData.lesson.estimatedTime % 60}m`}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
            <span>Course Progress</span>
            <span>
              {Math.round(
                (lessonData.currentLessonIndex / lessonData.totalLessons) * 100,
              )}
              % complete
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${(lessonData.currentLessonIndex / lessonData.totalLessons) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Instructor Info */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <span className="text-sm font-medium text-blue-700">
              {lessonData.lesson.course.instructor.firstName[0]}
              {lessonData.lesson.course.instructor.lastName[0]}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {lessonData.lesson.course.instructor.firstName}{" "}
              {lessonData.lesson.course.instructor.lastName}
            </p>
            <p className="text-xs text-gray-500">
              @{lessonData.lesson.course.instructor.username}
            </p>
          </div>
        </div>
      </div>

      {/* Lesson Content Placeholder */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Lesson Content
          </h2>
          <p className="text-gray-600">
            This is where the actual lesson content would be displayed.
          </p>
        </div>

        {/* Video/Content Placeholder */}
        <div className="mb-6 flex aspect-video items-center justify-center rounded-lg bg-gray-100">
          <div className="text-center">
            <Play className="mx-auto mb-2 h-16 w-16 text-gray-400" />
            <p className="text-gray-500">Lesson content would appear here</p>
            <p className="text-sm text-gray-400">
              Video, slides, or interactive content
            </p>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Additional Resources</h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="cursor-pointer rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100">
                  <span className="text-xs font-medium text-blue-700">📄</span>
                </div>
                <span className="text-sm text-gray-700">Lesson Notes</span>
              </div>
            </div>
            <div className="cursor-pointer rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-green-100">
                  <span className="text-xs font-medium text-green-700">📝</span>
                </div>
                <span className="text-sm text-gray-700">
                  Practice Exercises
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={`/courses/${lessonData.lesson.course.courseId}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Course
        </Link>

        <div className="flex items-center space-x-3">
          {isCompleted ? (
            <div className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white">
              <CheckCircle className="mr-2 h-4 w-4" />
              Completed
            </div>
          ) : (
            <button
              onClick={handleMarkComplete}
              disabled={isLoading}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  Marking...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Complete
                </>
              )}
            </button>
          )}

          {lessonData.nextLesson ? (
            <Link
              href={`/courses/${lessonData.lesson.course.courseId}/lessons/${lessonData.nextLesson.lessonId}`}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Next Lesson
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          ) : (
            <div className="inline-flex cursor-not-allowed items-center rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400">
              Next Lesson
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

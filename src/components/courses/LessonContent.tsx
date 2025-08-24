"use client";

import { CheckCircle, ChevronLeft, ChevronRight, Play } from "lucide-react";

import { useState } from "react";

interface LessonContentProps {
  lessonData: {
    lesson: {
      lessonId: string;
      title: string;
      description: string;
      order: number;
      estimatedTime: number;
      courseId: string;
    };
    isCompleted: boolean;
    nextLesson:
      | {
          lessonId: string;
          title: string;
          order: number;
        }
      | undefined;
    totalLessons: number;
    currentLessonIndex: number;
  };
}

export default function LessonContent({ lessonData }: LessonContentProps) {
  const [isCompleted, setIsCompleted] = useState(lessonData.isCompleted);

  const handleMarkComplete = async () => {
    try {
      const response = await fetch("/api/lessons/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lessonId: lessonData.lesson.lessonId,
          courseId: lessonData.lesson.courseId,
        }),
      });

      if (response.ok) {
        setIsCompleted(true);
      } else {
        const errorData = await response.json();
        console.error("Error marking lesson complete:", errorData);
      }
    } catch (error) {
      console.error("Error marking lesson complete:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Lesson Header */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {lessonData.lesson.title}
            </h1>
            <p className="mt-2 text-gray-600">
              Lesson {lessonData.lesson.order} of {lessonData.totalLessons}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <Play className="mr-2 h-4 w-4" />
              {lessonData.lesson.estimatedTime} min
            </div>
            {isCompleted && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="mr-2 h-5 w-5" />
                <span className="text-sm font-medium">Completed</span>
              </div>
            )}
          </div>
        </div>

        <p className="text-lg text-gray-700">{lessonData.lesson.description}</p>
      </div>

      {/* Lesson Content */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Lesson Content
        </h2>

        {/* Placeholder content - replace with actual lesson content */}
        <div className="prose max-w-none">
          <p className="text-gray-700">
            This is a placeholder for the actual lesson content. In a real
            application, this would contain the lesson materials, videos, text,
            or interactive elements.
          </p>

          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 font-medium text-gray-900">Lesson Overview</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
              <li>Introduction to the topic</li>
              <li>Key concepts and principles</li>
              <li>Practical examples and exercises</li>
              <li>Summary and next steps</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Lesson Actions */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            {lessonData.lesson.order > 1 && (
              <a
                href={`/courses/${lessonData.lesson.courseId}/lessons/${lessonData.lesson.order - 1}`}
                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous Lesson
              </a>
            )}
          </div>

          <div className="flex space-x-4">
            {!isCompleted && (
              <button
                onClick={handleMarkComplete}
                className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark Complete
              </button>
            )}

            {lessonData.nextLesson && (
              <a
                href={`/courses/${lessonData.lesson.courseId}/lessons/${lessonData.nextLesson.lessonId}`}
                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Next Lesson
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

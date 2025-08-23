import { CheckCircle, Play } from "lucide-react";

import Link from "next/link";

interface CurriculumTabProps {
  lessons: Array<{
    lessonId: string;
    title: string;
    description: string;
    order: number;
    estimatedTime: number;
  }>;
  totalLessons: number;
  totalTime: number;
  courseId: string;
  completedLessonIds?: string[];
}

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

export default function CurriculumTab({
  lessons,
  totalLessons,
  totalTime,
  courseId,
  completedLessonIds = [],
}: CurriculumTabProps) {
  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Course Content</h3>
        <div className="text-sm text-gray-600">
          {totalLessons} lessons • {formatTime(totalTime)}
        </div>
      </div>

      {lessons.map((lesson, index) => {
        const isCompleted = completedLessonIds.includes(lesson.lessonId);

        return (
          <Link
            key={lesson.lessonId}
            href={`/courses/${courseId}/lessons/${lesson.lessonId}`}
            className="block"
          >
            <div className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300 hover:bg-gray-50">
              <div className="flex items-center">
                <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-sm font-medium text-blue-700">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                  <p className="text-sm text-gray-600">{lesson.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {formatTime(lesson.estimatedTime)}
                </span>
                {isCompleted ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="mr-1 h-5 w-4" />
                    <span className="text-sm">Completed</span>
                  </div>
                ) : (
                  <div className="flex items-center text-blue-600">
                    <Play className="mr-1 h-4 w-4" />
                    <span className="text-sm">Start Lesson</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

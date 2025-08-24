import Link from "next/link";

interface CourseNavigationProps {
  courseId: string;
  lesson?: {
    lessonId: string;
    title: string;
    order: number;
  } | null;
}

export default function CourseNavigation({
  courseId,
  lesson,
}: CourseNavigationProps) {
  return (
    <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Course Navigation
      </h2>
      <div className="flex space-x-4">
        <Link
          href={`/courses/${courseId}`}
          className="inline-flex items-center rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          ← Back to Course
        </Link>
        {lesson && (
          <Link
            href={`/courses/${courseId}/lessons/${lesson.lessonId}`}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            View Lesson
          </Link>
        )}
      </div>
    </div>
  );
}

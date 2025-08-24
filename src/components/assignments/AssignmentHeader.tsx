import Link from "next/link";

interface AssignmentHeaderProps {
  assignment: {
    title: string;
    points: number;
    course: {
      courseId: string;
      title: string;
      category: string;
      difficultyLevel: string;
    };
    lesson?: {
      lessonId: string;
      title: string;
      order: number;
    } | null;
  };
}

export default function AssignmentHeader({
  assignment,
}: AssignmentHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <Link
              href="/assignments"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to Assignments
            </Link>
          </div>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            {assignment.title}
          </h1>
          <p className="mt-2 text-gray-600">
            Course: {assignment.course.title}
            {assignment.lesson &&
              ` • Lesson ${assignment.lesson.order}: ${assignment.lesson.title}`}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {assignment.points} pts
          </div>
          <div className="text-sm text-gray-500">
            {assignment.course.category} • {assignment.course.difficultyLevel}
          </div>
        </div>
      </div>
    </div>
  );
}

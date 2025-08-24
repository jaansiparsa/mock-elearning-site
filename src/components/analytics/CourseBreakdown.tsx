import { BookOpen } from "lucide-react";

interface CourseEnrollment {
  enrollmentId: string;
  course: {
    courseId: string;
    title: string;
    category: string;
    difficultyLevel: string;
    lessons: Array<{
      lessonId: string;
      title: string;
      estimatedTime: number;
    }>;
  };
  lessonCompletions: Array<{
    lessonId: string;
    completedAt: Date;
  }>;
}

interface CourseBreakdownProps {
  courseEnrollments: CourseEnrollment[];
}

export default function CourseBreakdown({
  courseEnrollments,
}: CourseBreakdownProps) {
  return (
    <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-semibold text-gray-900">
        Detailed Course Breakdown
      </h3>

      {/* Course List */}
      <div className="space-y-4">
        {courseEnrollments.map((enrollment) => {
          const totalLessons = enrollment.course.lessons.length;
          const completedLessons = enrollment.lessonCompletions.length;
          const completionPercentage =
            totalLessons > 0
              ? Math.round((completedLessons / totalLessons) * 100)
              : 0;

          return (
            <div
              key={enrollment.enrollmentId}
              className="rounded-lg border border-gray-200 bg-gray-50"
            >
              <button
                className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-100"
                onClick={() => {
                  const content = document.getElementById(
                    `course-${enrollment.enrollmentId}`,
                  );
                  if (content) {
                    content.classList.toggle("hidden");
                  }
                }}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      enrollment.course.category === "programming"
                        ? "bg-blue-100"
                        : enrollment.course.category === "marketing"
                          ? "bg-green-100"
                          : enrollment.course.category === "design"
                            ? "bg-purple-100"
                            : "bg-gray-100"
                    }`}
                  >
                    <BookOpen
                      className={`h-5 w-5 ${
                        enrollment.course.category === "programming"
                          ? "text-blue-600"
                          : enrollment.course.category === "marketing"
                            ? "text-green-600"
                            : enrollment.course.category === "design"
                              ? "text-purple-600"
                              : "text-gray-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {enrollment.course.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {enrollment.course.category.charAt(0).toUpperCase() +
                        enrollment.course.category.slice(1)}{" "}
                      •{" "}
                      {enrollment.course.difficultyLevel
                        .charAt(0)
                        .toUpperCase() +
                        enrollment.course.difficultyLevel.slice(1)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {completionPercentage}% Complete
                    </p>
                    <p className="text-xs text-gray-500">
                      {completedLessons} of {totalLessons} lessons
                    </p>
                  </div>
                  <div className="h-5 w-5 text-gray-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Expandable Content */}
              <div
                id={`course-${enrollment.enrollmentId}`}
                className="hidden border-t border-gray-200 p-4"
              >
                {/* Lesson Completion Timeline */}
                <div className="mb-6">
                  <h5 className="mb-3 text-sm font-medium text-gray-800">
                    Lesson Completion Timeline
                  </h5>
                  <div className="space-y-3">
                    {enrollment.course.lessons.map((lesson) => {
                      const isCompleted = enrollment.lessonCompletions.some(
                        (completion) => completion.lessonId === lesson.lessonId,
                      );
                      const completion = enrollment.lessonCompletions.find(
                        (completion) => completion.lessonId === lesson.lessonId,
                      );

                      return (
                        <div
                          key={lesson.lessonId}
                          className="flex items-center space-x-3"
                        >
                          <div
                            className={`h-3 w-3 rounded-full ${
                              isCompleted ? "bg-green-500" : "bg-gray-300"
                            }`}
                          ></div>
                          <span
                            className={`text-sm ${
                              isCompleted ? "text-gray-700" : "text-gray-500"
                            }`}
                          >
                            {lesson.title}
                          </span>
                          <span className="text-xs text-gray-500">
                            {isCompleted
                              ? `Completed ${completion?.completedAt ? new Date(completion.completedAt).toLocaleDateString() : "recently"}`
                              : "Not started"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Course Stats */}
                <div className="mb-4">
                  <h5 className="mb-3 text-sm font-medium text-gray-800">
                    Course Statistics
                  </h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-blue-50 p-3">
                      <div className="text-sm text-blue-600">
                        Total Study Time
                      </div>
                      <div className="text-lg font-semibold text-blue-900">
                        {enrollment.course.lessons.reduce(
                          (total, lesson) => total + lesson.estimatedTime,
                          0,
                        )}{" "}
                        min
                      </div>
                      <div className="text-xs text-blue-600">Estimated</div>
                    </div>
                    <div className="rounded-lg bg-green-50 p-3">
                      <div className="text-sm text-green-600">Progress</div>
                      <div className="text-lg font-semibold text-green-900">
                        {completionPercentage}%
                      </div>
                      <div className="text-xs text-green-600">
                        {completedLessons}/{totalLessons} lessons
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

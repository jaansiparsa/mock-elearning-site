import VerticalCourseCard from "./VerticalCourseCard";

interface CourseGridProps {
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

export default function CourseGrid({
  enrollments,
  className = "",
}: CourseGridProps) {
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
    <div
      className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}
    >
      {enrollments.map((enrollment) => {
        // Calculate average rating
        const averageRating =
          enrollment.course.ratings.length > 0
            ? enrollment.course.ratings.reduce((acc, r) => acc + r.rating, 0) /
              enrollment.course.ratings.length
            : undefined;

        return (
          <VerticalCourseCard
            key={enrollment.enrollmentId}
            course={{
              ...enrollment.course,
              category: enrollment.course.category as any,
              difficultyLevel: enrollment.course.difficultyLevel as any,
              averageRating,
              totalRatings: enrollment.course.ratings.length,
            }}
            enrollment={{
              lessonsCompleted: enrollment.lessonsCompleted,
              enrolledAt: enrollment.enrolledAt,
              progressPercent: enrollment.progressPercent,
              estimatedTimeRemaining: enrollment.estimatedTimeRemaining,
            }}
          />
        );
      })}
    </div>
  );
}

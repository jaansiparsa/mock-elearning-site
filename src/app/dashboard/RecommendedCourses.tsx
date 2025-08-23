import Link from "next/link";
import { db } from "@/server/db";

interface RecommendedCoursesProps {
  userId: string;
}

async function getRecommendedCourses(userId: string) {
  // Get user's enrolled courses and their categories
  const userEnrollments = await db.courseEnrollment.findMany({
    where: { studentId: userId },
    include: {
      course: {
        select: {
          category: true,
          difficultyLevel: true,
        },
      },
    },
  });

  // Extract categories and difficulty levels from enrolled courses
  const enrolledCategories = userEnrollments.map(e => e.course.category);
  const enrolledDifficulties = userEnrollments.map(e => e.course.difficultyLevel);

  // Get recommended courses based on:
  // 1. Same category as enrolled courses
  // 2. Popular courses overall
  // 3. Similar difficulty level
  
  const [categoryBased, popularCourses] = await Promise.all([
    // Courses in same categories as enrolled courses
    db.course.findMany({
      where: {
        category: { in: enrolledCategories },
        courseId: { notIn: userEnrollments.map(e => e.courseId) },
      },
      include: {
        instructor: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
          },
        },
        ratings: {
          select: { rating: true },
        },
        _count: {
          select: {
            enrollments: true,
            lessons: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    
    // Popular courses overall (by enrollment count)
    db.course.findMany({
      where: {
        courseId: { notIn: userEnrollments.map(e => e.courseId) },
      },
      include: {
        instructor: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
          },
        },
        ratings: {
          select: { rating: true },
        },
        _count: {
          select: {
            enrollments: true,
            lessons: true,
          },
        },
      },
      orderBy: {
        enrollments: { _count: "desc" },
      },
      take: 2,
    }),
  ]);

  // Combine and deduplicate recommendations
  const allRecommendations = [...categoryBased, ...popularCourses];
  const uniqueRecommendations = allRecommendations.filter((course, index, self) => 
    index === self.findIndex(c => c.courseId === course.courseId)
  );

  return uniqueRecommendations.slice(0, 4); // Return max 4 recommendations
}

export default async function RecommendedCourses({ userId }: RecommendedCoursesProps) {
  const recommendations = await getRecommendedCourses(userId);

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No recommendations available yet. Enroll in more courses to get personalized suggestions!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {recommendations.map((course) => {
        const averageRating = course.ratings.length > 0
          ? course.ratings.reduce((sum, r) => sum + r.rating, 0) / course.ratings.length
          : 0;
        
        const totalRatings = course.ratings.length;
        const enrollmentCount = course._count.enrollments;
        const lessonCount = course._count.lessons;

        return (
          <div key={course.courseId} className="rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="mb-3">
              <h4 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                {course.title}
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                by {course.instructor.firstName} {course.instructor.lastName}
              </p>
              
              {/* Course Stats */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>{lessonCount} lessons</span>
                <span>{enrollmentCount} students</span>
              </div>
              
              {/* Rating */}
              <div className="flex items-center mb-3">
                {averageRating > 0 ? (
                  <>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.round(averageRating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-xs text-gray-600">
                      ({totalRatings})
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-gray-400">No ratings yet</span>
                )}
              </div>
            </div>
            
            <Link
              href={`/courses/${course.courseId}`}
              className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              View Course
            </Link>
          </div>
        );
      })}
    </div>
  );
}

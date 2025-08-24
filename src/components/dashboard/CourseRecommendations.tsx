"use client";

import { Clock, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";

import Link from "next/link";

interface CourseRecommendationsProps {
  userId: string;
  enrolledCourses: Array<{
    course: {
      courseId: string;
      category: string;
    };
  }>;
}

interface RecommendationsResponse {
  recommendations: {
    collaborative: Course[];
    category: Course[];
    all: Course[];
  };
  userCategories: string[];
  totalEnrolled: number;
}

async function getRecommendations(
  userId: string,
  enrolledCourses: Array<{ course: { courseId: string; category: string } }>,
) {
  try {
    const response = await fetch("/api/recommendations?limit=6", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recommendations");
    }

    const data = (await response.json()) as RecommendationsResponse;
    return data;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    // Fallback to empty recommendations
    return {
      recommendations: {
        collaborative: [],
        category: [],
        all: [],
      },
      userCategories: [],
      totalEnrolled: 0,
    };
  }
}

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
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

interface Course {
  courseId: string;
  title: string;
  description: string;
  category: string;
  instructor: {
    firstName: string;
    lastName: string;
    username: string;
  };
  _count: {
    enrollments: number;
    lessons: number;
  };
  averageRating: number;
  totalRatings: number;
}

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md">
      <div className="mb-3">
        <div className="mb-2 flex items-start justify-between">
          <h4 className="line-clamp-2 font-semibold text-gray-900">
            {course.title}
          </h4>
          <span
            className={`ml-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(course.category)}`}
          >
            {course.category}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-gray-600">
          {course.description}
        </p>
      </div>

      <div className="mb-3 flex items-center text-sm text-gray-500">
        <div className="flex items-center">
          <Users className="mr-1 h-3 w-3" />
          <span>{course._count.enrollments}</span>
        </div>
        <div className="mx-2">•</div>
        <div className="flex items-center">
          <Clock className="mr-1 h-3 w-3" />
          <span>{course._count.lessons} lessons</span>
        </div>
        {course.averageRating > 0 && (
          <>
            <div className="mx-2">•</div>
            <div className="flex items-center">
              <Star className="mr-1 h-3 w-3 fill-current text-yellow-400" />
              <span>{course.averageRating}</span>
            </div>
          </>
        )}
      </div>

      <div className="mb-3 text-xs text-gray-500">
        by {course.instructor.firstName} {course.instructor.lastName}
      </div>

      <Link
        href={`/courses/${course.courseId}`}
        className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        View Course
      </Link>
    </div>
  );
}

export default function CourseRecommendations({
  userId,
  enrolledCourses,
}: CourseRecommendationsProps) {
  const [recommendationsData, setRecommendationsData] =
    useState<RecommendationsResponse>({
      recommendations: {
        collaborative: [],
        category: [],
        all: [],
      },
      userCategories: [],
      totalEnrolled: 0,
    });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setIsLoading(true);
        const data = await getRecommendations(userId, enrolledCourses);
        setRecommendationsData(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch recommendations",
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (enrolledCourses.length > 0) {
      void fetchRecommendations();
    }
  }, [userId, enrolledCourses]);

  const { recommendations, userCategories, totalEnrolled } =
    recommendationsData;

  // Don't show recommendations if user has no enrolled courses
  if (enrolledCourses.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">
              Loading Recommendations...
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">
              Recommendations
            </h3>
          </div>
          <div className="p-6">
            <div className="text-center text-gray-500">
              <p>Unable to load recommendations at this time.</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Collaborative Recommendations */}
      {recommendations.collaborative.length > 0 && (
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">
              Students Also Take
            </h3>
            <p className="text-sm text-gray-600">
              Based on what other students in your courses are learning
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.collaborative
                .slice(0, 3)
                .map((course: Course) => (
                  <CourseCard key={course.courseId} course={course} />
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Recommendations */}
      {recommendations.category.length > 0 && (
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">
              Similar to Your Courses
            </h3>
            <p className="text-sm text-gray-600">
              More courses in {userCategories.join(", ")}
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.category.slice(0, 3).map((course: Course) => (
                <CourseCard key={course.courseId} course={course} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fallback: All Recommendations */}
      {recommendations.collaborative.length === 0 &&
        recommendations.category.length === 0 &&
        recommendations.all.length > 0 && (
          <div className="rounded-lg bg-white shadow">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">
                Recommended for You
              </h3>
              <p className="text-sm text-gray-600">
                Based on your learning preferences
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recommendations.all.slice(0, 3).map((course: Course) => (
                  <CourseCard key={course.courseId} course={course} />
                ))}
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

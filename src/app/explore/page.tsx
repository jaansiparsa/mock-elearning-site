import type { CourseCategory, DifficultyLevel } from "@prisma/client";

import CourseCard from "@/components/CourseCard";
import CourseFilters from "./CourseFilters";
import SortControls from "./SortControls";
import { Suspense } from "react";
import { db } from "@/server/db";

interface ExplorePageProps {
  searchParams: {
    category?: string;
    difficulty?: string;
    search?: string;
    page?: string;
    sort?: string;
  };
}

async function getCourses(searchParams: ExplorePageProps["searchParams"]) {
  const {
    category,
    difficulty,
    search,
    page = "1",
    sort = "newest",
  } = searchParams;

  // Build where clause
  const where: {
    category?: { in: CourseCategory[] };
    difficultyLevel?: { in: DifficultyLevel[] };
    OR?: Array<
      | {
          title: { contains: string };
        }
      | {
          description: { contains: string };
        }
    >;
  } = {};

  if (category && category !== "all") {
    const categories = category.split(",") as CourseCategory[];
    where.category = { in: categories };
  }

  if (difficulty && difficulty !== "all") {
    const difficulties = difficulty.split(",") as DifficultyLevel[];
    where.difficultyLevel = { in: difficulties };
  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }

  // Determine sort order
  let orderBy: Record<string, any> = {};
  switch (sort) {
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    case "rating":
      orderBy = { ratings: { _count: "desc" } };
      break;
    case "popular":
      orderBy = { enrollments: { _count: "desc" } };
      break;
    case "title":
      orderBy = { title: "asc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }

  const pageNum = parseInt(page);
  const limit = 12;
  const skip = (pageNum - 1) * limit;

  // Get courses with instructor info and stats
  const [courses, totalCount] = await Promise.all([
    db.course.findMany({
      where,
      select: {
        courseId: true,
        title: true,
        description: true,
        thumbnailUrl: true,
        category: true,
        difficultyLevel: true,
        createdAt: true,
        instructor: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
          },
        },
        _count: {
          select: {
            lessons: true,
            enrollments: true,
            ratings: true,
          },
        },
        ratings: {
          select: {
            rating: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    db.course.count({ where }),
  ]);

  // Calculate average ratings and format data
  const formattedCourses = courses.map((course) => {
    const averageRating =
      course.ratings.length > 0
        ? course.ratings.reduce((sum, r) => sum + r.rating, 0) /
          course.ratings.length
        : 0;

    return {
      courseId: course.courseId,
      title: course.title,
      description: course.description,
      thumbnailUrl: course.thumbnailUrl,
      category: course.category,
      difficultyLevel: course.difficultyLevel,
      instructor: course.instructor,
      averageRating: Math.round(averageRating * 10) / 10,
      totalLessons: course._count.lessons,
      totalEnrollments: course._count.enrollments,
      totalRatings: course._count.ratings,
    };
  });

  const totalPages = Math.ceil(totalCount / limit);

  return {
    courses: formattedCourses,
    pagination: {
      page: pageNum,
      limit,
      totalCount,
      totalPages,
      hasNext: pageNum < totalPages,
      hasPrev: pageNum > 1,
    },
  };
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const { courses, pagination } = await getCourses(searchParams);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Explore Courses
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-blue-100">
              Discover amazing courses from expert instructors. Learn new
              skills, advance your career, and unlock your potential.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <CourseFilters searchParams={searchParams} />
          </div>

          {/* Courses Grid */}
          <div className="mt-8 lg:col-span-3 lg:mt-0">
            {/* Search and Sort */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {pagination.totalCount} Course
                  {pagination.totalCount !== 1 ? "s" : ""} Found
                </h2>
                {searchParams.search && (
                  <p className="mt-1 text-sm text-gray-600">
                    Results for "{searchParams.search}"
                  </p>
                )}
              </div>

              {/* Sort Dropdown */}
              <SortControls currentSort={searchParams.sort || "newest"} />
            </div>

            {/* Courses Grid */}
            {courses.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mb-4 text-6xl">🔍</div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  No courses found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search terms to find what you're
                  looking for.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                <Suspense
                  fallback={
                    <div className="col-span-full flex items-center justify-center py-12">
                      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                    </div>
                  }
                >
                  {courses.map((course) => (
                    <CourseCard key={course.courseId} course={course} />
                  ))}
                </Suspense>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center">
                <nav className="flex items-center space-x-2">
                  {pagination.hasPrev && (
                    <a
                      href={`/explore?${new URLSearchParams({
                        ...searchParams,
                        page: (pagination.page - 1).toString(),
                      })}`}
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Previous
                    </a>
                  )}

                  {/* Page Numbers */}
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1,
                  )
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === pagination.totalPages ||
                        Math.abs(page - pagination.page) <= 1,
                    )
                    .map((page, index, array) => (
                      <div key={page} className="flex items-center">
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-3 py-2 text-gray-500">...</span>
                        )}
                        <a
                          href={`/explore?${new URLSearchParams({
                            ...searchParams,
                            page: page.toString(),
                          })}`}
                          className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                            page === pagination.page
                              ? "bg-blue-600 text-white"
                              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </a>
                      </div>
                    ))}

                  {pagination.hasNext && (
                    <a
                      href={`/explore?${new URLSearchParams({
                        ...searchParams,
                        page: (pagination.page + 1).toString(),
                      })}`}
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Next
                    </a>
                  )}
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

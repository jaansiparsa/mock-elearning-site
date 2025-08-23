import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/server/auth";
import { db } from "@/server/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "6");

    // Get user's enrolled courses
    const userEnrollments = await db.courseEnrollment.findMany({
      where: { studentId: userId },
      select: {
        courseId: true,
        course: {
          select: {
            category: true,
          },
        },
      },
    });

    if (userEnrollments.length === 0) {
      // If user has no enrollments, return popular courses
      const popularCourses = await db.course.findMany({
        where: {
          courseId: { notIn: [] }, // No exclusions needed
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
        take: limit,
        orderBy: {
          enrollments: {
            _count: "desc",
          },
        },
      });

      const processedCourses = popularCourses.map((course) => {
        const ratings = course.ratings.map((r) => r.rating);
        const averageRating =
          ratings.length > 0
            ? Math.round(
                (ratings.reduce((sum, rating) => sum + rating, 0) /
                  ratings.length) *
                  10,
              ) / 10
            : 0;

        return {
          ...course,
          averageRating,
          totalRatings: ratings.length,
        };
      });

      return NextResponse.json({
        recommendations: processedCourses,
        type: "popular",
      });
    }

    const userCourseIds = userEnrollments.map((e) => e.courseId);
    const userCategories = [
      ...new Set(userEnrollments.map((e) => e.course.category)),
    ];

    // Strategy 1: Find courses that other students taking the same courses also take
    const collaborativeRecommendations = await db.courseEnrollment.groupBy({
      by: ["courseId"],
      where: {
        courseId: { notIn: userCourseIds },
        studentId: {
          in: await db.courseEnrollment
            .findMany({
              where: {
                courseId: { in: userCourseIds },
                studentId: { not: userId },
              },
              select: { studentId: true },
            })
            .then((enrollments) => enrollments.map((e) => e.studentId)),
        },
      },
      _count: {
        courseId: true,
      },
      orderBy: {
        _count: {
          courseId: "desc",
        },
      },
      take: Math.ceil(limit / 2),
    });

    // Strategy 2: Find courses in same categories as user's enrolled courses
    const categoryRecommendations = await db.course.findMany({
      where: {
        category: { in: userCategories },
        courseId: { notIn: userCourseIds },
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
      take: Math.ceil(limit / 2),
      orderBy: {
        enrollments: {
          _count: "desc",
        },
      },
    });

    // Get full course details for collaborative recommendations
    const collaborativeCourseIds = collaborativeRecommendations.map(
      (r) => r.courseId,
    );
    const collaborativeCourses = await db.course.findMany({
      where: {
        courseId: { in: collaborativeCourseIds },
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
    });

    // Combine and process all recommendations
    const allRecommendations = [
      ...collaborativeCourses,
      ...categoryRecommendations,
    ];

    // Remove duplicates and limit results
    const uniqueRecommendations = allRecommendations
      .filter(
        (course, index, self) =>
          index === self.findIndex((c) => c.courseId === course.courseId),
      )
      .slice(0, limit);

    // Process ratings and add metadata
    const processedRecommendations = uniqueRecommendations.map((course) => {
      const ratings = course.ratings.map((r) => r.rating);
      const averageRating =
        ratings.length > 0
          ? Math.round(
              (ratings.reduce((sum, rating) => sum + rating, 0) /
                ratings.length) *
                10,
            ) / 10
          : 0;

      // Determine recommendation type
      const isCollaborative = collaborativeCourseIds.includes(course.courseId);
      const isCategory = userCategories.includes(course.category);

      let recommendationType = "general";
      if (isCollaborative && isCategory) {
        recommendationType = "both";
      } else if (isCollaborative) {
        recommendationType = "collaborative";
      } else if (isCategory) {
        recommendationType = "category";
      }

      return {
        ...course,
        averageRating,
        totalRatings: ratings.length,
        recommendationType,
      };
    });

    // Group by recommendation type
    const groupedRecommendations = {
      collaborative: processedRecommendations.filter(
        (r) =>
          r.recommendationType === "collaborative" ||
          r.recommendationType === "both",
      ),
      category: processedRecommendations.filter(
        (r) =>
          r.recommendationType === "category" ||
          r.recommendationType === "both",
      ),
      all: processedRecommendations,
    };

    return NextResponse.json({
      recommendations: groupedRecommendations,
      userCategories,
      totalEnrolled: userEnrollments.length,
    });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 },
    );
  }
}

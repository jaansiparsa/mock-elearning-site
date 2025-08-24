import { CourseCategory, DifficultyLevel } from "@/types";
import { NextRequest, NextResponse } from "next/server";

import type { Prisma } from "@prisma/client";
import { db } from "@/server/db";

// Define the request body interface for POST
interface CreateCourseRequest {
  title: string;
  description: string;
  thumbnailUrl?: string;
  category: CourseCategory;
  difficultyLevel: DifficultyLevel;
  instructorId: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Query parameters
    const category = searchParams.get("category") as CourseCategory | null;
    const difficulty = searchParams.get("difficulty") as DifficultyLevel | null;
    const instructorId = searchParams.get("instructorId");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const search = searchParams.get("search") ?? "";

    // Build where clause with proper Prisma types
    const where: Prisma.CourseWhereInput = {};

    if (category) {
      where.category = category;
    }

    if (difficulty) {
      where.difficultyLevel = difficulty;
    }

    if (instructorId) {
      where.instructorId = instructorId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

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
          instructorId: true,
          createdAt: true,
          updatedAt: true,
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              avatarUrl: true,
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
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      db.course.count({ where }),
    ]);

    // Calculate average ratings
    const coursesWithStats = courses.map((course) => {
      const averageRating =
        course.ratings.length > 0
          ? course.ratings.reduce((sum, r) => sum + r.rating, 0) /
            course.ratings.length
          : 0;

      return {
        ...course,
        averageRating: Math.round(averageRating * 10) / 10,
        totalLessons: course._count.lessons,
        totalEnrollments: course._count.enrollments,
        totalRatings: course._count.ratings,
        ratings: undefined, // Remove raw ratings data
        _count: undefined, // Remove count object
      };
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      data: coursesWithStats,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get courses error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateCourseRequest =
      (await request.json()) as CreateCourseRequest;
    const {
      title,
      description,
      thumbnailUrl,
      category,
      difficultyLevel,
      instructorId,
    } = body;

    // Validation
    if (
      !title ||
      !description ||
      !category ||
      !difficultyLevel ||
      !instructorId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Verify instructor exists and has instructor role
    const instructor = await db.user.findFirst({
      where: {
        id: instructorId,
        role: "instructor",
      },
    });

    if (!instructor) {
      return NextResponse.json(
        { error: "Instructor not found or user is not an instructor" },
        { status: 400 },
      );
    }

    // Create course
    const course = await db.course.create({
      data: {
        title,
        description,
        thumbnailUrl: thumbnailUrl ?? "https://placekitten.com/400/300",
        category,
        difficultyLevel,
        instructorId,
      },
      select: {
        courseId: true,
        title: true,
        description: true,
        thumbnailUrl: true,
        category: true,
        difficultyLevel: true,
        instructorId: true,
        createdAt: true,
        updatedAt: true,
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Course created successfully",
        data: course,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create course error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

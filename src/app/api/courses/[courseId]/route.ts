import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const courseId = params.courseId;

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const course = await db.course.findUnique({
      where: { courseId },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            avatarUrl: true,
          },
        },
        lessons: {
          select: {
            lessonId: true,
            title: true,
            description: true,
            order: true,
            estimatedTime: true,
          },
          orderBy: { order: "asc" },
        },
        ratings: {
          select: {
            rating: true,
            review: true,
            student: {
              select: {
                firstName: true,
                lastName: true,
                username: true,
              },
            },
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 10, // Limit to 10 most recent reviews
        },
        assignments: {
          select: {
            assignmentId: true,
            title: true,
            description: true,
            dueDate: true,
            points: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
        prerequisites: {
          select: {
            prerequisite: {
              select: {
                courseId: true,
                title: true,
                description: true,
                thumbnailUrl: true,
                category: true,
                difficultyLevel: true,
              },
            },
          },
        },
        enrollments: {
          select: {
            studentId: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Calculate course statistics
    const totalLessons = course.lessons.length;
    const totalTime = course.lessons.reduce((acc, lesson) => acc + lesson.estimatedTime, 0);
    const averageRating = course.ratings.length > 0 
      ? course.ratings.reduce((acc, r) => acc + r.rating, 0) / course.ratings.length 
      : 0;
    const totalEnrollments = course.enrollments.length;
    const totalAssignments = course.assignments.length;

    // Format the response
    const courseDetail = {
      ...course,
      totalLessons,
      totalTime,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalRatings: course.ratings.length,
      totalEnrollments,
      totalAssignments,
      prerequisites: course.prerequisites.map(p => p.prerequisite),
    };

    return NextResponse.json({
      success: true,
      course: courseDetail,
    });
  } catch (error) {
    console.error("Error fetching course details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

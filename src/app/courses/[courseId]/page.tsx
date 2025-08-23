import CourseDetailContent from "./CourseDetailContent";
import { Suspense } from "react";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { notFound } from "next/navigation";

interface CourseDetailPageProps {
  params: Promise<{ courseId: string }>;
}

async function getCourseData(courseId: string) {
  try {
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
          take: 10,
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
      return null;
    }

    // Get completed lesson IDs for the current user (if authenticated)
    let completedLessonIds: string[] = [];
    let session = null;
    try {
      session = await auth();
      if (session?.user?.id) {
        const userEnrollment = await db.courseEnrollment.findUnique({
          where: {
            studentId_courseId: {
              studentId: session.user.id,
              courseId: courseId,
            },
          },
          include: {
            lessonCompletions: {
              select: {
                lessonId: true,
              },
            },
          },
        });

        if (userEnrollment) {
          completedLessonIds = userEnrollment.lessonCompletions.map(
            (lc) => lc.lessonId,
          );
        }
      }
    } catch (error) {
      console.error("Error fetching user enrollment:", error);
    }

    // Calculate course statistics
    const totalLessons = course.lessons.length;
    const totalTime = course.lessons.reduce(
      (acc, lesson) => acc + lesson.estimatedTime,
      0,
    );
    const averageRating =
      course.ratings.length > 0
        ? course.ratings.reduce((acc, r) => acc + r.rating, 0) /
          course.ratings.length
        : 0;
    const totalEnrollments = course.enrollments.length;
    const totalAssignments = course.assignments.length;

    // Check if current user is enrolled
    const isEnrolled =
      completedLessonIds.length > 0 ||
      course.enrollments.some(
        (enrollment) => enrollment.studentId === session?.user?.id,
      );

    // Create the course object with all required fields
    const courseWithStats = {
      ...course,
      ratings: course.ratings.map((rating) => ({
        ...rating,
        review: rating.review ?? undefined,
      })),
      totalLessons,
      totalTime,
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: course.ratings.length,
      totalEnrollments,
      totalAssignments,
      prerequisites: course.prerequisites.map((p) => p.prerequisite),
      completedLessonIds,
      isEnrolled,
    };

    return courseWithStats;
  } catch (error) {
    console.error("Error fetching course data:", error);
    return null;
  }
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  // Await params in Next.js 15
  const { courseId } = await params;
  const course = await getCourseData(courseId);

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </div>
        }
      >
        <CourseDetailContent course={course} />
      </Suspense>
    </div>
  );
}

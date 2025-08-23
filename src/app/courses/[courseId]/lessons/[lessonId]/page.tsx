import { notFound, redirect } from "next/navigation";

import LessonContent from "./LessonContent";
import { auth } from "@/server/auth";
import { db } from "@/server/db";

interface LessonPageProps {
  params: Promise<{ courseId: string; lessonId: string }>;
}

async function getLessonData(
  courseId: string,
  lessonId: string,
  userId?: string,
) {
  try {
    const lesson = await db.lesson.findUnique({
      where: { lessonId },
      include: {
        course: {
          select: {
            courseId: true,
            title: true,
            instructor: {
              select: {
                firstName: true,
                lastName: true,
                username: true,
              },
            },
            lessons: {
              select: {
                lessonId: true,
                title: true,
                order: true,
              },
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    if (!lesson || lesson.courseId !== courseId) {
      return null;
    }

    // Check if user is enrolled and has completed this lesson
    let isCompleted = false;
    if (userId) {
      const enrollment = await db.courseEnrollment.findFirst({
        where: {
          courseId,
          studentId: userId,
        },
        select: {
          enrollmentId: true,
        },
      });

      if (enrollment) {
        const lessonCompletion = await db.lessonCompletion.findUnique({
          where: {
            enrollmentId_lessonId: {
              enrollmentId: enrollment.enrollmentId,
              lessonId: lessonId,
            },
          },
        });
        isCompleted = !!lessonCompletion;
      }
    }

    // Find next lesson
    const currentLessonIndex = lesson.course.lessons.findIndex(
      (l) => l.lessonId === lessonId,
    );
    const nextLesson = lesson.course.lessons[currentLessonIndex + 1];

    return {
      lesson: {
        ...lesson,
        courseId: lesson.courseId,
      },
      isCompleted,
      nextLesson,
      totalLessons: lesson.course.lessons.length,
      currentLessonIndex: currentLessonIndex + 1,
    };
  } catch (error) {
    console.error("Error fetching lesson data:", error);
    return null;
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const session = await auth();

  // Redirect unauthenticated users to login
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Await params in Next.js 15
  const { courseId, lessonId } = await params;

  const lessonData = await getLessonData(courseId, lessonId, session.user.id);

  if (!lessonData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center space-x-2 text-sm text-gray-600">
          <a href={`/courses/${courseId}`} className="hover:text-blue-600">
            {lessonData.lesson.course.title}
          </a>
          <span>/</span>
          <span className="text-gray-900">
            Lesson {lessonData.lesson.order}
          </span>
        </nav>

        {/* Lesson Content */}
        <LessonContent lessonData={lessonData} />
      </div>
    </div>
  );
}

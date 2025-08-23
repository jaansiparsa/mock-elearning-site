import AssignmentDetailPage from "./AssignmentDetailPage";
import { Suspense } from "react";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { notFound } from "next/navigation";

interface AssignmentPageProps {
  params: Promise<{ assignmentId: string }>;
}

async function getAssignmentData(assignmentId: string) {
  try {
    const assignment = await db.assignment.findUnique({
      where: { assignmentId },
      include: {
        course: {
          select: {
            courseId: true,
            title: true,
            category: true,
            difficultyLevel: true,
          },
        },
        lesson: {
          select: {
            lessonId: true,
            title: true,
            order: true,
          },
        },
      },
    });

    if (!assignment) {
      return null;
    }

    // Get the current user's session
    const session = await auth();
    let userSubmissions = [];

    if (session?.user?.id) {
      // Get all user's submissions for this assignment (multiple submissions support)
      userSubmissions = await db.assignmentSubmission.findMany({
        where: {
          studentId: session.user.id,
          assignmentId: assignmentId,
        },
        orderBy: {
          submittedAt: "desc",
        },
      });
    }

    return {
      assignment,
      userSubmissions,
    };
  } catch (error) {
    console.error("Error fetching assignment data:", error);
    return null;
  }
}

export default async function AssignmentPage({ params }: AssignmentPageProps) {
  const { assignmentId } = await params;
  const data = await getAssignmentData(assignmentId);

  if (!data) {
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
        <AssignmentDetailPage
          assignment={data.assignment}
          userSubmissions={data.userSubmissions}
        />
      </Suspense>
    </div>
  );
}

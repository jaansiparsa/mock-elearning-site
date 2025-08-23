import type { Assignment, AssignmentSubmission } from "@/types";

import AssignmentDetailPage from "./AssignmentDetailPage";
import { Suspense } from "react";
import { notFound } from "next/navigation";

interface AssignmentPageProps {
  params: Promise<{ assignmentId: string }>;
}

interface AssignmentData {
  assignment: Assignment & {
    course: {
      courseId: string;
      title: string;
      category: string;
      difficultyLevel: string;
    };
    lesson?: {
      lessonId: string;
      title: string;
      order: number;
    } | null;
  };
  userSubmissions: AssignmentSubmission[];
}

async function getAssignmentData(
  assignmentId: string,
): Promise<AssignmentData | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/assignments/${assignmentId}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch assignment data: ${response.status}`);
    }

    const data = (await response.json()) as AssignmentData;
    return data;
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

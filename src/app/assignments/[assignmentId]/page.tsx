import { AssignmentDetails } from "./components/AssignmentDetails";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { notFound } from "next/navigation";

interface AssignmentDetailsPageProps {
  params: Promise<{
    assignmentId: string;
  }>;
}

export default async function AssignmentDetailsPage({
  params,
}: AssignmentDetailsPageProps) {
  const resolvedParams = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Please sign in to view assignment details
          </h1>
          <a href="/auth/signin" className="text-blue-600 hover:text-blue-700">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  // Fetch assignment details with all related data
  const assignment = await db.assignmentSubmission.findUnique({
    where: {
      submissionId: resolvedParams.assignmentId,
      studentId: session.user.id, // Ensure user can only see their own assignments
    },
    include: {
      assignment: {
        include: {
          course: true,
        },
      },
      student: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
        },
      },
    },
  });

  if (!assignment) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Assignment Details
              </h1>
              <p className="mt-2 text-gray-600">
                {assignment.assignment.title}
              </p>
            </div>
            <a
              href="/assignments"
              className="inline-flex items-center rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
            >
              ← Back to Assignments
            </a>
          </div>
        </div>

        {/* Assignment Details Component */}
        <AssignmentDetails assignment={assignment} />
      </div>
    </div>
  );
}

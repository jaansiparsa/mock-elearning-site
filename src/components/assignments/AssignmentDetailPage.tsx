"use client";

import type { Assignment, AssignmentSubmission } from "@/types";

import AssignmentDescription from "./AssignmentDescription";
import AssignmentHeader from "./AssignmentHeader";
import CourseNavigation from "./CourseNavigation";
import SubmissionForm from "./SubmissionForm";
import SubmissionStatus from "./SubmissionStatus";

interface AssignmentDetailPageProps {
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

export default function AssignmentDetailPage({
  assignment,
  userSubmissions,
}: AssignmentDetailPageProps) {
  // Get the latest submission for display
  const latestSubmission: AssignmentSubmission | null =
    userSubmissions.length > 0 ? (userSubmissions[0] ?? null) : null;

  const handleSubmit = async (content: string, file: File | null) => {
    if (!content.trim() && !file) return;

    try {
      // For now, we'll simulate file upload by creating a mock file URL
      // In a real implementation, you'd upload to a file storage service
      const fileUrl = file ? `https://example.com/uploads/${file.name}` : null;
      const fileName = file?.name ?? null;

      const response = await fetch("/api/assignments/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignmentId: assignment.assignmentId,
          submissionContent: content,
          fileUrl,
          fileName,
        }),
      });

      if (response.ok) {
        // Refresh the page to show updated submission
        window.location.reload();
      } else {
        console.error("Failed to submit assignment");
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      throw error;
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <AssignmentHeader assignment={assignment} />

      <AssignmentDescription
        description={assignment.description}
        rubricUrl={assignment.rubricUrl}
      />

      <SubmissionStatus
        latestSubmission={latestSubmission}
        userSubmissions={userSubmissions}
        assignmentPoints={assignment.points}
      />

      <SubmissionForm
        assignmentId={assignment.assignmentId}
        latestSubmission={latestSubmission}
        onSubmit={handleSubmit}
      />

      <CourseNavigation
        courseId={assignment.course.courseId}
        lesson={assignment.lesson}
      />
    </div>
  );
}

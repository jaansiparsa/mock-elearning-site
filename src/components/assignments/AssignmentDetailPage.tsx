"use client";

import type { Assignment, AssignmentSubmission } from "@/types";

import AssignmentDescription from "./AssignmentDescription";
import AssignmentHeader from "./AssignmentHeader";
import CourseNavigation from "./CourseNavigation";
import SubmissionForm from "./SubmissionForm";
import SubmissionStatus from "./SubmissionStatus";
import { useState } from "react";

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
  userSubmissions: initialUserSubmissions,
}: AssignmentDetailPageProps) {
  // Local state for submissions
  const [userSubmissions, setUserSubmissions] = useState<
    AssignmentSubmission[]
  >(initialUserSubmissions);

  // Get the latest submission for display
  const latestSubmission: AssignmentSubmission | null =
    userSubmissions.length > 0 ? (userSubmissions[0] ?? null) : null;

  // Debug logging
  console.log("AssignmentDetailPage props:", {
    assignmentId: assignment.assignmentId,
    userSubmissionsCount: userSubmissions.length,
    userSubmissions,
    latestSubmission,
  });

  const handleSubmit = async (content: string, file: File | null) => {
    console.log("Submitting assignment:", { content, file: file?.name });

    if (!content.trim() && !file) {
      console.log("No content or file provided");
      return;
    }

    try {
      // For now, we'll simulate file upload by creating a mock file URL
      // In a real implementation, you'd upload to a file storage service
      const fileUrl = file ? `https://example.com/uploads/${file.name}` : null;
      const fileName = file?.name ?? null;

      const submissionData = {
        assignmentId: assignment.assignmentId,
        submissionContent: content.trim() || null,
        fileUrl,
        fileName,
      };

      console.log("Submitting data:", submissionData);

      const response = await fetch("/api/assignments/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const result = (await response.json()) as {
          message: string;
          data: AssignmentSubmission;
        };
        console.log("Submission successful:", result);

        // Add the new submission to local state
        const newSubmission = result.data;
        console.log("Adding new submission to state:", newSubmission);

        setUserSubmissions((prev) => {
          const updated = [newSubmission, ...prev];
          console.log("Updated submissions state:", updated);
          return updated;
        });

        // Show success message
        alert(
          "Assignment submitted successfully! Your submission is now visible above.",
        );
      } else {
        const errorData = (await response.json()) as { error: string };
        console.error("Failed to submit assignment:", errorData);
        alert(
          `Failed to submit assignment: ${errorData.error ?? "Unknown error"}`,
        );
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert(
        `Error submitting assignment: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
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

"use client";

import type { Assignment, AssignmentSubmission } from "@/types";

import Link from "next/link";
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
  userSubmissions,
}: AssignmentDetailPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionContent, setSubmissionContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Get the latest submission for display
  const latestSubmission =
    userSubmissions.length > 0 ? userSubmissions[0] : null;

  const handleSubmit = async () => {
    if (!submissionContent.trim() && !selectedFile) return;

    setIsSubmitting(true);
    try {
      // For now, we'll simulate file upload by creating a mock file URL
      // In a real implementation, you'd upload to a file storage service
      const fileUrl = selectedFile
        ? `https://example.com/uploads/${selectedFile.name}`
        : null;
      const fileName = selectedFile?.name ?? null;

      const response = await fetch("/api/assignments/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignmentId: assignment.assignmentId,
          submissionContent,
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      not_started: "bg-gray-100 text-gray-800",
      in_progress: "bg-yellow-100 text-yellow-800",
      completed: "bg-blue-100 text-blue-800",
      graded: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800",
    };
    return (
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.not_started
    );
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      not_started: "Not Started",
      in_progress: "In Progress",
      completed: "Completed",
      graded: "Graded",
      overdue: "Overdue",
    };
    return statusMap[status as keyof typeof statusMap] || "Unknown";
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <Link
                href="/assignments"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back to Assignments
              </Link>
            </div>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              {assignment.title}
            </h1>
            <p className="mt-2 text-gray-600">
              Course: {assignment.course.title}
              {assignment.lesson &&
                ` • Lesson ${assignment.lesson.order}: ${assignment.lesson.title}`}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {assignment.points} pts
            </div>
            <div className="text-sm text-gray-500">
              {assignment.course.category} • {assignment.course.difficultyLevel}
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Details */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Assignment Description
        </h2>
        <div className="prose max-w-none">
          <p className="text-gray-700">{assignment.description}</p>
        </div>

        {assignment.rubricUrl && (
          <div className="mt-4">
            <a
              href={assignment.rubricUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              View Rubric
            </a>
          </div>
        )}
      </div>

      {/* Submission Status */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Submission Status
        </h2>

        {latestSubmission ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusBadge(latestSubmission.status)}`}
                >
                  {getStatusText(latestSubmission.status)}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  Due: {new Date(latestSubmission.dueDate).toLocaleDateString()}
                </div>
                {latestSubmission.grade && (
                  <div className="text-lg font-semibold text-green-600">
                    Grade: {latestSubmission.grade}/{assignment.points}
                  </div>
                )}
              </div>
            </div>

            {latestSubmission.submissionContent && (
              <div className="rounded-lg bg-blue-50 p-4">
                <h3 className="mb-2 font-medium text-gray-900">
                  Your Submission Notes
                </h3>
                <p className="text-gray-700">
                  {latestSubmission.submissionContent}
                </p>
              </div>
            )}

            {latestSubmission.fileUrl && (
              <div className="rounded-lg bg-green-50 p-4">
                <h3 className="mb-2 font-medium text-gray-900">
                  Submitted File
                </h3>
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-5 w-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 01-2-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <a
                    href={latestSubmission.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:text-blue-700"
                  >
                    {latestSubmission.fileName ?? "Download File"}
                  </a>
                </div>
              </div>
            )}

            {latestSubmission.feedback && (
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 font-medium text-gray-900">
                  Instructor Feedback
                </h3>
                <p className="text-gray-700">{latestSubmission.feedback}</p>
              </div>
            )}

            {latestSubmission.startedAt && (
              <div className="text-sm text-gray-500">
                Started: {new Date(latestSubmission.startedAt).toLocaleString()}
              </div>
            )}

            {latestSubmission.endedAt && (
              <div className="text-sm text-gray-500">
                Submitted: {new Date(latestSubmission.endedAt).toLocaleString()}
              </div>
            )}

            {/* Show submission history if there are multiple submissions */}
            {userSubmissions.length > 1 && (
              <div className="rounded-lg bg-yellow-50 p-4">
                <h3 className="mb-2 font-medium text-gray-900">
                  Submission History
                </h3>
                <p className="mb-3 text-sm text-gray-600">
                  You have made {userSubmissions.length} submissions for this
                  assignment.
                </p>
                <div className="space-y-2">
                  {userSubmissions.map((submission, index) => (
                    <div
                      key={submission.submissionId}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-700">
                        Submission {userSubmissions.length - index} -{" "}
                        {new Date(
                          submission.submittedAt ??
                            submission.endedAt ??
                            submission.assignedAt,
                        ).toLocaleDateString()}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${getStatusBadge(submission.status)}`}
                      >
                        {getStatusText(submission.status)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            No submission found. You can submit your work below.
          </div>
        )}
      </div>

      {/* Submission Form - Always show for multiple submissions support */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Submit Your Work
          </h2>
          {latestSubmission && (
            <span className="text-sm text-gray-500">
              This will create a new submission
            </span>
          )}
        </div>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="submission-content"
              className="block text-sm font-medium text-gray-700"
            >
              Additional Notes (Optional)
            </label>
            <textarea
              id="submission-content"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Add any additional notes or comments about your submission..."
              value={submissionContent}
              onChange={(e) => setSubmissionContent(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload File
            </label>
            <div
              className={`mt-1 flex justify-center rounded-md border-2 border-dashed p-6 ${
                dragActive
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-2 text-center">
                {selectedFile ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg
                      className="h-8 w-8 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm text-gray-900">
                      {selectedFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-blue-600 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:outline-none hover:text-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileInput}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX, TXT, or image files up to 10MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={
                isSubmitting || (!submissionContent.trim() && !selectedFile)
              }
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? "Submitting..."
                : latestSubmission
                  ? "Submit New Version"
                  : "Submit Assignment"}
            </button>
          </div>
        </div>
      </div>

      {/* Course Navigation */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Course Navigation
        </h2>
        <div className="flex space-x-4">
          <Link
            href={`/courses/${assignment.course.courseId}`}
            className="inline-flex items-center rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            ← Back to Course
          </Link>
          {assignment.lesson && (
            <Link
              href={`/courses/${assignment.course.courseId}/lessons/${assignment.lesson.lessonId}`}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              View Lesson
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

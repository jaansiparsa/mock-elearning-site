import type { AssignmentSubmission } from "@/types";

interface SubmissionStatusProps {
  latestSubmission: AssignmentSubmission | null;
  userSubmissions: AssignmentSubmission[];
  assignmentPoints: number;
}

export default function SubmissionStatus({
  latestSubmission,
  userSubmissions,
  assignmentPoints,
}: SubmissionStatusProps) {
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
                  Grade: {latestSubmission.grade}/{assignmentPoints}
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
              <h3 className="mb-2 font-medium text-gray-900">Submitted File</h3>
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
  );
}

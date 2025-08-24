interface AssignmentDescriptionProps {
  description: string;
  rubricUrl?: string | null;
}

export default function AssignmentDescription({
  description,
  rubricUrl,
}: AssignmentDescriptionProps) {
  return (
    <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Assignment Description
      </h2>
      <div className="prose max-w-none">
        <p className="text-gray-700">{description}</p>
      </div>

      {rubricUrl && (
        <div className="mt-4">
          <a
            href={rubricUrl}
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
  );
}

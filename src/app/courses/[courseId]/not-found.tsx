import Link from "next/link";

export default function CourseNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6 text-6xl">📚</div>
        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          Course Not Found
        </h1>
        <p className="mb-8 text-lg text-gray-600 max-w-md mx-auto">
          The course you're looking for doesn't exist or may have been removed.
        </p>
        <div className="space-x-4">
          <Link
            href="/explore"
            className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Browse Courses
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-lg border border-gray-300 px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

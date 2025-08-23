import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { auth } from "@/server/auth";

interface AnalyticsPageProps {
  searchParams: Promise<{
    period?: string;
  }>;
}

export default async function AnalyticsPage({
  searchParams,
}: AnalyticsPageProps) {
  const resolvedSearchParams = await searchParams;
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Please sign in to view analytics
          </h1>
          <a href="/auth/signin" className="text-blue-600 hover:text-blue-700">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Learning Analytics
          </h1>
          <p className="mt-2 text-gray-600">
            Track your learning progress, study habits, and achievements
          </p>
        </div>

        {/* Analytics Dashboard */}
        <AnalyticsDashboard
          userId={session.user.id}
          period={resolvedSearchParams.period || "week"}
        />
      </div>
    </div>
  );
}

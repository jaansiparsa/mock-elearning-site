import { AnalyticsSkeleton, ProgressAnalytics } from "@/components/analytics";

import { Suspense } from "react";
import { auth } from "@/server/auth";
import { notFound } from "next/navigation";

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header loads immediately */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Learning Analytics
          </h1>
          <p className="mt-2 text-gray-600">
            Track your learning progress, study habits, and achievements
          </p>
        </div>
      </div>

      {/* Content with skeleton loading */}
      <Suspense fallback={<AnalyticsSkeleton />}>
        <ProgressAnalytics userId={session.user.id} />
      </Suspense>
    </div>
  );
}

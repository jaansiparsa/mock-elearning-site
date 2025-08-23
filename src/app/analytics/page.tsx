import ProgressAnalytics from "./ProgressAnalytics";
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
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </div>
        }
      >
        <ProgressAnalytics userId={session.user.id} />
      </Suspense>
    </div>
  );
}

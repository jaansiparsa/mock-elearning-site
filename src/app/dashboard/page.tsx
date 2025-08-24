import InstructorDashboard from "@/components/dashboard/InstructorDashboard";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import { Suspense } from "react";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    // Redirect to signin if not authenticated
    redirect("/auth/signin");
  }

  const { user } = session;
  const userRole = user.role;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Course Dashboard
        </h1>
        <p className="text-gray-600">
          {userRole === "instructor"
            ? "Manage your courses and track student progress"
            : "Track your learning progress and enrolled courses"}
        </p>
        <div className="mt-2 text-sm text-gray-500">
          Welcome back, {user.name ?? user.email}!
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </div>
        }
      >
        {userRole === "instructor" ? (
          <InstructorDashboard userId={user.id} />
        ) : (
          <StudentDashboard userId={user.id} />
        )}
      </Suspense>
    </div>
  );
}

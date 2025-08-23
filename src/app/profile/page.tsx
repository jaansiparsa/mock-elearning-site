import AccountSettings from "./AccountSettings";
import LearningPreferences from "./LearningPreferences";
import ProfileForm from "./ProfileForm";
import { ProfileUser } from "./types";
import { Suspense } from "react";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  // Fetch complete user data from database
  const user: ProfileUser | null = await db.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      username: true,
      avatarUrl: true,
      role: true,
      notificationPreference: true,
      preferredStudyTime: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your profile information, learning preferences, and account
            settings.
          </p>
        </div>

        <div className="space-y-8">
          {/* Profile Form */}
          <Suspense
            fallback={
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="h-8 w-32 animate-pulse rounded bg-gray-200"></div>
              </div>
            }
          >
            <ProfileForm user={user} />
          </Suspense>

          {/* Learning Preferences */}
          <Suspense
            fallback={
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="h-8 w-32 animate-pulse rounded bg-gray-200"></div>
              </div>
            }
          >
            <LearningPreferences user={user} />
          </Suspense>

          {/* Account Settings */}
          <Suspense
            fallback={
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="h-8 w-32 animate-pulse rounded bg-gray-200"></div>
              </div>
            }
          >
            <AccountSettings user={user} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

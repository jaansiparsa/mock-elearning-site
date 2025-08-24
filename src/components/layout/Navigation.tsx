import Link from "next/link";
import { auth } from "@/server/auth";

export default async function Navigation() {
  const session = await auth();

  return (
    <nav className="bg-background-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              skillEd
            </Link>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden space-x-8 md:flex">
            <Link
              href="/explore"
              className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
            >
              Explore
            </Link>

            {session && (
              <>
                <Link
                  href="/dashboard"
                  className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
                >
                  Dashboard
                </Link>
                <Link
                  href="/assignments"
                  className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
                >
                  Assignments
                </Link>
                <Link
                  href="/analytics"
                  className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
                >
                  Analytics
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link
                  href="/profile"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Profile
                </Link>
                <Link
                  href="/api/auth/signout"
                  className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
                >
                  Sign out
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

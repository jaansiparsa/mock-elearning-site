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
            <Link href="/" className="text-brex-orange text-2xl font-bold">
              Brex-MVP
            </Link>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden space-x-8 md:flex">
            <Link
              href="/posts"
              className="hover:text-brex-orange px-3 py-2 text-sm font-medium text-gray-700 transition-colors"
            >
              Posts
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link
                  href="/profile"
                  className="bg-brex-orange hover:bg-brex-orange rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
                >
                  Profile
                </Link>
                <Link
                  href="/api/auth/signout"
                  className="hover:text-brex-orange text-sm font-medium text-gray-700 transition-colors"
                >
                  Sign out
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="hover:text-brex-orange text-sm font-medium text-gray-700 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-brex-orange hover:bg-brex-orange rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
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

import Link from "next/link";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="bg-background-white min-h-screen">
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-brex-orange rounded-lg border-4 border-dashed p-8">
            <div className="text-center">
              <h1 className="mb-4 text-3xl font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="mb-8 text-lg text-gray-600">
                Welcome to your dashboard,{" "}
                {session.user.name ?? session.user.email}!
              </p>

              <div className="border-primary-black bg-background-white mx-auto max-w-md rounded-lg border p-6 shadow">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Account Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>
                    <span className="ml-2 text-gray-900">
                      {session.user.name ?? "Not provided"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="ml-2 text-gray-900">
                      {session.user.email}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">User ID:</span>
                    <span className="ml-2 text-gray-900">
                      {session.user.id}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center space-x-4">
                <Link
                  href="/"
                  className="bg-brex-orange hover:bg-brex-orange rounded-md px-4 py-2 text-white transition-colors"
                >
                  Back to Home
                </Link>
                <Link
                  href="/api/auth/signout"
                  className="rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
                >
                  Sign Out
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

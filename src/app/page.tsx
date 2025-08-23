import { HydrateClient } from "@/trpc/server";
import { auth } from "@/server/auth";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className="flex flex-col items-center justify-center px-4 py-16">
        <div className="container flex flex-col items-center justify-center gap-12">
          <h1 className="text-center text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Welcome to <span className="text-brex-orange">Brex-MVP</span>
          </h1>

          <div className="flex flex-col items-center justify-center gap-4">
            {session ? (
              <>
                <p className="text-center text-2xl text-gray-700">
                  Welcome back, {session.user?.name ?? session.user?.email}!
                </p>
                <p className="max-w-2xl text-center text-lg text-gray-600">
                  Yayy super excited to get started!
                </p>
              </>
            ) : (
              <>
                <p className="text-center text-xl text-gray-600">
                  Sign in to access your account
                </p>
                <p className="max-w-2xl text-center text-lg text-gray-600">
                  Join our community and start exploring the platform.
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}

import Link from "next/link";
import PostsList from "./PostsList";
import React from "react";
import { auth } from "@/server/auth";

export default async function PostsPage() {
  const session = await auth();
  const isWriter = session?.user?.role === "WRITER";

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-brex-orange text-3xl font-bold">All Posts</h1>
        {isWriter && (
          <Link
            href="/posts/new"
            className="bg-brex-orange hover:bg-brex-orange rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            Add New Post
          </Link>
        )}
      </div>
      <PostsList />
    </main>
  );
}

"use client";

import React, { useEffect, useState } from "react";

interface PostWithUser {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name?: string | null;
    email?: string | null;
  } | null;
}

type GetPostsResponse = {
  success: boolean;
  posts?: PostWithUser[];
  error?: string;
};

function isGetPostsResponse(data: unknown): data is GetPostsResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "success" in data &&
    typeof (data as { success: unknown }).success === "boolean"
  );
}

export default function PostsList() {
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/get-posts")
      .then(async (res) => {
        const data = (await res.json()) as unknown;
        if (!res.ok || !isGetPostsResponse(data) || !data.success) {
          throw new Error(
            (isGetPostsResponse(data) ? data.error : undefined) ??
              "Failed to fetch posts",
          );
        }
        setPosts(data.posts ?? []);
      })
      .catch((err) =>
        setErrorMsg((err as Error)?.message ?? "Failed to load posts."),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-gray-600">Loading posts...</div>;
  }

  if (errorMsg) {
    return (
      <div className="rounded bg-red-100 p-4 text-red-700">{errorMsg}</div>
    );
  }

  if (posts.length === 0) {
    return <div className="text-gray-600">No posts found.</div>;
  }

  return (
    <ul className="space-y-4">
      {posts.map((post) => (
        <li
          key={post.id}
          className="border-brex-orange bg-background-white rounded-lg border p-4 shadow"
        >
          <div className="flex items-center justify-between">
            <span className="text-primary-black text-lg font-semibold">
              {post.name}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-700">
            By: {post.createdBy?.name ?? post.createdBy?.email ?? "Unknown"}
          </div>
        </li>
      ))}
    </ul>
  );
}

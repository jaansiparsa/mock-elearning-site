"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  // Check if user is authorized (has WRITER role)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/get-posts");
        if (!response.ok) {
          const data = (await response.json()) as unknown;
          const errorMsg =
            typeof data === "object" &&
            data !== null &&
            "error" in data &&
            typeof (data as { error?: unknown }).error === "string"
              ? (data as { error: string }).error
              : undefined;

          if (errorMsg?.includes("Unauthorized")) {
            setIsAuthorized(false);
            return;
          }
        }
        // If we can fetch posts, check if we have WRITER role by trying to create a post
        const testResponse = await fetch("/api/add-post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "test" }),
        });

        if (testResponse.status === 401 || testResponse.status === 403) {
          setIsAuthorized(false);
        } else {
          setIsAuthorized(true);
        }
      } catch (err) {
        setIsAuthorized(false);
      }
    };

    void checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/add-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = (await response.json()) as unknown;
      const errorMsg =
        typeof data === "object" &&
        data !== null &&
        "error" in data &&
        typeof (data as { error?: unknown }).error === "string"
          ? (data as { error: string }).error
          : undefined;

      if (!response.ok) {
        throw new Error(errorMsg ?? "Failed to create post");
      }

      // Redirect to posts page on success
      router.push("/posts");
    } catch (err) {
      setError((err as Error).message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking authorization
  if (isAuthorized === null) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="text-center">Loading...</div>
      </main>
    );
  }

  // Show unauthorized message if user doesn't have WRITER role
  if (isAuthorized === false) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="text-center">
          <h1 className="text-brex-orange mb-4 text-3xl font-bold">
            Access Denied
          </h1>
          <p className="mb-4 text-gray-600">
            You need WRITER permissions to create new posts.
          </p>
          <Link
            href="/posts"
            className="bg-brex-orange hover:bg-brex-orange rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            Back to Posts
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-brex-orange text-3xl font-bold">Add New Post</h1>
        <Link
          href="/posts"
          className="text-brex-orange hover:text-brex-orange text-sm font-medium transition-colors"
        >
          ← Back to Posts
        </Link>
      </div>

      <div className="bg-background-white rounded-lg border border-gray-200 p-6 shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="text-primary-black block text-sm font-medium"
            >
              Post Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="focus:border-brex-orange focus:ring-brex-orange mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none"
              placeholder="Enter post name"
              required
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div className="rounded bg-red-100 p-4 text-red-700">{error}</div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="bg-brex-orange hover:bg-brex-orange rounded-md px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Post"}
            </button>
            <Link
              href="/posts"
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

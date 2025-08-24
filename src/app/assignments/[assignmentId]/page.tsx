"use client";

import type { Assignment, AssignmentSubmission } from "@/types";
import { useEffect, useState } from "react";

import { AssignmentDetailPage } from "@/components/assignments";
import { notFound } from "next/navigation";

interface AssignmentPageProps {
  params: Promise<{ assignmentId: string }>;
}

interface AssignmentData {
  assignment: Assignment & {
    course: {
      courseId: string;
      title: string;
      category: string;
      difficultyLevel: string;
    };
    lesson?: {
      lessonId: string;
      title: string;
      order: number;
    } | null;
  };
  userSubmissions: AssignmentSubmission[];
}

export default function AssignmentPage({ params }: AssignmentPageProps) {
  const [assignmentId, setAssignmentId] = useState<string>("");
  const [data, setData] = useState<AssignmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAssignmentData() {
      try {
        const { assignmentId: id } = await params;
        setAssignmentId(id);

        // Fetch assignment data with session cookies included
        const response = await fetch(`/api/assignments/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Assignment not found");
            return;
          }
          throw new Error(
            `Failed to fetch assignment data: ${response.status}`,
          );
        }

        const assignmentData = (await response.json()) as AssignmentData;
        setData(assignmentData);
      } catch (err) {
        console.error("Error loading assignment data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load assignment",
        );
      } finally {
        setLoading(false);
      }
    }

    loadAssignmentData();
  }, [params]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !data) {
    if (error === "Assignment not found") {
      // Handle 404 case
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="mb-2 text-xl font-semibold text-gray-900">
              Assignment Not Found
            </h1>
            <p className="text-gray-600">
              The assignment you&apos;re looking for doesn&apos;t exist.
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="mb-2 text-xl font-semibold text-gray-900">
            Error Loading Assignment
          </h1>
          <p className="text-gray-600">
            {error ?? "Failed to load assignment data"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AssignmentDetailPage
        assignment={data.assignment}
        userSubmissions={data.userSubmissions}
      />
    </div>
  );
}

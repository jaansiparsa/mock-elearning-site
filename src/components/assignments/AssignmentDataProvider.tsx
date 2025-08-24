"use client";

import { AssignmentList, AssignmentOverview } from "@/components/assignments";
import { useEffect, useState } from "react";

interface Assignment {
  id: string;
  type: "assignment" | "quiz";
  assignmentId: string;
  submissionId: string | null;
  title: string;
  description: string;
  dueDate: Date;
  points: number;
  status: "not_started" | "in_progress" | "completed" | "graded" | "overdue";
  courseTitle: string;
  courseId: string;
  lessonTitle?: string;
  lessonId?: string;
  grade?: number;
  feedback?: string;
  assignedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  isOverdue: boolean;
  isDueToday: boolean;
  isDueThisWeek: boolean;
}

interface Course {
  courseId: string;
  title: string;
}

interface Overview {
  total: number;
  completed: number;
  overdue: number;
  upcoming: number;
}

interface ApiResponse {
  assignments: Array<{
    id: string;
    type: "assignment" | "quiz";
    assignmentId: string;
    submissionId: string | null;
    title: string;
    description: string;
    dueDate: string;
    points: number;
    status: "not_started" | "in_progress" | "completed" | "graded" | "overdue";
    courseTitle: string;
    courseId: string;
    lessonTitle?: string;
    lessonId?: string;
    grade?: number;
    feedback?: string;
    assignedAt: string;
    startedAt?: string | null;
    completedAt?: string | null;
    isOverdue: boolean;
    isDueToday: boolean;
    isDueThisWeek: boolean;
  }>;
  courses: Course[];
  overview: Overview;
}

interface AssignmentDataProviderProps {
  searchParams: {
    sort?: string;
    status?: string;
    course?: string;
  };
}

export default function AssignmentDataProvider({
  searchParams,
}: AssignmentDataProviderProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [overview, setOverview] = useState<Overview>({
    total: 0,
    completed: 0,
    overdue: 0,
    upcoming: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchAssignments();
  }, [searchParams.sort, searchParams.status, searchParams.course]);

  async function fetchAssignments() {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchParams.sort) params.append("sort", searchParams.sort);
      if (searchParams.status) params.append("status", searchParams.status);
      if (searchParams.course) params.append("course", searchParams.course);

      const response = await fetch(`/api/assignments?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch assignments");
      }

      const data = (await response.json()) as ApiResponse;

      // Convert date strings back to Date objects
      const processedAssignments: Assignment[] = data.assignments.map(
        (assignment) => ({
          ...assignment,
          dueDate: new Date(assignment.dueDate),
          assignedAt: new Date(assignment.assignedAt),
          startedAt: assignment.startedAt
            ? new Date(assignment.startedAt)
            : undefined,
          completedAt: assignment.completedAt
            ? new Date(assignment.completedAt)
            : undefined,
        }),
      );

      setAssignments(processedAssignments);
      setCourses(data.courses);
      setOverview(data.overview);
    } catch (err) {
      console.error("Error fetching assignments:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch assignments",
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-32 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-96 animate-pulse rounded-lg bg-gray-200" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center">
        <h3 className="text-lg font-medium text-red-800">
          Error Loading Assignments
        </h3>
        <p className="mt-2 text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AssignmentOverview overview={overview} assignments={assignments} />
      <AssignmentList
        assignments={assignments}
        courses={courses}
        currentSort={searchParams.sort ?? "dueDate"}
        currentStatus={searchParams.status ?? "all"}
        currentCourse={searchParams.course ?? "all"}
      />
    </div>
  );
}

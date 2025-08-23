"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  Clock,
  FileText,
  Target,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

interface Assignment {
  assignmentId: string;
  givenAssignmentId: string;
  title: string;
  description: string;
  dueDate: Date;
  points: number;
  status: "not_started" | "in_progress" | "submitted" | "graded";
  courseTitle: string;
  courseId: string;
  lessonTitle?: string;
  lessonId?: string;
  grade?: number;
  feedback?: string;
  notes?: string;
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

interface AssignmentListProps {
  assignments: Assignment[];
  courses: Course[];
  currentSort: string;
  currentStatus: string;
  currentCourse: string;
}

function getStatusBadge(status: Assignment["status"]) {
  const statusConfig = {
    not_started: {
      label: "Not Started",
      className: "bg-gray-100 text-gray-800",
    },
    in_progress: {
      label: "In Progress",
      className: "bg-blue-100 text-blue-800",
    },
    submitted: {
      label: "Submitted",
      className: "bg-yellow-100 text-yellow-800",
    },
    graded: {
      label: "Graded",
      className: "bg-green-100 text-green-800",
    },
  };

  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function getDueDateHighlight(assignment: Assignment) {
  if (assignment.isOverdue) {
    return "text-red-600 font-semibold";
  }
  if (assignment.isDueToday) {
    return "text-orange-600 font-semibold";
  }
  if (assignment.isDueThisWeek) {
    return "text-yellow-600 font-semibold";
  }
  return "text-gray-900";
}

function formatDueDate(date: Date) {
  const now = new Date();
  const dueDate = new Date(date);
  const diffTime = dueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? "s" : ""} overdue`;
  } else if (diffDays === 0) {
    return "Due today";
  } else if (diffDays === 1) {
    return "Due tomorrow";
  } else if (diffDays <= 7) {
    return `Due in ${diffDays} days`;
  } else {
    return dueDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
}

export default function AssignmentList({
  assignments,
  courses,
  currentSort,
  currentStatus,
  currentCourse,
}: AssignmentListProps) {
  const [sortBy, setSortBy] = useState(currentSort);
  const [statusFilter, setStatusFilter] = useState(currentStatus);
  const [courseFilter, setCourseFilter] = useState(currentCourse);
  const router = useRouter();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isSorting, setIsSorting] = useState(false);

  // Update local state when props change
  useEffect(() => {
    setSortBy(currentSort);
    setSortDirection("asc"); // Reset to ascending when sort column changes
  }, [currentSort]);

  // Sort assignments based on current sort column and direction
  const sortedAssignments = [...assignments].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "course":
        comparison = a.courseTitle.localeCompare(b.courseTitle);
        break;
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
      case "dueDate":
        comparison = a.dueDate.getTime() - b.dueDate.getTime();
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
      case "points":
        comparison = a.points - b.points;
        break;
      default:
        return 0;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const handleSort = (column: string) => {
    setIsSorting(true);

    // Use setTimeout to simulate sorting and provide visual feedback
    setTimeout(() => {
      if (sortBy === column) {
        // Toggle direction if clicking the same column
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        // New column, reset to ascending
        setSortBy(column);
        setSortDirection("asc");
      }

      const url = new URL(window.location.href);
      url.searchParams.set("sort", column);
      window.history.pushState({}, "", url.toString());

      setIsSorting(false);
    }, 100);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    const url = new URL(window.location.href);
    if (status === "all") {
      url.searchParams.delete("status");
    } else {
      url.searchParams.set("status", status);
    }
    window.history.pushState({}, "", url.toString());
  };

  const handleCourseFilter = (courseId: string) => {
    setCourseFilter(courseId);
    const url = new URL(window.location.href);
    if (courseId === "all") {
      url.searchParams.delete("course");
    } else {
      url.searchParams.set("course", courseId);
    }
    window.history.pushState({}, "", url.toString());
  };

  const handleAssignmentClick = (assignment: Assignment) => {
    router.push(`/assignments/${assignment.givenAssignmentId}`);
  };

  const SortableHeader = ({
    column,
    label,
  }: {
    column: string;
    label: string;
  }) => {
    const isActive = sortBy === column;

    return (
      <button
        onClick={() => handleSort(column)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleSort(column);
          }
        }}
        title={`Sort by ${label} ${isActive ? (sortDirection === "asc" ? "descending" : "ascending") : "ascending"}`}
        aria-label={`Sort by ${label} ${isActive ? (sortDirection === "asc" ? "descending" : "ascending") : "ascending"}`}
        className={`group inline-flex items-center rounded font-medium hover:text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
          isActive ? "text-blue-600" : "text-gray-900"
        }`}
      >
        {label}
        {isSorting && sortBy === column ? (
          <div className="ml-1 h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        ) : isActive ? (
          sortDirection === "asc" ? (
            <ArrowUp className="ml-1 h-4 w-4 text-blue-600" />
          ) : (
            <ArrowDown className="ml-1 h-4 w-4 text-blue-600" />
          )
        ) : (
          <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400 group-hover:text-blue-600" />
        )}
      </button>
    );
  };

  if (assignments.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow-sm">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No assignments found
        </h3>
        <p className="mt-2 text-gray-600">
          {statusFilter !== "all" || courseFilter !== "all"
            ? "Try adjusting your filters to see more assignments."
            : "You don't have any assignments yet."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-3">
            {/* Status Filter */}
            <div>
              <label htmlFor="status-filter" className="sr-only">
                Filter by status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="submitted">Submitted</option>
                <option value="graded">Graded</option>
              </select>
            </div>

            {/* Course Filter */}
            <div>
              <label htmlFor="course-filter" className="sr-only">
                Filter by course
              </label>
              <select
                id="course-filter"
                value={courseFilter}
                onChange={(e) => handleCourseFilter(e.target.value)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="all">All Courses</option>
                {courses.map((course) => (
                  <option key={course.courseId} value={course.courseId}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              {sortedAssignments.length} assignment
              {sortedAssignments.length !== 1 ? "s" : ""} found
            </div>
            {sortBy !== "dueDate" && (
              <button
                onClick={() => {
                  setSortBy("dueDate");
                  setSortDirection("asc");
                  const url = new URL(window.location.href);
                  url.searchParams.set("sort", "dueDate");
                  window.history.pushState({}, "", url.toString());
                }}
                className="text-xs text-blue-600 underline hover:text-blue-700"
                title="Reset to default sort (Due Date)"
              >
                Reset Sort
              </button>
            )}
          </div>
        </div>

        {/* Assignments Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    <SortableHeader column="course" label="Course" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    <SortableHeader column="title" label="Assignment" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    <SortableHeader column="dueDate" label="Due Date" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    <SortableHeader column="status" label="Status" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    <SortableHeader column="points" label="Points" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {sortedAssignments.map((assignment) => (
                  <tr
                    key={assignment.assignmentId}
                    className="cursor-pointer border-l-4 border-l-transparent transition-all duration-200 hover:border-l-blue-500 hover:bg-blue-50 hover:shadow-sm"
                    onClick={() => handleAssignmentClick(assignment)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleAssignmentClick(assignment);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${assignment.title}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {assignment.courseTitle}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm font-medium text-gray-900">
                          {assignment.title}
                        </div>
                        <div className="line-clamp-2 text-sm text-gray-500">
                          {assignment.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                        <span
                          className={`text-sm ${getDueDateHighlight(assignment)}`}
                        >
                          {formatDueDate(assignment.dueDate)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(assignment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {assignment.grade !== null &&
                        assignment.grade !== undefined ? (
                          <div className="flex items-center">
                            <span className="font-medium text-green-600">
                              {assignment.grade}/{assignment.points}
                            </span>
                            <span className="ml-2 text-xs text-gray-500">
                              (
                              {Math.round(
                                (assignment.grade / assignment.points) * 100,
                              )}
                              %)
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-600">
                            {assignment.points} pts
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Helpful Hint */}
      <div className="text-center text-sm text-gray-500">
        💡 Click on any assignment row to view full details
      </div>
    </>
  );
}

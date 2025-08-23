"use client";

import {
  Award,
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Target,
  User,
} from "lucide-react";

interface AssignmentDetailsProps {
  assignment: any; // Using any for now to avoid complex Prisma types
}

function getStatusBadge(status: string) {
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

  const config =
    statusConfig[status as keyof typeof statusConfig] ||
    statusConfig.not_started;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AssignmentDetails({ assignment }: AssignmentDetailsProps) {
  const isOverdue =
    new Date() > new Date(assignment.dueDate) && assignment.status !== "graded";
  const isDueToday =
    new Date().toDateString() === new Date(assignment.dueDate).toDateString();

  return (
    <div className="space-y-6">
      {/* Assignment Overview Card */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {assignment.assignment.title}
          </h2>
          <p className="mt-2 text-gray-600">
            {assignment.assignment.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Status */}
          <div className="flex items-center">
            <Target className="mr-2 h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <div className="mt-1">{getStatusBadge(assignment.status)}</div>
            </div>
          </div>

          {/* Points */}
          <div className="flex items-center">
            <Award className="mr-2 h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Points</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {assignment.assignment.points}
              </p>
            </div>
          </div>

          {/* Due Date */}
          <div className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Due Date</p>
              <p
                className={`mt-1 text-sm ${isOverdue ? "font-semibold text-red-600" : isDueToday ? "font-semibold text-orange-600" : "text-gray-900"}`}
              >
                {formatDate(assignment.dueDate)}
              </p>
            </div>
          </div>

          {/* Assigned Date */}
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Assigned</p>
              <p className="mt-1 text-sm text-gray-900">
                {formatDate(assignment.assignedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Course and Lesson Information */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Course Information */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Course Information
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Course Name</p>
              <p className="text-gray-900">{assignment.course.title}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Category</p>
              <p className="text-gray-900 capitalize">
                {assignment.course.category}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Difficulty</p>
              <p className="text-gray-900 capitalize">
                {assignment.course.difficultyLevel}
              </p>
            </div>
          </div>
        </div>

        {/* Lesson Information */}
        {assignment.lesson && (
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center">
              <FileText className="mr-2 h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Related Lesson
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Lesson Title
                </p>
                <p className="text-gray-900">{assignment.lesson.title}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="text-gray-900">{assignment.lesson.description}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Estimated Time
                </p>
                <p className="text-gray-900">
                  {assignment.lesson.estimatedTime} minutes
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress and Timeline */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Progress Timeline
        </h3>

        <div className="space-y-4">
          {/* Assigned */}
          <div className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">
                Assignment Assigned
              </p>
              <p className="text-sm text-gray-500">
                {formatDate(assignment.assignedAt)} at{" "}
                {formatTime(assignment.assignedAt)}
              </p>
            </div>
          </div>

          {/* Started */}
          {assignment.startedAt && (
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  Started Working
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(assignment.startedAt)} at{" "}
                  {formatTime(assignment.startedAt)}
                </p>
              </div>
            </div>
          )}

          {/* Completed */}
          {assignment.completedAt && (
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <Award className="h-4 w-4 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Completed</p>
                <p className="text-sm text-gray-500">
                  {formatDate(assignment.completedAt)} at{" "}
                  {formatTime(assignment.completedAt)}
                </p>
              </div>
            </div>
          )}

          {/* Due Date */}
          <div className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                isOverdue
                  ? "bg-red-100"
                  : isDueToday
                    ? "bg-orange-100"
                    : "bg-gray-100"
              }`}
            >
              <Target
                className={`h-4 w-4 ${
                  isOverdue
                    ? "text-red-600"
                    : isDueToday
                      ? "text-orange-600"
                      : "text-gray-600"
                }`}
              />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Due Date</p>
              <p
                className={`text-sm ${isOverdue ? "font-semibold text-red-600" : isDueToday ? "font-semibold text-orange-600" : "text-gray-500"}`}
              >
                {formatDate(assignment.dueDate)} at 11:59 PM
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grade and Feedback */}
      {assignment.status === "graded" && (
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Grade & Feedback
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Grade</p>
              <p className="mt-1 text-2xl font-bold text-green-600">
                {assignment.grade}/{assignment.assignment.points}
              </p>
              <p className="text-sm text-gray-500">
                {Math.round(
                  (assignment.grade / assignment.assignment.points) * 100,
                )}
                %
              </p>
            </div>

            {assignment.feedback && (
              <div>
                <p className="text-sm font-medium text-gray-500">Feedback</p>
                <p className="mt-1 text-gray-900">{assignment.feedback}</p>
              </div>
            )}
          </div>

          {assignment.notes && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">
                Additional Notes
              </p>
              <p className="mt-1 text-gray-900">{assignment.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        {assignment.status === "not_started" && (
          <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Start Assignment
          </button>
        )}

        {assignment.status === "in_progress" && (
          <button className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
            Continue Working
          </button>
        )}

        {assignment.status === "submitted" && (
          <button
            className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
            disabled
          >
            Submitted - Waiting for Grade
          </button>
        )}

        {assignment.status === "graded" && (
          <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Review Feedback
          </button>
        )}
      </div>
    </div>
  );
}

"use client";

import {
  Award,
  BookOpen,
  Calendar,
  Clock,
  Target,
  TrendingUp,
} from "lucide-react";

interface DashboardOverviewProps {
  data: {
    totalStudyHours: number;
    totalSessions: number;
    coursesCompleted: number;
    coursesInProgress: number;
    averageQuizScore: number;
    currentStreak: number;
    longestStreak: number;
  };
  periodData: {
    studyHours: number;
    sessions: number;
    lessonsCompleted: number;
    assignmentsCompleted: number;
  };
  period: string;
}

function formatPeriod(period: string): string {
  switch (period) {
    case "week":
      return "This Week";
    case "month":
      return "This Month";
    case "quarter":
      return "This Quarter";
    case "year":
      return "This Year";
    default:
      return "This Week";
  }
}

function formatHours(hours: number): string {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes}m`;
  }
  if (hours === Math.floor(hours)) {
    return `${hours}h`;
  }
  return `${hours.toFixed(1)}h`;
}

export function DashboardOverview({
  data,
  periodData,
  period,
}: DashboardOverviewProps) {
  const periodLabel = formatPeriod(period);

  return (
    <div className="space-y-6">
      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Study Hours */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Study Hours
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatHours(data.totalStudyHours)}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-gray-500">
              {periodLabel}: {formatHours(periodData.studyHours)}
            </p>
          </div>
        </div>

        {/* Courses Status */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Courses</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.coursesCompleted}/
                {data.coursesCompleted + data.coursesInProgress}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-gray-500">
              {data.coursesCompleted} completed, {data.coursesInProgress} in
              progress
            </p>
          </div>
        </div>

        {/* Quiz Performance */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Average Quiz Score
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {data.averageQuizScore.toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-purple-600"
                style={{ width: `${data.averageQuizScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Learning Streak */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Award className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Learning Streak
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {data.currentStreak} days
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-gray-500">
              Longest: {data.longestStreak} days
            </p>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Study Sessions */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">
                Total Sessions
              </p>
              <p className="text-xl font-bold text-gray-900">
                {data.totalSessions}
              </p>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xs text-gray-500">
              {periodLabel}: {periodData.sessions} sessions
            </p>
          </div>
        </div>

        {/* Lessons Completed */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">
                Lessons Completed
              </p>
              <p className="text-xl font-bold text-gray-900">
                {periodData.lessonsCompleted}
              </p>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xs text-gray-500">{periodLabel} progress</p>
          </div>
        </div>

        {/* Assignments Completed */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-6 w-6 text-rose-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Assignments</p>
              <p className="text-xl font-bold text-gray-900">
                {periodData.assignmentsCompleted}
              </p>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xs text-gray-500">{periodLabel} completed</p>
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          {periodLabel} Summary
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {formatHours(periodData.studyHours)}
            </p>
            <p className="text-sm text-gray-600">Study Time</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {periodData.sessions}
            </p>
            <p className="text-sm text-gray-600">Sessions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {periodData.lessonsCompleted}
            </p>
            <p className="text-sm text-gray-600">Lessons</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {periodData.assignmentsCompleted}
            </p>
            <p className="text-sm text-gray-600">Assignments</p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import {
  Award,
  BookOpen,
  Calendar,
  Clock,
  Target,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

import { DashboardOverview } from "./DashboardOverview";

interface AnalyticsDashboardProps {
  userId: string;
  period: string;
}

interface AnalyticsData {
  overview: {
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
}

export function AnalyticsDashboard({
  userId,
  period,
}: AnalyticsDashboardProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `/api/analytics?userId=${userId}&period=${period}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }

        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch analytics",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalytics();
  }, [userId, period]);

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
          Error Loading Analytics
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

  if (!data) {
    return (
      <div className="rounded-lg bg-yellow-50 p-6 text-center">
        <h3 className="text-lg font-medium text-yellow-800">
          No Analytics Data Available
        </h3>
        <p className="mt-2 text-yellow-600">
          Start learning to see your progress analytics!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Learning Dashboard Overview
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Time Period:</span>
          <select
            value={period}
            onChange={(e) => {
              const url = new URL(window.location.href);
              url.searchParams.set("period", e.target.value);
              window.history.pushState({}, "", url.toString());
              window.location.reload();
            }}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Dashboard Overview Cards */}
      <DashboardOverview
        data={data.overview}
        periodData={data.periodData}
        period={period}
      />
    </div>
  );
}

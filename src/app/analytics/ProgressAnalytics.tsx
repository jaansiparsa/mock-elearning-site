"use client";

import { ACHIEVEMENT_DISPLAY_MAP, AchievementType } from "@/types";
import type { AchievementUI, PotentialAchievement } from "@/types";
import {
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";

interface ProgressAnalyticsProps {
  userId: string;
}

interface AnalyticsData {
  studyTime: {
    thisWeek: number;
    thisMonth: number;
    total: number;
  };
  courses: {
    completed: number;
    inProgress: number;
    total: number;
  };
  performance: {
    averageQuizScore: number;
    averageAssignmentScore: number;
    totalQuizzes: number;
    totalAssignments: number;
    combinedAverageScore: number;
  };
  streaks: {
    current: number;
    longest: number;
    totalAchievements: number;
  };
  recentActivity: Array<{
    date: string;
    lessonsCompleted: number;
    timeStudied: number;
  }>;
}

export default function ProgressAnalytics({ userId }: ProgressAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"week" | "month">("week");
  const [achievements, setAchievements] = useState<AchievementUI[]>([]);
  const [potentialAchievements, setPotentialAchievements] = useState<
    PotentialAchievement[]
  >([]);
  const [achievementsLoading, setAchievementsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch(
          `/api/analytics/${userId}?period=${period}`,
        );
        if (response.ok) {
          const data = (await response.json()) as AnalyticsData;
          setAnalyticsData(data);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchAchievements() {
      try {
        const response = await fetch(`/api/achievements/${userId}`);
        if (response.ok) {
          const data = (await response.json()) as {
            achievements: AchievementUI[];
            potentialAchievements: PotentialAchievement[];
          };
          setAchievements(data.achievements ?? []);
          setPotentialAchievements(data.potentialAchievements ?? []);
        }
      } catch (error) {
        console.error("Error fetching achievements:", error);
      } finally {
        setAchievementsLoading(false);
      }
    }

    void fetchAnalytics();
    void fetchAchievements();
  }, [userId, period]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Unable to load analytics
          </h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getGradeTrendColor = (trend: number) => {
    if (trend > 0) return "text-green-600";
    if (trend < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getGradeTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend < 0)
      return <TrendingUp className="h-4 w-4 rotate-180 text-red-600" />;
    return <BarChart3 className="h-4 w-4 text-gray-600" />;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Learning Analytics</h1>
        <p className="mt-2 text-gray-600">
          Track your learning progress, study habits, and achievements
        </p>

        {/* Period Selector */}
        <div className="mt-4 flex space-x-2">
          <button
            onClick={() => setPeriod("week")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              period === "week"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setPeriod("month")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              period === "month"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Study Time */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Study Time ({period === "week" ? "This Week" : "This Month"})
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatTime(
                  period === "week"
                    ? analyticsData.studyTime.thisWeek
                    : analyticsData.studyTime.thisMonth,
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Courses Progress */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Courses Progress
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsData.courses.completed}/{analyticsData.courses.total}
              </p>
              <p className="text-sm text-gray-500">
                {analyticsData.courses.inProgress} in progress
              </p>
            </div>
          </div>
        </div>

        {/* Quiz Performance */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsData.performance.combinedAverageScore}%
              </p>
              <p className="text-sm text-gray-500">
                {analyticsData.performance.totalAssignments} assignments,{" "}
                {analyticsData.performance.totalQuizzes} quizzes
              </p>
            </div>
          </div>
        </div>

        {/* Learning Streak */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full bg-orange-100 p-3">
              <Trophy className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Learning Streak
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsData.streaks.current} days
              </p>
              <p className="text-sm text-gray-500">
                Best: {analyticsData.streaks.longest} days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Study Time Breakdown */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Study Time Breakdown
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">This Week</span>
              <span className="font-medium">
                {formatTime(analyticsData.studyTime.thisWeek)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">This Month</span>
              <span className="font-medium">
                {formatTime(analyticsData.studyTime.thisMonth)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total</span>
              <span className="font-medium">
                {formatTime(analyticsData.studyTime.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Performance Trends */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Performance Trends
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Average Quiz Score</span>
              <span className="font-medium">
                {analyticsData.performance.averageQuizScore}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Quizzes</span>
              <span className="font-medium">
                {analyticsData.performance.totalQuizzes}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Average Assignment Score</span>
              <span className="font-medium">
                {analyticsData.performance.averageAssignmentScore}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {analyticsData.recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
            >
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">{activity.date}</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{activity.lessonsCompleted} lessons completed</span>
                <span>{formatTime(activity.timeStudied)} studied</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Achievements
        </h3>

        {/* Achievements Summary */}
        <div className="mb-6 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-yellow-500" />
            <span className="text-gray-700">
              {achievements.length} achievements earned
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-orange-500" />
            <span className="text-gray-700">
              Longest streak: {analyticsData?.streaks.longest ?? 0} days
            </span>
          </div>
        </div>

        {/* Progress Badges */}
        <div className="mt-8">
          <h4 className="text-md mb-4 font-medium text-gray-800">
            Progress Badges
          </h4>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {potentialAchievements.map((achievement) => {
              const displayInfo = ACHIEVEMENT_DISPLAY_MAP[achievement.type];
              return (
                <div
                  key={achievement.type}
                  className={`relative flex flex-col items-center rounded-lg border-2 p-4 text-center transition-all ${
                    achievement.earned
                      ? "border-green-300 bg-green-50"
                      : "border-dashed border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="mb-2 text-3xl">{displayInfo.icon}</div>
                  <h5 className="mb-1 text-sm font-medium text-gray-900">
                    {displayInfo.title}
                  </h5>
                  <p className="text-xs text-gray-600">
                    {displayInfo.description}
                  </p>

                  {/* Achievement indicator */}
                  {achievement.earned && (
                    <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                      <span className="text-xs text-white">✓</span>
                    </div>
                  )}

                  {/* Additional info for earned achievements */}
                  {achievement.earned && achievement.earnedAt && (
                    <div className="mt-2 text-xs text-green-600">
                      Earned{" "}
                      {new Date(achievement.earnedAt).toLocaleDateString()}
                    </div>
                  )}

                  {/* Progress info for unearned achievements */}
                  {!achievement.earned && (
                    <div className="mt-2 text-xs text-gray-500">
                      {achievement.type === AchievementType.FIRST_COURSE &&
                        "Complete a course to earn this"}
                      {achievement.type === AchievementType.SEVEN_DAY_STREAK &&
                        `Current streak: ${achievement.currentStreak} days`}
                      {achievement.type === AchievementType.HIGH_SCORER &&
                        "Get 90%+ on assignments"}
                      {achievement.type === AchievementType.COURSE_COMPLETER &&
                        "Complete multiple courses"}
                      {achievement.type === AchievementType.QUIZ_MASTER &&
                        "Get 90%+ on quizzes"}
                      {achievement.type === AchievementType.STUDY_CHAMPION &&
                        "Study more to earn this"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Achievements */}
        {achievements.length > 0 && (
          <div className="mt-12">
            <h4 className="text-md mb-4 font-medium text-gray-800">
              Recent Milestones
            </h4>
            <div className="space-y-3">
              {achievements.slice(0, 3).map((achievement) => {
                const displayInfo = ACHIEVEMENT_DISPLAY_MAP[achievement.type];
                return (
                  <div
                    key={achievement.id}
                    className="flex items-center space-x-3 rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-blue-50 p-4"
                  >
                    <div className="text-2xl">{displayInfo.icon}</div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">
                        {displayInfo.title}
                      </h5>
                      <p className="text-sm text-gray-700">
                        Achievement unlocked!
                      </p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(achievement.earnedAt).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

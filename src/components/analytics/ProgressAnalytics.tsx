"use client";

import type { AchievementUI, PotentialAchievement } from "@/types";
import { useEffect, useState } from "react";

import AchievementsSection from "./AchievementsSection";
import AnalyticsSkeleton from "./AnalyticsSkeleton";
import ChartsSection from "./ChartsSection";
import CourseBreakdown from "./CourseBreakdown";
import PerformanceTrends from "./PerformanceTrends";
import PeriodSelector from "./PeriodSelector";
import RecentActivity from "./RecentActivity";
import StatsGrid from "./StatsGrid";
import WeeklyLearningGoal from "./WeeklyLearningGoal";

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
  weeklyLearningGoal: number;
  weeklyGoalProgress: {
    completed: number;
    goal: number;
    percentage: number;
    remaining: number;
    isOnTrack: boolean;
  };
  recentActivity: Array<{
    date: string;
    lessonsCompleted: number;
    timeStudied: number;
  }>;
}

interface CourseEnrollment {
  enrollmentId: string;
  course: {
    courseId: string;
    title: string;
    category: string;
    difficultyLevel: string;
    lessons: Array<{
      lessonId: string;
      title: string;
      estimatedTime: number;
    }>;
  };
  lessonCompletions: Array<{
    lessonId: string;
    completedAt: Date;
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
  const [courseEnrollments, setCourseEnrollments] = useState<
    CourseEnrollment[]
  >([]);
  const [courseDataLoading, setCourseDataLoading] = useState(true);

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

    async function fetchCourseData() {
      try {
        const response = await fetch(`/api/analytics/${userId}/courses`);
        if (response.ok) {
          const data = (await response.json()) as {
            enrollments: CourseEnrollment[];
          };
          setCourseEnrollments(data.enrollments ?? []);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setCourseDataLoading(false);
      }
    }

    void fetchAnalytics();
    void fetchAchievements();
    void fetchCourseData();
  }, [userId, period]);

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  if (!analyticsData) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg text-red-600">Failed to load analytics</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Period Selector */}
      <PeriodSelector period={period} onPeriodChange={setPeriod} />

      {/* Weekly Learning Goal */}
      <WeeklyLearningGoal
        weeklyLearningGoal={analyticsData.weeklyLearningGoal}
        weeklyGoalProgress={analyticsData.weeklyGoalProgress}
      />

      {/* Four Metric Boxes */}
      <StatsGrid
        studyTime={analyticsData.studyTime.thisWeek}
        courses={analyticsData.courses}
        performance={analyticsData.performance}
        streaks={analyticsData.streaks}
      />

      {/* Performance Trends */}
      <PerformanceTrends performance={analyticsData.performance} />

      {/* Charts Section */}
      <ChartsSection />

      {/* Recent Activity */}
      <RecentActivity recentActivity={analyticsData.recentActivity} />

      {/* Achievements */}
      <AchievementsSection
        achievements={achievements}
        potentialAchievements={potentialAchievements}
        longestStreak={analyticsData.streaks.longest}
      />

      {/* Detailed Course Breakdown */}
      <CourseBreakdown courseEnrollments={courseEnrollments} />
    </div>
  );
}

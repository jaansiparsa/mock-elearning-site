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
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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

interface UserAssignment {
  assignmentId: string;
  title: string;
  points: number;
  submission?: {
    status: string;
    grade?: number;
    submittedAt?: Date;
  };
}

interface UserQuiz {
  quizId: string;
  title: string;
  totalPoints: number;
  submission?: {
    status: string;
    score?: number;
    submittedAt?: Date;
  };
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
              <div className="text-sm font-medium text-gray-600">
                Learning Streak
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {analyticsData.streaks.current} days
              </div>
              <div className="text-sm text-gray-500">
                Best: {analyticsData.streaks.longest} days
              </div>
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
              Recent Achievements
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

      {/* Interactive Charts and Visualizations */}
      {/* MOCK DATA FOR THE CHARTS */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Progress at a Glance
        </h3>

        {/* Study Time Line Chart */}
        <div className="mb-8">
          <h4 className="text-md mb-4 font-medium text-gray-800">
            Study Time Over Last 30 Days
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { date: "Jan 1", time: 45 },
                  { date: "Jan 2", time: 60 },
                  { date: "Jan 3", time: 30 },
                  { date: "Jan 4", time: 75 },
                  { date: "Jan 5", time: 90 },
                  { date: "Jan 6", time: 120 },
                  { date: "Jan 7", time: 85 },
                  { date: "Jan 8", time: 65 },
                  { date: "Jan 9", time: 100 },
                  { date: "Jan 10", time: 55 },
                  { date: "Jan 11", time: 80 },
                  { date: "Jan 12", time: 95 },
                  { date: "Jan 13", time: 70 },
                  { date: "Jan 14", time: 110 },
                  { date: "Jan 15", time: 40 },
                  { date: "Jan 16", time: 85 },
                  { date: "Jan 17", time: 75 },
                  { date: "Jan 18", time: 90 },
                  { date: "Jan 19", time: 65 },
                  { date: "Jan 20", time: 100 },
                  { date: "Jan 21", time: 80 },
                  { date: "Jan 22", time: 95 },
                  { date: "Jan 23", time: 70 },
                  { date: "Jan 24", time: 110 },
                  { date: "Jan 25", time: 85 },
                  { date: "Jan 26", time: 60 },
                  { date: "Jan 27", time: 90 },
                  { date: "Jan 28", time: 75 },
                  { date: "Jan 29", time: 100 },
                  { date: "Jan 30", time: 85 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [
                    `${value} minutes`,
                    "Study Time",
                  ]}
                  labelFormatter={(label: string) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="time"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Category Bar Chart */}
        <div className="mb-8">
          <h4 className="text-md mb-4 font-medium text-gray-800">
            Hours Spent Per Course Category
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { category: "Programming", hours: 12.5 },
                  { category: "Marketing", hours: 8.2 },
                  { category: "Design", hours: 6.8 },
                  { category: "Business", hours: 4.5 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [
                    `${value} hours`,
                    "Study Time",
                  ]}
                />
                <Bar dataKey="hours" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Completion Pie Chart */}
        <div className="mb-8">
          <h4 className="text-md mb-4 font-medium text-gray-800">
            Completion Rate Breakdown by Course
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Completed", value: 2, fill: "#10b981" },
                    { name: "In Progress", value: 1, fill: "#f59e0b" },
                    { name: "Not Started", value: 2, fill: "#6b7280" },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                  }
                >
                  {[
                    { name: "Completed", value: 2, fill: "#10b981" },
                    { name: "In Progress", value: 1, fill: "#f59e0b" },
                    { name: "Not Started", value: 2, fill: "#6b7280" },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value} courses`, "Count"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Learning Activity Heatmap Calendar */}
        <div>
          <h4 className="text-md mb-4 font-medium text-gray-800">
            Daily Learning Activity
          </h4>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Less{" "}
                <span className="inline-block h-3 w-3 rounded-sm bg-gray-200"></span>
                <span className="mx-1 inline-block h-3 w-3 rounded-sm bg-gray-300"></span>
                <span className="mx-1 inline-block h-3 w-3 rounded-sm bg-gray-400"></span>
                <span className="mx-1 inline-block h-3 w-3 rounded-sm bg-gray-500"></span>
                <span className="mx-1 inline-block h-3 w-3 rounded-sm bg-gray-600"></span>{" "}
                More
              </div>
              <div className="text-xs text-gray-500">Last 365 days</div>
            </div>
            <div className="grid grid-cols-53 gap-1">
              {/* Generate 365 days of activity squares */}
              {Array.from({ length: 365 }, (_, i) => {
                const activityLevel = Math.floor(Math.random() * 5); // Random activity for demo
                const bgColor = [
                  "bg-gray-100",
                  "bg-gray-200",
                  "bg-gray-300",
                  "bg-gray-400",
                  "bg-gray-500",
                ][activityLevel];

                return (
                  <div
                    key={i}
                    className={`h-3 w-3 rounded-sm ${bgColor} cursor-pointer transition-colors hover:scale-110`}
                    title={`Day ${i + 1}: ${activityLevel > 0 ? `${activityLevel * 20}% activity` : "No activity"}`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Course Breakdown */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Detailed Course Breakdown
        </h3>

        {/* Course List */}
        <div className="space-y-4">
          {courseEnrollments.map((enrollment) => {
            const totalLessons = enrollment.course.lessons.length;
            const completedLessons = enrollment.lessonCompletions.length;
            const completionPercentage =
              totalLessons > 0
                ? Math.round((completedLessons / totalLessons) * 100)
                : 0;

            return (
              <div
                key={enrollment.enrollmentId}
                className="rounded-lg border border-gray-200 bg-gray-50"
              >
                <button
                  className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-100"
                  onClick={() => {
                    const content = document.getElementById(
                      `course-${enrollment.enrollmentId}`,
                    );
                    if (content) {
                      content.classList.toggle("hidden");
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        enrollment.course.category === "programming"
                          ? "bg-blue-100"
                          : enrollment.course.category === "marketing"
                            ? "bg-green-100"
                            : enrollment.course.category === "design"
                              ? "bg-purple-100"
                              : "bg-gray-100"
                      }`}
                    >
                      <BookOpen
                        className={`h-5 w-5 ${
                          enrollment.course.category === "programming"
                            ? "text-blue-600"
                            : enrollment.course.category === "marketing"
                              ? "text-green-600"
                              : enrollment.course.category === "design"
                                ? "text-purple-600"
                                : "text-gray-600"
                        }`}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {enrollment.course.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {enrollment.course.category.charAt(0).toUpperCase() +
                          enrollment.course.category.slice(1)}{" "}
                        •{" "}
                        {enrollment.course.difficultyLevel
                          .charAt(0)
                          .toUpperCase() +
                          enrollment.course.difficultyLevel.slice(1)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {completionPercentage}% Complete
                      </p>
                      <p className="text-xs text-gray-500">
                        {completedLessons} of {totalLessons} lessons
                      </p>
                    </div>
                    <div className="h-5 w-5 text-gray-400">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Expandable Content */}
                <div
                  id={`course-${enrollment.enrollmentId}`}
                  className="hidden border-t border-gray-200 p-4"
                >
                  {/* Lesson Completion Timeline */}
                  <div className="mb-6">
                    <h5 className="mb-3 text-sm font-medium text-gray-800">
                      Lesson Completion Timeline
                    </h5>
                    <div className="space-y-3">
                      {enrollment.course.lessons.map((lesson) => {
                        const isCompleted = enrollment.lessonCompletions.some(
                          (completion) =>
                            completion.lessonId === lesson.lessonId,
                        );
                        const completion = enrollment.lessonCompletions.find(
                          (completion) =>
                            completion.lessonId === lesson.lessonId,
                        );

                        return (
                          <div
                            key={lesson.lessonId}
                            className="flex items-center space-x-3"
                          >
                            <div
                              className={`h-3 w-3 rounded-full ${
                                isCompleted ? "bg-green-500" : "bg-gray-300"
                              }`}
                            ></div>
                            <span
                              className={`text-sm ${
                                isCompleted ? "text-gray-700" : "text-gray-500"
                              }`}
                            >
                              {lesson.title}
                            </span>
                            <span className="text-xs text-gray-500">
                              {isCompleted
                                ? `Completed ${completion?.completedAt ? new Date(completion.completedAt).toLocaleDateString() : "recently"}`
                                : "Not started"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Course Stats */}
                  <div className="mb-4">
                    <h5 className="mb-3 text-sm font-medium text-gray-800">
                      Course Statistics
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-blue-50 p-3">
                        <div className="text-sm text-blue-600">
                          Total Study Time
                        </div>
                        <div className="text-lg font-semibold text-blue-900">
                          {enrollment.course.lessons.reduce(
                            (total, lesson) => total + lesson.estimatedTime,
                            0,
                          )}{" "}
                          min
                        </div>
                        <div className="text-xs text-blue-600">Estimated</div>
                      </div>
                      <div className="rounded-lg bg-green-50 p-3">
                        <div className="text-sm text-green-600">Progress</div>
                        <div className="text-lg font-semibold text-green-900">
                          {completionPercentage}%
                        </div>
                        <div className="text-xs text-green-600">
                          {completedLessons}/{totalLessons} lessons
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

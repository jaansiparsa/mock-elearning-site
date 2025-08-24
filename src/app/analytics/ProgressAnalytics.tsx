"use client";

import { ACHIEVEMENT_DISPLAY_MAP, AchievementType } from "@/types";
import type { AchievementUI, PotentialAchievement } from "@/types";
import {
  Award,
  BookOpen,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Trophy,
  Zap,
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

  // Mock data for charts
  const mockStudyTimeData = [
    { date: "Jan 1", minutes: 45 },
    { date: "Jan 2", minutes: 60 },
    { date: "Jan 3", minutes: 30 },
    { date: "Jan 4", minutes: 75 },
    { date: "Jan 5", minutes: 90 },
    { date: "Jan 6", minutes: 120 },
    { date: "Jan 7", minutes: 85 },
  ];

  const mockCategoryData = [
    { category: "Programming", hours: 12.5 },
    { category: "Marketing", hours: 8.2 },
    { category: "Design", hours: 6.8 },
    { category: "Business", hours: 4.5 },
  ];

  const mockCompletionData = [
    { name: "Completed", value: 2 },
    { name: "In Progress", value: 1 },
    { name: "Not Started", value: 2 },
  ];

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

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg">Loading analytics...</div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg text-red-600">Failed to load analytics</div>
      </div>
    );
  }

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

      {/* Weekly Learning Goal */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Weekly Learning Goal
            </h2>
            <p className="text-sm text-gray-600">
              Your target study time for this week
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">
              {Math.round(
                ((analyticsData?.weeklyLearningGoal ?? 300) / 60) * 10,
              ) / 10}{" "}
              hours
            </div>
            <div className="text-sm text-gray-500">
              {analyticsData?.weeklyLearningGoal ?? 300} minutes
            </div>
          </div>
        </div>

        {/* Progress Bar and Stats */}
        {analyticsData?.weeklyGoalProgress && (
          <div className="mt-6">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
                <span>Progress this week</span>
                <span>{analyticsData.weeklyGoalProgress.percentage}%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-200">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    analyticsData.weeklyGoalProgress.isOnTrack
                      ? "bg-green-500"
                      : analyticsData.weeklyGoalProgress.percentage > 50
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                  }`}
                  style={{
                    width: `${Math.min(analyticsData.weeklyGoalProgress.percentage, 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Progress Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatTime(analyticsData.weeklyGoalProgress.completed)}
                </div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatTime(analyticsData.weeklyGoalProgress.remaining)}
                </div>
                <div className="text-xs text-gray-500">Remaining</div>
              </div>
              <div>
                <div
                  className={`text-lg font-semibold ${
                    analyticsData.weeklyGoalProgress.isOnTrack
                      ? "text-green-600"
                      : "text-orange-600"
                  }`}
                >
                  {analyticsData.weeklyGoalProgress.isOnTrack
                    ? "On Track! 🎯"
                    : "Keep Going! 💪"}
                </div>
                <div className="text-xs text-gray-500">Status</div>
              </div>
            </div>

            {/* Lesson Completion Summary */}
            <div className="mt-4 rounded-lg bg-blue-50 p-3">
              <div className="text-sm text-blue-800">
                <strong>This week:</strong> You have completed lessons totaling{" "}
                <strong>
                  {formatTime(analyticsData.weeklyGoalProgress.completed)}
                </strong>{" "}
                of your {formatTime(analyticsData.weeklyGoalProgress.goal)}{" "}
                weekly goal.
                {analyticsData.weeklyGoalProgress.isOnTrack ? (
                  <span className="text-green-700">
                    {" "}
                    Great job staying on track!
                  </span>
                ) : (
                  <span className="text-orange-700">
                    {" "}
                    You need{" "}
                    {formatTime(
                      analyticsData.weeklyGoalProgress.remaining,
                    )}{" "}
                    more to reach your goal.
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Four Metric Boxes */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Study Time */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Study Time</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsData?.studyTime.thisWeek ?? 0} min
              </p>
              <p className="text-sm text-gray-500">This week</p>
            </div>
          </div>
        </div>

        {/* Courses */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Courses</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsData?.courses.total ?? 0}
              </p>
              <p className="text-sm text-gray-500">
                {analyticsData?.courses.inProgress ?? 0} in progress
              </p>
            </div>
          </div>
        </div>

        {/* Average Score */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsData?.performance.combinedAverageScore.toFixed(0)}%
              </p>
              <p className="text-sm text-gray-500">
                {analyticsData?.performance.totalAssignments ?? 0} assignments,{" "}
                {analyticsData?.performance.totalQuizzes ?? 0} quizzes
              </p>
            </div>
          </div>
        </div>

        {/* Streak */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full bg-orange-100 p-3">
              <Zap className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Current Streak
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsData?.streaks.current ?? 0} days
              </p>
              <p className="text-sm text-gray-500">
                Longest: {analyticsData?.streaks.longest ?? 0} days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Trends */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Performance Trends
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Average Quiz Score</span>
            <span className="font-medium">
              {analyticsData?.performance.averageQuizScore ?? 0}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total Quizzes</span>
            <span className="font-medium">
              {analyticsData?.performance.totalQuizzes ?? 0}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Average Assignment Score</span>
            <span className="font-medium">
              {analyticsData?.performance.averageAssignmentScore ?? 0}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total Assignments</span>
            <span className="font-medium">
              {analyticsData?.performance.totalAssignments ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* Progress at a Glance */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Progress at a Glance
        </h3>

        {/* Study Time Line Chart */}
        <div className="mb-8">
          <h4 className="text-md mb-4 font-medium text-gray-800">
            Study Time Over Last 30 Days
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockStudyTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`${value} min`, "Study Time"]}
                  labelFormatter={(label: string) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="minutes"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Category Bar Chart */}
        <div className="mb-8">
          <h4 className="text-md mb-4 font-medium text-gray-800">
            Hours Spent per Course Category
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockCategoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [
                    `${value} hours`,
                    "Study Time",
                  ]}
                />
                <Bar dataKey="hours" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Completion Pie Chart */}
        <div className="mb-8">
          <h4 className="text-md mb-4 font-medium text-gray-800">
            Course Completion Rate
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockCompletionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockCompletionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444"][index]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Learning Activity Heatmap */}
        <div>
          <h4 className="text-md mb-4 font-medium text-gray-800">
            Daily Learning Activity
          </h4>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="text-center text-xs text-gray-500">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i]}
              </div>
            ))}
            {Array.from({ length: 28 }, (_, i) => {
              const intensity = Math.floor(Math.random() * 4);
              const colors = [
                "bg-gray-100",
                "bg-green-200",
                "bg-green-400",
                "bg-green-600",
              ];
              return (
                <div
                  key={i}
                  className={`h-8 w-8 rounded ${colors[intensity]} border border-gray-200`}
                  title={`Day ${i + 1}: ${intensity * 25}% activity`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
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
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
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
        <div className="mt-8">
          <h4 className="text-md mb-4 font-medium text-gray-800">
            Recent Achievements
          </h4>
          <div className="space-y-3">
            {achievements.slice(0, 3).map((achievement) => {
              const displayInfo = ACHIEVEMENT_DISPLAY_MAP[achievement.type];
              return (
                <div
                  key={achievement.id}
                  className="flex items-center space-x-3 rounded-lg bg-green-50 p-3"
                >
                  <div className="text-2xl">{displayInfo.icon}</div>
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-gray-900">
                      {displayInfo.title}
                    </h5>
                    <p className="text-xs text-gray-600">
                      Earned{" "}
                      {new Date(achievement.earnedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
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

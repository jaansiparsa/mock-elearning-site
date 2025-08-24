import { BookOpen, Clock, Target, Zap } from "lucide-react";

interface StatsGridProps {
  studyTime: number;
  courses: {
    total: number;
    inProgress: number;
  };
  performance: {
    combinedAverageScore: number;
    totalAssignments: number;
    totalQuizzes: number;
  };
  streaks: {
    current: number;
    longest: number;
  };
}

export default function StatsGrid({
  studyTime,
  courses,
  performance,
  streaks,
}: StatsGridProps) {
  return (
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
              {studyTime} min
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
              {courses.total}
            </p>
            <p className="text-sm text-gray-500">
              {courses.inProgress} in progress
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
              {performance.combinedAverageScore.toFixed(0)}%
            </p>
            <p className="text-sm text-gray-500">
              {performance.totalAssignments} assignments,{" "}
              {performance.totalQuizzes} quizzes
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
            <p className="text-sm font-medium text-gray-600">Current Streak</p>
            <p className="text-2xl font-semibold text-gray-900">
              {streaks.current} days
            </p>
            <p className="text-sm text-gray-500">
              Longest: {streaks.longest} days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

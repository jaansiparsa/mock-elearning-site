interface PerformanceTrendsProps {
  performance: {
    averageQuizScore: number;
    totalQuizzes: number;
    averageAssignmentScore: number;
    totalAssignments: number;
  };
}

export default function PerformanceTrends({
  performance,
}: PerformanceTrendsProps) {
  return (
    <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Performance Trends
      </h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Average Quiz Score</span>
          <span className="font-medium">{performance.averageQuizScore}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Total Quizzes</span>
          <span className="font-medium">{performance.totalQuizzes}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Average Assignment Score</span>
          <span className="font-medium">
            {performance.averageAssignmentScore}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Total Assignments</span>
          <span className="font-medium">{performance.totalAssignments}</span>
        </div>
      </div>
    </div>
  );
}

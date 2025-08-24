interface WeeklyLearningGoalProps {
  weeklyLearningGoal: number;
  weeklyGoalProgress: {
    completed: number;
    goal: number;
    percentage: number;
    remaining: number;
    isOnTrack: boolean;
  };
}

function formatTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

export default function WeeklyLearningGoal({
  weeklyLearningGoal,
  weeklyGoalProgress,
}: WeeklyLearningGoalProps) {
  return (
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
            {Math.round((weeklyLearningGoal / 60) * 10) / 10} hours
          </div>
          <div className="text-sm text-gray-500">
            {weeklyLearningGoal} minutes
          </div>
        </div>
      </div>

      {/* Progress Bar and Stats */}
      <div className="mt-6">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
            <span>Progress this week</span>
            <span>{weeklyGoalProgress.percentage}%</span>
          </div>
          <div className="h-3 w-full rounded-full bg-gray-200">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                weeklyGoalProgress.isOnTrack
                  ? "bg-green-500"
                  : weeklyGoalProgress.percentage > 50
                    ? "bg-yellow-500"
                    : "bg-blue-500"
              }`}
              style={{
                width: `${Math.min(weeklyGoalProgress.percentage, 100)}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {formatTime(weeklyGoalProgress.completed)}
            </div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {formatTime(weeklyGoalProgress.remaining)}
            </div>
            <div className="text-xs text-gray-500">Remaining</div>
          </div>
          <div>
            <div
              className={`text-lg font-semibold ${
                weeklyGoalProgress.isOnTrack
                  ? "text-green-600"
                  : "text-orange-600"
              }`}
            >
              {weeklyGoalProgress.isOnTrack ? "On Track! 🎯" : "Keep Going! 💪"}
            </div>
            <div className="text-xs text-gray-500">Status</div>
          </div>
        </div>

        {/* Lesson Completion Summary */}
        <div className="mt-4 rounded-lg bg-blue-50 p-3">
          <div className="text-sm text-blue-800">
            <strong>This week:</strong> You have completed lessons totaling{" "}
            <strong>{formatTime(weeklyGoalProgress.completed)}</strong> of your{" "}
            {formatTime(weeklyGoalProgress.goal)} weekly goal.
            {weeklyGoalProgress.isOnTrack ? (
              <span className="text-green-700">
                {" "}
                Great job staying on track!
              </span>
            ) : (
              <span className="text-orange-700">
                {" "}
                You need {formatTime(weeklyGoalProgress.remaining)} more to
                reach your goal.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Calendar } from "lucide-react";

interface RecentActivityProps {
  recentActivity: Array<{
    date: string;
    lessonsCompleted: number;
    timeStudied: number;
  }>;
}

function formatTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

export default function RecentActivity({
  recentActivity,
}: RecentActivityProps) {
  return (
    <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Recent Activity
      </h3>
      <div className="space-y-3">
        {recentActivity.map((activity, index) => (
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
  );
}

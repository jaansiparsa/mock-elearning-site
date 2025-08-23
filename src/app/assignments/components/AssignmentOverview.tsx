import { CheckCircle, Clock, FileText, Target, TrendingUp } from "lucide-react";

import AssignmentCalendar from "./AssignmentCalendar";

interface Assignment {
  id: string;
  type: "assignment" | "quiz";
  assignmentId: string;
  title: string;
  description: string;
  dueDate: Date;
  points: number;
  status: "not_started" | "in_progress" | "completed" | "graded" | "overdue";
  courseTitle: string;
  courseId: string;
  lessonTitle?: string;
  lessonId?: string;
  grade?: number;
  feedback?: string;
  assignedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  isOverdue: boolean;
  isDueToday: boolean;
  isDueThisWeek: boolean;
}

interface AssignmentOverviewProps {
  overview: {
    total: number;
    completed: number;
    overdue: number;
    upcoming: number;
  };
  assignments: Array<Assignment>;
}

export default function AssignmentOverview({
  overview,
  assignments,
}: AssignmentOverviewProps) {
  const cards = [
    {
      title: "Total Assignments",
      value: overview.total,
      icon: FileText,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Completed",
      value: overview.completed,
      icon: CheckCircle,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Overdue",
      value: overview.overdue,
      icon: Clock,
      color: "bg-red-500",
      textColor: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Upcoming",
      value: overview.upcoming,
      icon: Target,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.title}
              className={`relative overflow-hidden rounded-lg ${card.bgColor} p-6 transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-lg ${card.color} p-3`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {card.title}
                  </p>
                  <p className={`text-2xl font-bold ${card.textColor}`}>
                    {card.value}
                  </p>
                </div>
              </div>

              {/* Progress indicator for completed assignments */}
              {card.title === "Completed" && overview.total > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">
                      {Math.round((overview.completed / overview.total) * 100)}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-2 rounded-full ${card.color} transition-all duration-300`}
                      style={{
                        width: `${(overview.completed / overview.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Calendar */}
      <AssignmentCalendar assignments={assignments} />
    </div>
  );
}

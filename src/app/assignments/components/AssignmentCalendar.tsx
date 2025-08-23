"use client";

import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useMemo, useState } from "react";

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

interface AssignmentCalendarProps {
  assignments: Assignment[];
}

export default function AssignmentCalendar({
  assignments,
}: AssignmentCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    return startOfWeek;
  });

  const weekData = useMemo(() => {
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const week = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeek);
      date.setDate(currentWeek.getDate() + i);

      const dayAssignments = assignments.filter(
        (assignment) =>
          assignment.dueDate.getDate() === date.getDate() &&
          assignment.dueDate.getMonth() === date.getMonth() &&
          assignment.dueDate.getFullYear() === date.getFullYear(),
      );

      week.push({
        day: weekDays[i],
        date,
        dayNumber: date.getDate(),
        assignments: dayAssignments,
        isToday: date.toDateString() === new Date().toDateString(),
        isCurrentMonth: date.getMonth() === new Date().getMonth(),
      });
    }

    return week;
  }, [currentWeek, assignments]);

  const goToPreviousWeek = () => {
    setCurrentWeek((prev) => {
      const newWeek = new Date(prev);
      newWeek.setDate(prev.getDate() - 7);
      return newWeek;
    });
  };

  const goToNextWeek = () => {
    setCurrentWeek((prev) => {
      const newWeek = new Date(prev);
      newWeek.setDate(prev.getDate() + 7);
      return newWeek;
    });
  };

  const goToCurrentWeek = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    setCurrentWeek(startOfWeek);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "graded":
        return "bg-green-500";
      case "overdue":
        return "bg-red-500";
      case "in_progress":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  const formatWeekRange = () => {
    const endOfWeek = new Date(currentWeek);
    endOfWeek.setDate(currentWeek.getDate() + 6);

    const startMonth = currentWeek.toLocaleDateString("en-US", {
      month: "short",
    });
    const endMonth = endOfWeek.toLocaleDateString("en-US", { month: "short" });

    if (startMonth === endMonth) {
      return `${startMonth} ${currentWeek.getDate()}-${endOfWeek.getDate()}, ${currentWeek.getFullYear()}`;
    } else {
      return `${startMonth} ${currentWeek.getDate()} - ${endMonth} ${endOfWeek.getDate()}, ${currentWeek.getFullYear()}`;
    }
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-4 w-4 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">
            This Week&apos;s Assignments
          </h3>
        </div>
        <button
          onClick={goToCurrentWeek}
          className="rounded-md bg-blue-600 px-2 py-1 text-xs text-white transition-colors hover:bg-blue-700"
        >
          Today
        </button>
      </div>

      {/* Week Navigation */}
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={goToPreviousWeek}
          className="rounded-md p-1 transition-colors hover:bg-gray-100"
        >
          <ChevronLeft className="h-3 w-3 text-gray-600" />
        </button>
        <h2 className="text-sm font-medium text-gray-900">
          {formatWeekRange()}
        </h2>
        <button
          onClick={goToNextWeek}
          className="rounded-md p-1 transition-colors hover:bg-gray-100"
        >
          <ChevronRight className="h-3 w-3 text-gray-600" />
        </button>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-1">
        {weekData.map((day) => (
          <div
            key={day.day}
            className={`min-h-[60px] rounded-lg border p-2 ${
              day.isToday
                ? "border-blue-200 bg-blue-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="text-center">
              <div className={`mb-1 text-xs font-medium text-gray-500`}>
                {day.day}
              </div>
              <div
                className={`text-sm font-semibold ${
                  day.isToday
                    ? "text-blue-600"
                    : day.isCurrentMonth
                      ? "text-gray-900"
                      : "text-gray-400"
                }`}
              >
                {day.dayNumber}
              </div>
            </div>

            {/* Assignment indicators */}
            <div className="mt-2 space-y-1">
              {day.assignments.slice(0, 2).map((assignment, index) => (
                <div
                  key={assignment.assignmentId}
                  className={`h-1.5 w-full rounded-full ${getStatusColor(assignment.status)}`}
                  title={`${assignment.title} - ${assignment.courseTitle}`}
                />
              ))}
              {day.assignments.length > 2 && (
                <div className="text-center text-xs text-gray-500">
                  +{day.assignments.length - 2}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Compact Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-600">
        <div className="flex items-center space-x-1">
          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          <span>Not Started</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
          <span>In Progress</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="h-2 w-2 rounded-full bg-red-500"></div>
          <span>Overdue</span>
        </div>
      </div>
    </div>
  );
}

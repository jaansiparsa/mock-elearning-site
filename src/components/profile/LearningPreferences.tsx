"use client";

import { Bell, Clock, Moon, Sun, Zap } from "lucide-react";

import type { ProfileUser } from "../../app/profile/types";
import { useState } from "react";

interface LearningPreferencesProps {
  user: ProfileUser;
}

const STUDY_TIME_OPTIONS = [
  {
    value: "morning",
    label: "Morning",
    icon: Sun,
    description: "6 AM - 12 PM",
  },
  {
    value: "afternoon",
    label: "Afternoon",
    icon: Zap,
    description: "12 PM - 6 PM",
  },
  {
    value: "evening",
    label: "Evening",
    icon: Clock,
    description: "6 PM - 10 PM",
  },
  { value: "night", label: "Night", icon: Moon, description: "10 PM - 6 AM" },
];

export default function LearningPreferences({
  user,
}: LearningPreferencesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    notificationPreference: user.notificationPreference ?? true,
    preferredStudyTime: user.preferredStudyTime ?? "morning",
    weeklyLearningGoal: user.weeklyLearningGoal ?? 300,
  });

  const handlePreferenceChange = (
    key: string,
    value: string | boolean | number,
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/profile/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationPreference: preferences.notificationPreference,
          preferredStudyTime: preferences.preferredStudyTime,
          weeklyLearningGoal: preferences.weeklyLearningGoal,
        }),
      });

      if (!response.ok) {
        const error = (await response.json()) as { error?: string };
        throw new Error(error.error ?? "Failed to update preferences");
      }

      setIsEditing(false);
      alert("Learning preferences updated successfully!");
    } catch (error) {
      console.error("Failed to update preferences:", error);
      alert(
        error instanceof Error ? error.message : "Failed to update preferences",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreferences({
      notificationPreference: user.notificationPreference ?? true,
      preferredStudyTime: user.preferredStudyTime ?? "morning",
      weeklyLearningGoal: user.weeklyLearningGoal ?? 300,
    });
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Learning Preferences
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Edit Preferences
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Notification Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notification Preferences
            </label>
            <div className="mt-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.notificationPreference}
                  onChange={(e) =>
                    handlePreferenceChange(
                      "notificationPreference",
                      e.target.checked,
                    )
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Receive email notifications for course updates and assignments
                </span>
              </label>
            </div>
          </div>

          {/* Weekly Learning Goal */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Weekly Learning Goal
            </label>
            <div className="mt-2 flex items-center space-x-2">
              <input
                type="number"
                min="60"
                max="1680"
                step="30"
                value={preferences.weeklyLearningGoal}
                onChange={(e) =>
                  handlePreferenceChange(
                    "weeklyLearningGoal",
                    parseInt(e.target.value) || 300,
                  )
                }
                className="block w-24 rounded-md border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-500">minutes per week</span>
              <span className="text-sm text-gray-400">
                ({Math.round((preferences.weeklyLearningGoal / 60) * 10) / 10}{" "}
                hours)
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Set your target study time for each week (1-28 hours)
            </p>
          </div>

          {/* Preferred Study Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preferred Study Time
            </label>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {STUDY_TIME_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer flex-col items-center rounded-lg border-2 p-3 transition-colors ${
                      preferences.preferredStudyTime === option.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="preferredStudyTime"
                      value={option.value}
                      checked={preferences.preferredStudyTime === option.value}
                      onChange={(e) =>
                        handlePreferenceChange(
                          "preferredStudyTime",
                          e.target.value,
                        )
                      }
                      className="sr-only"
                    />
                    <Icon
                      className={`h-6 w-6 ${
                        preferences.preferredStudyTime === option.value
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`mt-2 text-sm font-medium ${
                        preferences.preferredStudyTime === option.value
                          ? "text-blue-900"
                          : "text-gray-700"
                      }`}
                    >
                      {option.label}
                    </span>
                    <span
                      className={`text-xs ${
                        preferences.preferredStudyTime === option.value
                          ? "text-blue-700"
                          : "text-gray-500"
                      }`}
                    >
                      {option.description}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

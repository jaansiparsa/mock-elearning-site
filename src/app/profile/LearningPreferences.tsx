"use client";

import { Bell, Clock, Moon, Sun, Zap } from "lucide-react";

import { ProfileUser } from "./types";
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
    preferredStudyTime: user.preferredStudyTime || "morning",
  });

  const handlePreferenceChange = (key: string, value: any) => {
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
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update preferences");
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
      preferredStudyTime: user.preferredStudyTime || "morning",
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
        {/* Notification Settings */}
        <div>
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Notification Settings
          </h3>
          <div className="space-y-3">
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
                disabled={!isEditing}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
              />
              <div className="ml-3 flex items-center">
                <Bell className="mr-2 h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                  Enable learning notifications
                </span>
              </div>
            </label>
            <p className="ml-7 text-sm text-gray-500">
              Receive reminders about course deadlines, new lessons, and
              learning streaks
            </p>
          </div>
        </div>

        {/* Preferred Study Time */}
        <div>
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Preferred Study Time
          </h3>
          <p className="mb-4 text-sm text-gray-600">
            Choose when you're most productive for learning. This helps us
            optimize your learning experience.
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {STUDY_TIME_OPTIONS.map((option) => {
              const IconComponent = option.icon;
              return (
                <label
                  key={option.value}
                  className={`relative flex cursor-pointer rounded-lg border p-4 transition-colors ${
                    preferences.preferredStudyTime === option.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  } ${!isEditing ? "cursor-default" : ""}`}
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
                    disabled={!isEditing}
                    className="sr-only"
                  />

                  <div className="flex w-full items-center">
                    <div
                      className={`mr-3 flex h-10 w-10 items-center justify-center rounded-full ${
                        preferences.preferredStudyTime === option.value
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>

                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        {option.description}
                      </div>
                    </div>

                    {preferences.preferredStudyTime === option.value && (
                      <div className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                        <svg
                          className="h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </label>
              );
            })}
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

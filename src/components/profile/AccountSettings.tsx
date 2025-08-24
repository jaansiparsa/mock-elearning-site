"use client";

import {
  Eye,
  EyeOff,
  Lock,
  Shield,
  Trash2,
  User as UserIcon,
} from "lucide-react";

import { ProfileUser } from "../../app/profile/types";
import { useState } from "react";

interface AccountSettingsProps {
  user: ProfileUser;
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password confirmation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New password and confirmation password do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("New password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to change password");
      }

      setIsEditing(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      alert("Password changed successfully!");
    } catch (error) {
      console.error("Failed to change password:", error);
      alert(
        error instanceof Error ? error.message : "Failed to change password",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion with confirmation
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      console.log("Account deletion requested");
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Account Settings
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Change Password
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Account Information */}
        <div>
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Account Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <UserIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">User ID</p>
                <p className="font-mono text-sm text-gray-500">{user.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Account Type
                </p>
                <p className="text-sm text-gray-500 capitalize">
                  {user.role || "Student"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Lock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Account Status
                </p>
                <p className="text-sm text-green-600">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div>
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Privacy Settings
          </h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked={true}
                disabled
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
              />
              <div className="ml-3">
                <span className="text-sm font-medium text-gray-700">
                  Profile visibility
                </span>
                <p className="text-sm text-gray-500">
                  Your profile is visible to other learners and instructors
                </p>
              </div>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked={false}
                disabled
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
              />
              <div className="ml-3">
                <span className="text-sm font-medium text-gray-700">
                  Learning analytics sharing
                </span>
                <p className="text-sm text-gray-500">
                  Share your learning progress with instructors (coming soon)
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Change Password Form */}
        {isEditing && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Change Password
            </h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Current Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={8}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 8 characters long
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:text-sm"
                />
              </div>

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
                  disabled={
                    isLoading ||
                    passwordData.newPassword !== passwordData.confirmPassword
                  }
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Danger Zone */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="mb-4 text-lg font-medium text-red-600">Danger Zone</h3>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-red-800">
                  Delete Account
                </h4>
                <p className="text-sm text-red-600">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
              >
                <Trash2 className="mr-2 inline h-4 w-4" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

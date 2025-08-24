"use client";

import { Camera, X } from "lucide-react";
import { useRef, useState } from "react";

import type { ProfileUser } from "../../app/profile/types";

interface ProfileFormProps {
  user: ProfileUser;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    username: user.username || "",
    email: user.email || "",
    avatarUrl: user.avatarUrl || "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Username validation state
  const [usernameValidation, setUsernameValidation] = useState({
    isChecking: false,
    isAvailable: true,
    message: "",
    hasChanged: false,
  });

  const uploadAvatar = async (file: File): Promise<string> => {
    // For now, we'll use a placeholder URL
    // In a real application, you would upload to a service like AWS S3, Cloudinary, etc.
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Convert to data URL for demo purposes
        // In production, upload to your file storage service
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Check username availability when username changes
    if (name === "username" && value !== user.username) {
      setUsernameValidation((prev) => ({ ...prev, hasChanged: true }));
      checkUsernameAvailability(value);
    }
  };

  const checkUsernameAvailability = async (username: string) => {
    if (!username.trim()) {
      setUsernameValidation({
        isChecking: false,
        isAvailable: true,
        message: "",
        hasChanged: false,
      });
      return;
    }

    setUsernameValidation((prev) => ({ ...prev, isChecking: true }));

    try {
      const response = await fetch("/api/profile/check-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          currentUserId: user.id,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setUsernameValidation({
          isChecking: false,
          isAvailable: result.isAvailable,
          message: result.message,
          hasChanged: true,
        });
      } else {
        setUsernameValidation({
          isChecking: false,
          isAvailable: false,
          message: "Error checking username availability",
          hasChanged: true,
        });
      }
    } catch (error) {
      setUsernameValidation({
        isChecking: false,
        isAvailable: false,
        message: "Failed to check username availability",
        hasChanged: true,
      });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setFormData((prev) => ({ ...prev, avatarUrl: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.firstName.trim()) {
      alert("First name cannot be empty");
      return;
    }

    if (!formData.lastName.trim()) {
      alert("Last name cannot be empty");
      return;
    }

    if (!formData.username.trim()) {
      alert("Username cannot be empty");
      return;
    }

    // Check if username has changed and validate availability
    if (formData.username !== user.username) {
      if (usernameValidation.isChecking) {
        alert("Please wait while we check username availability");
        return;
      }

      if (!usernameValidation.isAvailable) {
        alert("Username is not available. Please choose a different username.");
        return;
      }
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
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          avatarUrl: avatarFile
            ? await uploadAvatar(avatarFile)
            : formData.avatarUrl,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update profile");
      }

      const result = await response.json();
      console.log("Profile update response:", result);

      // Validate the response structure
      if (!result.user) {
        console.error("Response missing user property:", result);
        throw new Error("Invalid response format from server");
      }

      setIsEditing(false);

      // Update the form data with the response
      setFormData((prev) => ({
        ...prev,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        username: result.user.username,
        email: result.user.email,
        avatarUrl: result.user.avatarUrl,
      }));

      // Clear the avatar file since it's now uploaded
      setAvatarFile(null);
      setAvatarPreview(null);

      // You could show a success message here
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert(
        error instanceof Error ? error.message : "Failed to update profile",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      username: user.username || "",
      email: user.email || "",
      avatarUrl: user.avatarUrl || "",
    });
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Profile Information
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Edit Profile
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="h-24 w-24 overflow-hidden rounded-full">
              <img
                src={
                  avatarPreview ||
                  formData.avatarUrl ||
                  "https://placekitten.com/200/200"
                }
                alt="Profile avatar"
                className="h-full w-full object-cover"
              />
            </div>
            {isEditing && (
              <div className="absolute -right-1 -bottom-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-colors hover:bg-blue-700"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            )}
            {isEditing && (avatarFile || formData.avatarUrl) && (
              <button
                type="button"
                onClick={removeAvatar}
                className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-colors hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">
              {formData.firstName} {formData.lastName}
            </h3>
            <p className="text-sm text-gray-600">@{formData.username}</p>
            {isEditing && (
              <p className="mt-2 text-xs text-gray-500">
                Click the camera icon to change your avatar. Supported formats:
                JPG, PNG, GIF
              </p>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm ${
                usernameValidation.hasChanged && !usernameValidation.isChecking
                  ? usernameValidation.isAvailable
                    ? "border-green-500 focus:border-green-500"
                    : "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />
            {usernameValidation.hasChanged && (
              <div className="mt-1 flex items-center space-x-2">
                {usernameValidation.isChecking ? (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                    <span>Checking availability...</span>
                  </div>
                ) : (
                  <div
                    className={`flex items-center space-x-2 text-sm ${
                      usernameValidation.isAvailable
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    <span>{usernameValidation.message}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500">
              {user.email}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Email address cannot be changed
            </p>
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
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

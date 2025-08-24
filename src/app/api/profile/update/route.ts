import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";

interface UpdateProfileRequest {
  userId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  weeklyLearningGoal?: number;
  currentPassword?: string;
  newPassword?: string;
  password?: string;
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as UpdateProfileRequest;
    const {
      userId,
      firstName,
      lastName,
      email,
      username,
      weeklyLearningGoal,
      currentPassword,
      newPassword,
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Verify the user exists and get current session
    const session = await auth();
    if (!session?.user?.id || session.user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updateData: Partial<UpdateProfileRequest> = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (username !== undefined) updateData.username = username;
    if (weeklyLearningGoal !== undefined)
      updateData.weeklyLearningGoal = weeklyLearningGoal;

    // Handle password change if provided
    if (currentPassword && newPassword) {
      // TODO: Implement password verification and hashing
      // For now, we'll just update the password field
      // In production, you'd want to verify the current password and hash the new one
      updateData.password = newPassword;
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        weeklyLearningGoal: true,
        role: true,
        avatarUrl: true,
        notificationPreference: true,
        preferredStudyTime: true,
        currentStreak: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}

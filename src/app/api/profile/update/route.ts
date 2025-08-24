import { NextRequest, NextResponse } from "next/server";

import { db } from "@/server/db";

interface UpdateProfileRequest {
  userId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  weeklyLearningGoal?: number;
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as UpdateProfileRequest;
    const { userId, firstName, lastName, email, username, weeklyLearningGoal } =
      body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const updateData: Partial<UpdateProfileRequest> = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (username !== undefined) updateData.username = username;
    if (weeklyLearningGoal !== undefined)
      updateData.weeklyLearningGoal = weeklyLearningGoal;

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

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}

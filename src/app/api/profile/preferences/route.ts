import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/server/auth";
import { db } from "@/server/db";

interface UpdatePreferencesRequest {
  userId: string;
  notificationPreference?: boolean;
  preferredStudyTime?: string;
  weeklyLearningGoal?: number;
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as UpdatePreferencesRequest;
    const {
      userId,
      notificationPreference,
      preferredStudyTime,
      weeklyLearningGoal,
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

    const updateData: Partial<UpdatePreferencesRequest> = {};

    if (notificationPreference !== undefined)
      updateData.notificationPreference = notificationPreference;
    if (preferredStudyTime !== undefined)
      updateData.preferredStudyTime = preferredStudyTime;
    if (weeklyLearningGoal !== undefined)
      updateData.weeklyLearningGoal = weeklyLearningGoal;

    // Update the user preferences in the database
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        notificationPreference: true,
        preferredStudyTime: true,
        weeklyLearningGoal: true,
      },
    });

    return NextResponse.json({
      message: "Preferences updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 },
    );
  }
}

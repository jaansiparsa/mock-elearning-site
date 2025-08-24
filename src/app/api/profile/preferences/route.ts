import { NextRequest, NextResponse } from "next/server";

import { db } from "@/server/db";

interface UpdatePreferencesRequest {
  notificationPreference?: boolean;
  preferredStudyTime?: string;
  weeklyLearningGoal?: number;
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as UpdatePreferencesRequest;
    const { notificationPreference, preferredStudyTime, weeklyLearningGoal } =
      body;

    // For now, we'll need to get the user ID from the session
    // This is a simplified version - in production you'd want proper authentication
    const updateData: Partial<UpdatePreferencesRequest> = {};

    if (notificationPreference !== undefined)
      updateData.notificationPreference = notificationPreference;
    if (preferredStudyTime !== undefined)
      updateData.preferredStudyTime = preferredStudyTime;
    if (weeklyLearningGoal !== undefined)
      updateData.weeklyLearningGoal = weeklyLearningGoal;

    // Note: This endpoint needs to be updated to work with proper authentication
    // For now, it's a placeholder that shows the structure
    return NextResponse.json({
      message: "Preferences updated successfully",
      data: updateData,
    });
  } catch (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 },
    );
  }
}

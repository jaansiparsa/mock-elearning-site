import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/server/auth";
import { db } from "@/server/db";

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { notificationPreference, preferredStudyTime } = body;

    // Validate study time
    const validStudyTimes = ["morning", "afternoon", "evening", "night"];
    if (preferredStudyTime && !validStudyTimes.includes(preferredStudyTime)) {
      return NextResponse.json(
        { error: "Invalid study time preference" },
        { status: 400 },
      );
    }

    // Update user preferences
    const updatedUser = await db.user.update({
      where: { email: session.user.email },
      data: {
        notificationPreference:
          notificationPreference !== undefined
            ? notificationPreference
            : undefined,
        preferredStudyTime: preferredStudyTime || undefined,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        avatarUrl: true,
        role: true,
        notificationPreference: true,
        preferredStudyTime: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "Preferences updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Preferences update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

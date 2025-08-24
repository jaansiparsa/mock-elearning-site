import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/server/auth";
import { db } from "@/server/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, currentUserId } = body;

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 },
      );
    }

    // Get current session
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Check if username is already taken by another user
    const existingUser = await db.user.findFirst({
      where: {
        username: username,
        id: { not: currentUserId || session.user.id }, // Exclude current user
      },
      select: { id: true, username: true },
    });

    const isAvailable = !existingUser;

    return NextResponse.json({
      username,
      isAvailable,
      message: isAvailable
        ? "Username is available"
        : "Username is already taken",
    });
  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json(
      { error: "Failed to check username availability" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/server/auth";
import bcrypt from "bcryptjs";
import { db } from "@/server/db";

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      firstName?: string;
      lastName?: string;
      username?: string;
      avatarUrl?: string;
      currentPassword?: string;
      newPassword?: string;
    };

    const {
      firstName,
      lastName,
      username,
      avatarUrl,
      currentPassword,
      newPassword,
    } = body;

    // Get current user
    const currentUser = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, password: true, email: true, username: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Validate required fields
    if (!firstName || firstName.trim() === "") {
      return NextResponse.json(
        { error: "First name cannot be empty" },
        { status: 400 },
      );
    }

    if (!lastName || lastName.trim() === "") {
      return NextResponse.json(
        { error: "Last name cannot be empty" },
        { status: 400 },
      );
    }

    if (!username || username.trim() === "") {
      return NextResponse.json(
        { error: "Username cannot be empty" },
        { status: 400 },
      );
    }

    // If changing password, verify current password
    if (newPassword && currentPassword) {
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        currentUser.password,
      );
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 },
        );
      }
    }

    // Check if username is already taken (if changing username)
    if (username && username !== currentUser.username) {
      const existingUser = await db.user.findUnique({
        where: { username },
      });
      if (existingUser) {
        return NextResponse.json(
          { error: "Username is already taken" },
          { status: 400 },
        );
      }
    }

    // Prepare update data
    const updateData: {
      firstName?: string;
      lastName?: string;
      username?: string;
      avatarUrl?: string;
      password?: string;
    } = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (username !== undefined) updateData.username = username;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

    // Hash new password if provided
    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 12);
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id: currentUser.id },
      data: updateData,
      select: {
        id: true,
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
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

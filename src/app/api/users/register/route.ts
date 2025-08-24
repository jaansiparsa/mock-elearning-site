import { StudyTime, UserRole } from "@/types";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/server/db";

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  role?: UserRole;
  preferredStudyTime?: StudyTime;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegisterRequest;
    const {
      email,
      password,
      firstName,
      lastName,
      username,
      role,
      preferredStudyTime,
    } = body;

    // Validation
    if (!email || !password || !firstName || !lastName || !username) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or username already exists" },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        username,
        role: role ?? UserRole.student,
        preferredStudyTime: preferredStudyTime ?? StudyTime.morning,
        notificationPreference: true,
        currentStreak: 0,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        role: true,
        avatarUrl: true,
        notificationPreference: true,
        preferredStudyTime: true,
        createdAt: true,
        currentStreak: true,
      },
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        data: user,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

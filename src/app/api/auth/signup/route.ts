import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import { db } from "@/server/db";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      firstName?: string;
      lastName?: string;
      email?: string;
      username?: string;
      password?: string;
    };
    const { firstName, lastName, email, username, password } = body;

    // Validate input
    if (!firstName || !lastName || !email || !username || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 },
      );
    }

    // Check if user already exists with email
    const existingUserByEmail = await db.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 },
      );
    }

    // Check if username is already taken
    const existingUserByUsername = await db.user.findUnique({
      where: { username },
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 400 },
      );
    }

    // For mock email verification, we'll store the user data temporarily
    // In a real app, you'd send an actual email and store verification codes
    const mockVerificationCode = "123456"; // This would be generated randomly in production

    // Store verification data temporarily (in production, use Redis or database)
    // For now, we'll just return success and let the verification endpoint handle creation

    return NextResponse.json(
      {
        message: "Verification code sent to email",
        mockCode: mockVerificationCode, // Remove this in production
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

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
      verificationCode?: string;
    };
    const { firstName, lastName, email, username, password, verificationCode } =
      body;

    // Validate input
    if (
      !firstName ||
      !lastName ||
      !email ||
      !username ||
      !password ||
      !verificationCode
    ) {
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

    // Mock verification - accept any 6-digit code
    if (!verificationCode.match(/^\d{6}$/)) {
      return NextResponse.json(
        { error: "Verification code must be 6 digits" },
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        username,
        password: hashedPassword,
        role: "student", // Default role
        notificationPreference: true,
        preferredStudyTime: "morning",
      },
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

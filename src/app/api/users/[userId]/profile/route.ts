import { NextRequest, NextResponse } from "next/server";

import { db } from "@/server/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;

    // Get user profile with learning statistics
    const user = await db.user.findUnique({
      where: { id: userId },
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
        lastLearned: true,
        currentStreak: true,
        enrollments: {
          select: {
            course: {
              select: {
                courseId: true,
                title: true,
                category: true,
                difficultyLevel: true,
                thumbnailUrl: true,
              },
            },
            lessonsCompleted: true,
            enrolledAt: true,
          },
        },
        achievements: {
          select: {
            badgeType: true,
            earnedAt: true,
          },
          orderBy: {
            earnedAt: "desc",
          },
        },
        ratings: {
          select: {
            course: {
              select: {
                courseId: true,
                title: true,
              },
            },
            rating: true,
            review: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate learning statistics
    const totalCourses = user.enrollments.length;
    const totalLessonsCompleted = user.enrollments.reduce(
      (sum, enrollment) => sum + enrollment.lessonsCompleted,
      0,
    );
    const totalAchievements = user.achievements.length;
    const averageRating =
      user.ratings.length > 0
        ? user.ratings.reduce((sum, rating) => sum + rating.rating, 0) /
          user.ratings.length
        : 0;

    const profile = {
      ...user,
      statistics: {
        totalCourses,
        totalLessonsCompleted,
        totalAchievements,
        averageRating: Math.round(averageRating * 10) / 10,
        currentStreak: user.currentStreak,
        lastLearned: user.lastLearned,
      },
    };

    return NextResponse.json({ data: profile });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

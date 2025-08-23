import { ACHIEVEMENT_DISPLAY_MAP, AchievementType } from "@/types";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/server/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { studentId: string } },
) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = params.studentId;

    console.log("Fetching achievements for student:", studentId);

    // Get all achievements for the student
    const achievements = await db.achievement.findMany({
      where: {
        studentId: studentId,
      },
      orderBy: {
        earnedAt: "desc",
      },
    });

    console.log("Found achievements:", achievements);

    // Create potential achievements based on the mapping
    const potentialAchievements = Object.values(AchievementType).map((type) => {
      const earned = achievements.some(
        (a) => (a.badgeType as AchievementType) === type,
      );
      const earnedAchievement = achievements.find(
        (a) => (a.badgeType as AchievementType) === type,
      );

      return {
        type,
        earned,
        earnedAt: earnedAchievement?.earnedAt.toISOString(),
      };
    });

    return NextResponse.json({
      achievements: achievements.map((achievement) => ({
        id: achievement.achievementId,
        type: achievement.badgeType as AchievementType,
        earnedAt: achievement.earnedAt.toISOString(),
      })),
      potentialAchievements,
      stats: {
        totalAchievements: achievements.length,
        totalCourses: 0,
        completedCourses: 0,
        currentStreak: 0,
        totalStudyTime: 0,
        highScoringAssignments: 0,
        highScoringQuizzes: 0,
      },
    });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 },
    );
  }
}

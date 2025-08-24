import { ACHIEVEMENT_DISPLAY_MAP, AchievementType } from "@/types";
import type { AchievementUI, PotentialAchievement } from "@/types";
import { Award, Trophy } from "lucide-react";

interface AchievementsSectionProps {
  achievements: AchievementUI[];
  potentialAchievements: PotentialAchievement[];
  longestStreak: number;
}

export default function AchievementsSection({
  achievements,
  potentialAchievements,
  longestStreak,
}: AchievementsSectionProps) {
  return (
    <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-semibold text-gray-900">Achievements</h3>

      {/* Achievements Summary */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Award className="h-5 w-5 text-yellow-500" />
          <span className="text-gray-700">
            {achievements.length} achievements earned
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-orange-500" />
          <span className="text-gray-700">
            Longest streak: {longestStreak} days
          </span>
        </div>
      </div>

      {/* Progress Badges */}
      <div className="mt-8">
        <h4 className="text-md mb-4 font-medium text-gray-800">
          Progress Badges
        </h4>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {potentialAchievements.map((achievement) => {
            const displayInfo = ACHIEVEMENT_DISPLAY_MAP[achievement.type];
            return (
              <div
                key={achievement.type}
                className={`relative flex flex-col items-center rounded-lg border-2 p-4 text-center transition-all ${
                  achievement.earned
                    ? "border-green-300 bg-green-50"
                    : "border-dashed border-gray-200 bg-gray-50"
                }`}
              >
                <div className="mb-2 text-3xl">{displayInfo.icon}</div>
                <h5 className="mb-1 text-sm font-medium text-gray-900">
                  {displayInfo.title}
                </h5>
                <p className="text-xs text-gray-600">
                  {displayInfo.description}
                </p>

                {/* Achievement indicator */}
                {achievement.earned && (
                  <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                    <span className="text-xs text-white">✓</span>
                  </div>
                )}

                {/* Additional info for earned achievements */}
                {achievement.earned && achievement.earnedAt && (
                  <div className="mt-2 text-xs text-green-600">
                    Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                  </div>
                )}

                {/* Progress info for unearned achievements */}
                {!achievement.earned && (
                  <div className="mt-2 text-xs text-gray-500">
                    {achievement.type === AchievementType.FIRST_COURSE &&
                      "Complete a course to earn this"}
                    {achievement.type === AchievementType.SEVEN_DAY_STREAK &&
                      `Current streak: ${achievement.currentStreak} days`}
                    {achievement.type === AchievementType.HIGH_SCORER &&
                      "Get 90%+ on assignments"}
                    {achievement.type === AchievementType.COURSE_COMPLETER &&
                      "Complete multiple courses"}
                    {achievement.type === AchievementType.QUIZ_MASTER &&
                      "Get 90%+ on quizzes"}
                    {achievement.type === AchievementType.STUDY_CHAMPION &&
                      "Study more to earn this"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="mt-8">
        <h4 className="text-md mb-4 font-medium text-gray-800">
          Recent Achievements
        </h4>
        <div className="space-y-3">
          {achievements.slice(0, 3).map((achievement) => {
            const displayInfo = ACHIEVEMENT_DISPLAY_MAP[achievement.type];
            return (
              <div
                key={achievement.id}
                className="flex items-center space-x-3 rounded-lg bg-green-50 p-3"
              >
                <div className="text-2xl">{displayInfo.icon}</div>
                <div className="flex-1">
                  <h5 className="text-sm font-medium text-gray-900">
                    {displayInfo.title}
                  </h5>
                  <p className="text-xs text-gray-600">
                    Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Basic API Response types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export enum HTTPStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}

// E-Learning Platform Enums
export enum UserRole {
  student = "student",
  instructor = "instructor",
  admin = "admin",
}

export enum StudyTime {
  morning = "morning",
  afternoon = "afternoon",
  evening = "evening",
  night = "night",
}

export enum CourseCategory {
  programming = "programming",
  design = "design",
  business = "business",
  marketing = "marketing",
  science = "science",
  humanities = "humanities",
  technology = "technology",
  arts = "arts",
  health = "health",
  finance = "finance",
}

export enum DifficultyLevel {
  beginner = "beginner",
  intermediate = "intermediate",
  advanced = "advanced",
}

// Assignment status values (used directly as strings)
// "not_started", "in_progress", "completed", "graded", "overdue"

export enum BadgeType {
  first_course = "first_course",
  seven_day_streak = "seven_day_streak",
  high_scorer = "high_scorer",
  early_bird = "early_bird",
  perfect_score = "perfect_score",
  course_completer = "course_completer",
  streak_master = "streak_master",
  social_learner = "social_learner",
}

// Type interfaces for better type safety
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  role: UserRole;
  avatarUrl?: string;
  notificationPreference: boolean;
  preferredStudyTime: StudyTime;
  createdAt: Date;
  updatedAt: Date;
  lastLearned?: Date;
  currentStreak: number;
  weeklyLearningGoal: number;
}

export interface Course {
  courseId: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  category: CourseCategory;
  difficultyLevel: DifficultyLevel;
  instructorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  lessonId: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  estimatedTime: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseEnrollment {
  enrollmentId: string;
  studentId: string;
  courseId: string;
  lessonsCompleted: number;
  enrolledAt: Date;
}

export interface CourseRating {
  ratingId: string;
  courseId: string;
  studentId: string;
  rating: number;
  review?: string;
  createdAt: Date;
}

export interface Assignment {
  assignmentId: string;
  courseId: string;
  lessonId?: string;
  title: string;
  description: string;
  points: number;
  rubricUrl?: string;
  createdAt: Date;
}

export interface AssignmentSubmission {
  submissionId: string;
  studentId: string;
  assignmentId: string;
  startedAt?: Date;
  endedAt?: Date;
  grade?: number;
  feedback?: string;
  submissionContent?: string; // Student's submission text/notes
  fileUrl?: string; // URL to uploaded file
  fileName?: string; // Original filename
  assignedAt: Date;
  dueDate: Date;
  status: string; // "not_started", "in_progress", "completed", "graded", "overdue"
  submittedAt?: Date; // When the submission was made
}

export interface Achievement {
  achievementId: string;
  studentId: string;
  badgeType: BadgeType;
  earnedAt: Date;
}

export interface QuizSubmission {
  submissionId: string;
  quizId: string;
  studentId: string;
  score: number;
  submittedAt: Date;
}

// Extended types with relationships
export interface CourseWithInstructor extends Course {
  instructor: Pick<User, "id" | "firstName" | "lastName" | "avatarUrl">;
}

export interface EnrollmentWithProgress extends CourseEnrollment {
  course: Course;
  totalLessons: number;
  progressPercent: number;
  estimatedTimeRemaining: number; // in minutes
}

export interface AssignmentWithSubmission extends Assignment {
  submission?: AssignmentSubmission;
}

export interface CourseWithStats extends Course {
  averageRating: number;
  totalEnrollments: number;
  totalLessons: number;
  instructor: Pick<User, "id" | "firstName" | "lastName" | "avatarUrl">;
}

export enum AchievementType {
  FIRST_COURSE = "first_course",
  SEVEN_DAY_STREAK = "seven_day_streak",
  HIGH_SCORER = "high_scorer",
  COURSE_COMPLETER = "course_completer",
  QUIZ_MASTER = "quiz_master",
  STUDY_CHAMPION = "study_champion",
}

export const ACHIEVEMENT_DISPLAY_MAP = {
  [AchievementType.FIRST_COURSE]: {
    title: "First Course Completed",
    description: "Complete your first course",
    icon: "🎓",
  },
  [AchievementType.SEVEN_DAY_STREAK]: {
    title: "7-Day Streak",
    description: "Maintain a 7-day learning streak",
    icon: "🔥",
  },
  [AchievementType.HIGH_SCORER]: {
    title: "High Scorer",
    description: "Achieve 90%+ on assignments",
    icon: "⭐",
  },
  [AchievementType.COURSE_COMPLETER]: {
    title: "Course Completer",
    description: "Complete multiple courses",
    icon: "✅",
  },
  [AchievementType.QUIZ_MASTER]: {
    title: "Quiz Master",
    description: "Achieve 90%+ on quizzes",
    icon: "🧠",
  },
  [AchievementType.STUDY_CHAMPION]: {
    title: "Study Champion",
    description: "Accumulate significant study time",
    icon: "⏰",
  },
} as const;

export interface AchievementUI {
  id: string;
  type: AchievementType;
  earnedAt: string;
}

export interface PotentialAchievement {
  type: AchievementType;
  earned: boolean;
  earnedAt?: string;
  courseName?: string;
  currentStreak?: number;
  highScores?: number;
  coursesCompleted?: number;
  studyTime?: number;
}

export interface WeeklyGoalProgress {
  completed: number;
  goal: number;
  percentage: number;
  remaining: number;
  isOnTrack: boolean;
}

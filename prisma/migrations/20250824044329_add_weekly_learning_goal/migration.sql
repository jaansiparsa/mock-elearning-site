/*
  Warnings:

  - You are about to drop the column `isQuiz` on the `AssignmentSubmission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN "timeLimit" INTEGER;

-- CreateTable
CREATE TABLE "QuizSubmission" (
    "submissionId" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "startedAt" DATETIME,
    "endedAt" DATETIME,
    "score" REAL,
    "maxScore" REAL NOT NULL,
    "feedback" TEXT,
    "answers" TEXT,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "submittedAt" DATETIME,
    CONSTRAINT "QuizSubmission_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("quizId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "QuizSubmission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AssignmentSubmission" (
    "submissionId" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "startedAt" DATETIME,
    "endedAt" DATETIME,
    "grade" REAL,
    "feedback" TEXT,
    "submissionContent" TEXT,
    "fileUrl" TEXT,
    "fileName" TEXT,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "submittedAt" DATETIME,
    CONSTRAINT "AssignmentSubmission_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment" ("assignmentId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AssignmentSubmission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AssignmentSubmission" ("assignedAt", "assignmentId", "dueDate", "endedAt", "feedback", "fileName", "fileUrl", "grade", "startedAt", "status", "studentId", "submissionContent", "submissionId", "submittedAt") SELECT "assignedAt", "assignmentId", "dueDate", "endedAt", "feedback", "fileName", "fileUrl", "grade", "startedAt", "status", "studentId", "submissionContent", "submissionId", "submittedAt" FROM "AssignmentSubmission";
DROP TABLE "AssignmentSubmission";
ALTER TABLE "new_AssignmentSubmission" RENAME TO "AssignmentSubmission";
CREATE INDEX "AssignmentSubmission_studentId_assignmentId_idx" ON "AssignmentSubmission"("studentId", "assignmentId");
CREATE INDEX "AssignmentSubmission_assignmentId_idx" ON "AssignmentSubmission"("assignmentId");
CREATE INDEX "AssignmentSubmission_studentId_idx" ON "AssignmentSubmission"("studentId");
CREATE INDEX "AssignmentSubmission_status_idx" ON "AssignmentSubmission"("status");
CREATE INDEX "AssignmentSubmission_dueDate_idx" ON "AssignmentSubmission"("dueDate");
CREATE INDEX "AssignmentSubmission_submittedAt_idx" ON "AssignmentSubmission"("submittedAt");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'student',
    "avatarUrl" TEXT NOT NULL DEFAULT 'https://placekitten.com/200/200',
    "notificationPreference" BOOLEAN NOT NULL DEFAULT true,
    "preferredStudyTime" TEXT NOT NULL DEFAULT 'morning',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastLearned" DATETIME,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "weeklyLearningGoal" INTEGER NOT NULL DEFAULT 300
);
INSERT INTO "new_User" ("avatarUrl", "createdAt", "currentStreak", "email", "firstName", "id", "lastLearned", "lastName", "notificationPreference", "password", "preferredStudyTime", "role", "updatedAt", "username") SELECT "avatarUrl", "createdAt", "currentStreak", "email", "firstName", "id", "lastLearned", "lastName", "notificationPreference", "password", "preferredStudyTime", "role", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_username_idx" ON "User"("username");
CREATE INDEX "User_role_idx" ON "User"("role");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "QuizSubmission_studentId_quizId_idx" ON "QuizSubmission"("studentId", "quizId");

-- CreateIndex
CREATE INDEX "QuizSubmission_quizId_idx" ON "QuizSubmission"("quizId");

-- CreateIndex
CREATE INDEX "QuizSubmission_studentId_idx" ON "QuizSubmission"("studentId");

-- CreateIndex
CREATE INDEX "QuizSubmission_status_idx" ON "QuizSubmission"("status");

-- CreateIndex
CREATE INDEX "QuizSubmission_dueDate_idx" ON "QuizSubmission"("dueDate");

-- CreateIndex
CREATE INDEX "QuizSubmission_submittedAt_idx" ON "QuizSubmission"("submittedAt");

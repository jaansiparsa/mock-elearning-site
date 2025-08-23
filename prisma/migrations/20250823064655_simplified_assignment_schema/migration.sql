/*
  Warnings:

  - You are about to drop the `GivenAssignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `dueDate` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `fileUrl` on the `AssignmentSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `rubricUrl` on the `AssignmentSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `submittedAt` on the `AssignmentSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `LearningEvent` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `LearningEvent` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `LearningEvent` table. All the data in the column will be lost.
  - The primary key for the `ProgressSummary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `averageQuizScore` on the `ProgressSummary` table. All the data in the column will be lost.
  - You are about to drop the column `averageSessionLength` on the `ProgressSummary` table. All the data in the column will be lost.
  - You are about to drop the column `currentStreak` on the `ProgressSummary` table. All the data in the column will be lost.
  - You are about to drop the column `longestStreak` on the `ProgressSummary` table. All the data in the column will be lost.
  - You are about to drop the column `summaryId` on the `ProgressSummary` table. All the data in the column will be lost.
  - You are about to drop the column `totalAchievements` on the `ProgressSummary` table. All the data in the column will be lost.
  - You are about to drop the column `totalCoursesCompleted` on the `ProgressSummary` table. All the data in the column will be lost.
  - You are about to drop the column `totalSessions` on the `ProgressSummary` table. All the data in the column will be lost.
  - You are about to drop the column `totalStudyHours` on the `ProgressSummary` table. All the data in the column will be lost.
  - You are about to drop the column `activityType` on the `StudySession` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `StudySession` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `StudySession` table. All the data in the column will be lost.
  - Added the required column `dueDate` to the `AssignmentSubmission` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `ProgressSummary` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `duration` on table `StudySession` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "GivenAssignment_studentId_assignmentId_key";

-- DropIndex
DROP INDEX "GivenAssignment_dueDate_idx";

-- DropIndex
DROP INDEX "GivenAssignment_status_idx";

-- DropIndex
DROP INDEX "GivenAssignment_lessonId_idx";

-- DropIndex
DROP INDEX "GivenAssignment_courseId_idx";

-- DropIndex
DROP INDEX "GivenAssignment_studentId_idx";

-- DropIndex
DROP INDEX "GivenAssignment_assignmentId_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GivenAssignment";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Assignment" (
    "assignmentId" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "lessonId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "rubricUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Assignment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("courseId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Assignment_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("lessonId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Assignment" ("assignmentId", "courseId", "createdAt", "description", "points", "title") SELECT "assignmentId", "courseId", "createdAt", "description", "points", "title" FROM "Assignment";
DROP TABLE "Assignment";
ALTER TABLE "new_Assignment" RENAME TO "Assignment";
CREATE INDEX "Assignment_courseId_idx" ON "Assignment"("courseId");
CREATE INDEX "Assignment_lessonId_idx" ON "Assignment"("lessonId");
CREATE TABLE "new_AssignmentSubmission" (
    "submissionId" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "startedAt" DATETIME,
    "endedAt" DATETIME,
    "grade" REAL,
    "feedback" TEXT,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    CONSTRAINT "AssignmentSubmission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AssignmentSubmission_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment" ("assignmentId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AssignmentSubmission" ("assignmentId", "feedback", "grade", "status", "studentId", "submissionId") SELECT "assignmentId", "feedback", "grade", "status", "studentId", "submissionId" FROM "AssignmentSubmission";
DROP TABLE "AssignmentSubmission";
ALTER TABLE "new_AssignmentSubmission" RENAME TO "AssignmentSubmission";
CREATE INDEX "AssignmentSubmission_assignmentId_idx" ON "AssignmentSubmission"("assignmentId");
CREATE INDEX "AssignmentSubmission_studentId_idx" ON "AssignmentSubmission"("studentId");
CREATE INDEX "AssignmentSubmission_status_idx" ON "AssignmentSubmission"("status");
CREATE INDEX "AssignmentSubmission_dueDate_idx" ON "AssignmentSubmission"("dueDate");
CREATE UNIQUE INDEX "AssignmentSubmission_studentId_assignmentId_key" ON "AssignmentSubmission"("studentId", "assignmentId");
CREATE TABLE "new_LearningEvent" (
    "eventId" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "lessonId" TEXT,
    "assignmentId" TEXT,
    "eventType" TEXT NOT NULL,
    "eventData" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LearningEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LearningEvent_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("courseId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LearningEvent_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("lessonId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LearningEvent_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment" ("assignmentId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_LearningEvent" ("assignmentId", "courseId", "eventId", "eventType", "lessonId", "userId") SELECT "assignmentId", "courseId", "eventId", "eventType", "lessonId", "userId" FROM "LearningEvent";
DROP TABLE "LearningEvent";
ALTER TABLE "new_LearningEvent" RENAME TO "LearningEvent";
CREATE INDEX "LearningEvent_userId_idx" ON "LearningEvent"("userId");
CREATE INDEX "LearningEvent_courseId_idx" ON "LearningEvent"("courseId");
CREATE INDEX "LearningEvent_lessonId_idx" ON "LearningEvent"("lessonId");
CREATE INDEX "LearningEvent_assignmentId_idx" ON "LearningEvent"("assignmentId");
CREATE INDEX "LearningEvent_eventType_idx" ON "LearningEvent"("eventType");
CREATE TABLE "new_ProgressSummary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "totalCoursesEnrolled" INTEGER NOT NULL DEFAULT 0,
    "totalLessonsCompleted" INTEGER NOT NULL DEFAULT 0,
    "totalAssignmentsCompleted" INTEGER NOT NULL DEFAULT 0,
    "averageGrade" REAL NOT NULL DEFAULT 0,
    "totalStudyTime" INTEGER NOT NULL DEFAULT 0,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProgressSummary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProgressSummary" ("lastUpdated", "totalAssignmentsCompleted", "totalCoursesEnrolled", "totalLessonsCompleted", "userId") SELECT "lastUpdated", "totalAssignmentsCompleted", "totalCoursesEnrolled", "totalLessonsCompleted", "userId" FROM "ProgressSummary";
DROP TABLE "ProgressSummary";
ALTER TABLE "new_ProgressSummary" RENAME TO "ProgressSummary";
CREATE UNIQUE INDEX "ProgressSummary_userId_key" ON "ProgressSummary"("userId");
CREATE INDEX "ProgressSummary_userId_idx" ON "ProgressSummary"("userId");
CREATE TABLE "new_StudySession" (
    "sessionId" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "lessonId" TEXT,
    "assignmentId" TEXT,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "duration" INTEGER NOT NULL,
    "notes" TEXT,
    CONSTRAINT "StudySession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StudySession_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("courseId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StudySession_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("lessonId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StudySession_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment" ("assignmentId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_StudySession" ("assignmentId", "courseId", "duration", "endTime", "lessonId", "sessionId", "startTime", "userId") SELECT "assignmentId", "courseId", "duration", "endTime", "lessonId", "sessionId", "startTime", "userId" FROM "StudySession";
DROP TABLE "StudySession";
ALTER TABLE "new_StudySession" RENAME TO "StudySession";
CREATE INDEX "StudySession_userId_idx" ON "StudySession"("userId");
CREATE INDEX "StudySession_courseId_idx" ON "StudySession"("courseId");
CREATE INDEX "StudySession_lessonId_idx" ON "StudySession"("lessonId");
CREATE INDEX "StudySession_assignmentId_idx" ON "StudySession"("assignmentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

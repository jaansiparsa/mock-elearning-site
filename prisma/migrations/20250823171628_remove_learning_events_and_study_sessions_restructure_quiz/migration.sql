/*
  Warnings:

  - You are about to drop the `LearningEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuizSubmission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudySession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "LearningEvent_eventType_idx";

-- DropIndex
DROP INDEX "LearningEvent_assignmentId_idx";

-- DropIndex
DROP INDEX "LearningEvent_lessonId_idx";

-- DropIndex
DROP INDEX "LearningEvent_courseId_idx";

-- DropIndex
DROP INDEX "LearningEvent_userId_idx";

-- DropIndex
DROP INDEX "QuizSubmission_studentId_idx";

-- DropIndex
DROP INDEX "QuizSubmission_quizId_idx";

-- DropIndex
DROP INDEX "StudySession_assignmentId_idx";

-- DropIndex
DROP INDEX "StudySession_lessonId_idx";

-- DropIndex
DROP INDEX "StudySession_courseId_idx";

-- DropIndex
DROP INDEX "StudySession_userId_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "LearningEvent";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "QuizSubmission";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "StudySession";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Quiz" (
    "quizId" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "totalQuestions" INTEGER NOT NULL DEFAULT 0,
    "passingScore" REAL NOT NULL DEFAULT 70.0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Quiz_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("courseId") ON DELETE CASCADE ON UPDATE CASCADE
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
    "isQuiz" BOOLEAN NOT NULL DEFAULT false,
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
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Quiz_courseId_idx" ON "Quiz"("courseId");

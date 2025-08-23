/*
  Warnings:

  - You are about to drop the `ProgressSummary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `passingScore` on the `Quiz` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ProgressSummary_userId_idx";

-- DropIndex
DROP INDEX "ProgressSummary_userId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ProgressSummary";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Quiz" (
    "quizId" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "totalQuestions" INTEGER NOT NULL DEFAULT 0,
    "totalPoints" INTEGER NOT NULL DEFAULT 100,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Quiz_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("courseId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Quiz" ("courseId", "createdAt", "description", "quizId", "title", "totalQuestions", "updatedAt") SELECT "courseId", "createdAt", "description", "quizId", "title", "totalQuestions", "updatedAt" FROM "Quiz";
DROP TABLE "Quiz";
ALTER TABLE "new_Quiz" RENAME TO "Quiz";
CREATE INDEX "Quiz_courseId_idx" ON "Quiz"("courseId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

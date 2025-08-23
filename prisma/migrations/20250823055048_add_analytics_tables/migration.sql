-- CreateTable
CREATE TABLE "StudySession" (
    "sessionId" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "lessonId" TEXT,
    "assignmentId" TEXT,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "duration" INTEGER,
    "activityType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "metadata" TEXT,
    CONSTRAINT "StudySession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StudySession_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("courseId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StudySession_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("lessonId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "StudySession_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment" ("assignmentId") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LearningEvent" (
    "eventId" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "sessionId" TEXT,
    "courseId" TEXT NOT NULL,
    "lessonId" TEXT,
    "assignmentId" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" TEXT,
    CONSTRAINT "LearningEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LearningEvent_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("courseId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LearningEvent_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("lessonId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "LearningEvent_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment" ("assignmentId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "LearningEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "StudySession" ("sessionId") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProgressSummary" (
    "summaryId" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalStudyHours" REAL NOT NULL DEFAULT 0,
    "totalSessions" INTEGER NOT NULL DEFAULT 0,
    "totalCoursesEnrolled" INTEGER NOT NULL DEFAULT 0,
    "totalCoursesCompleted" INTEGER NOT NULL DEFAULT 0,
    "totalLessonsCompleted" INTEGER NOT NULL DEFAULT 0,
    "totalAssignmentsCompleted" INTEGER NOT NULL DEFAULT 0,
    "averageQuizScore" REAL NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "averageSessionLength" REAL NOT NULL DEFAULT 0,
    "totalAchievements" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ProgressSummary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "StudySession_userId_idx" ON "StudySession"("userId");

-- CreateIndex
CREATE INDEX "StudySession_courseId_idx" ON "StudySession"("courseId");

-- CreateIndex
CREATE INDEX "StudySession_startTime_idx" ON "StudySession"("startTime");

-- CreateIndex
CREATE INDEX "StudySession_status_idx" ON "StudySession"("status");

-- CreateIndex
CREATE INDEX "LearningEvent_userId_idx" ON "LearningEvent"("userId");

-- CreateIndex
CREATE INDEX "LearningEvent_eventType_idx" ON "LearningEvent"("eventType");

-- CreateIndex
CREATE INDEX "LearningEvent_timestamp_idx" ON "LearningEvent"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "ProgressSummary_userId_key" ON "ProgressSummary"("userId");

-- CreateIndex
CREATE INDEX "ProgressSummary_userId_idx" ON "ProgressSummary"("userId");

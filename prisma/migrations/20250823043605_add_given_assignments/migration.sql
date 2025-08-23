-- CreateTable
CREATE TABLE "GivenAssignment" (
    "givenAssignmentId" TEXT NOT NULL PRIMARY KEY,
    "assignmentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "lessonId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" DATETIME NOT NULL,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "grade" REAL,
    "feedback" TEXT,
    "notes" TEXT,
    CONSTRAINT "GivenAssignment_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment" ("assignmentId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GivenAssignment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GivenAssignment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("courseId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GivenAssignment_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("lessonId") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "GivenAssignment_assignmentId_idx" ON "GivenAssignment"("assignmentId");

-- CreateIndex
CREATE INDEX "GivenAssignment_studentId_idx" ON "GivenAssignment"("studentId");

-- CreateIndex
CREATE INDEX "GivenAssignment_courseId_idx" ON "GivenAssignment"("courseId");

-- CreateIndex
CREATE INDEX "GivenAssignment_lessonId_idx" ON "GivenAssignment"("lessonId");

-- CreateIndex
CREATE INDEX "GivenAssignment_status_idx" ON "GivenAssignment"("status");

-- CreateIndex
CREATE INDEX "GivenAssignment_dueDate_idx" ON "GivenAssignment"("dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "GivenAssignment_studentId_assignmentId_key" ON "GivenAssignment"("studentId", "assignmentId");

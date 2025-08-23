-- DropIndex
DROP INDEX "AssignmentSubmission_studentId_assignmentId_key";

-- CreateIndex
CREATE INDEX "AssignmentSubmission_studentId_assignmentId_idx" ON "AssignmentSubmission"("studentId", "assignmentId");

-- CreateIndex
CREATE INDEX "AssignmentSubmission_submittedAt_idx" ON "AssignmentSubmission"("submittedAt");

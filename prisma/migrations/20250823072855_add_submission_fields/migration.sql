-- AlterTable
ALTER TABLE "AssignmentSubmission" ADD COLUMN "fileName" TEXT;
ALTER TABLE "AssignmentSubmission" ADD COLUMN "fileUrl" TEXT;
ALTER TABLE "AssignmentSubmission" ADD COLUMN "submissionContent" TEXT;
ALTER TABLE "AssignmentSubmission" ADD COLUMN "submittedAt" DATETIME;

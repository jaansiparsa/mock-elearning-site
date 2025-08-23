"use client";

import {
  BookOpen,
  Clock,
  FileText,
  MessageSquare,
  Star,
  Upload,
  X,
} from "lucide-react";

import { useState } from "react";

interface AssignmentDetailModalProps {
  assignment: {
    assignmentId: string;
    title: string;
    description: string;
    dueDate: Date;
    points: number;
    status: string;
    courseTitle: string;
    courseId: string;
    lessonTitle?: string;
    lessonId?: string;
    grade?: number;
    feedback?: string;
    notes?: string;
    assignedAt: Date;
    startedAt?: Date;
    completedAt?: Date;
    isOverdue: boolean;
    isDueToday: boolean;
    isDueThisWeek: boolean;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

interface FileUpload {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

interface SubmissionHistory {
  id: string;
  status: string;
  submittedAt: Date;
  feedback?: string;
  grade?: number;
  rubricScores?: { [key: string]: number };
}

export default function AssignmentDetailModal({
  assignment,
  isOpen,
  onClose,
}: AssignmentDetailModalProps) {
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [submissionHistory] = useState<SubmissionHistory[]>([
    {
      id: "1",
      status: "submitted",
      submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      feedback:
        "Great work on the analysis section. Consider adding more examples in the conclusion.",
      grade: 85,
      rubricScores: {
        "Content Quality": 8,
        "Technical Accuracy": 9,
        Presentation: 7,
        Originality: 8,
      },
    },
  ]);

  if (!assignment) return null;

  const handleFileUpload = (files: FileList) => {
    const newFiles: FileUpload[] = Array.from(files).map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "not_started":
        return "bg-gray-100 text-gray-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "submitted":
        return "bg-yellow-100 text-yellow-800";
      case "graded":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "not_started":
        return "Not Started";
      case "in_progress":
        return "In Progress";
      case "submitted":
        return "Submitted";
      case "graded":
        return "Graded";
      default:
        return "Unknown";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {assignment.title}
            </h2>
            <p className="text-gray-600">{assignment.courseTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 transition-colors hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Assignment Overview */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Due Date
                </span>
              </div>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {assignment.dueDate.toLocaleDateString()}
              </p>
              {assignment.isOverdue && (
                <span className="text-sm text-red-600">Overdue</span>
              )}
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Points
                </span>
              </div>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {assignment.points} pts
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Status
                </span>
              </div>
              <span
                className={`mt-1 inline-flex rounded-full px-2 py-1 text-sm font-medium ${getStatusColor(assignment.status)}`}
              >
                {getStatusText(assignment.status)}
              </span>
            </div>
          </div>

          {/* Assignment Description */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Description & Requirements
            </h3>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="whitespace-pre-wrap text-gray-700">
                {assignment.description}
              </p>
            </div>
          </div>

          {/* File Upload Interface */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Submit Assignment
            </h3>
            <div
              className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                isDragOver
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="mb-2 text-lg font-medium text-gray-700">
                Drag and drop files here, or click to browse
              </p>
              <p className="mb-4 text-gray-500">
                Supported formats: PDF, DOC, DOCX, TXT, ZIP, RAR (Max 50MB)
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.txt,.zip,.rar"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex cursor-pointer items-center rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Choose Files
              </label>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-md mb-2 font-medium text-gray-900">
                  Uploaded Files
                </h4>
                <div className="space-y-2">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)} •{" "}
                            {file.uploadedAt.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submission History */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Submission History
            </h3>
            <div className="space-y-4">
              {submissionHistory.map((submission) => (
                <div key={submission.id} className="rounded-lg bg-gray-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-sm font-medium ${getStatusColor(submission.status)}`}
                      >
                        {getStatusText(submission.status)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {submission.submittedAt.toLocaleString()}
                      </span>
                    </div>
                    {submission.grade && (
                      <span className="text-lg font-bold text-gray-900">
                        {submission.grade}%
                      </span>
                    )}
                  </div>

                  {submission.feedback && (
                    <div className="mb-3">
                      <h5 className="mb-1 text-sm font-medium text-gray-700">
                        Feedback
                      </h5>
                      <p className="text-sm text-gray-600">
                        {submission.feedback}
                      </p>
                    </div>
                  )}

                  {submission.rubricScores && (
                    <div>
                      <h5 className="mb-2 text-sm font-medium text-gray-700">
                        Rubric Scores
                      </h5>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(submission.rubricScores).map(
                          ([criterion, score]) => (
                            <div
                              key={criterion}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-gray-600">{criterion}</span>
                              <span className="font-medium text-gray-900">
                                {score}/10
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Related Course Materials */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Related Course Materials
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="mb-2 flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    Course Textbook
                  </span>
                </div>
                <p className="text-sm text-blue-800">
                  Chapter 5: Advanced Concepts (Pages 120-150)
                </p>
              </div>

              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="mb-2 flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">
                    Lecture Slides
                  </span>
                </div>
                <p className="text-sm text-green-800">
                  Week 8: Assignment Guidelines & Examples
                </p>
              </div>

              <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                <div className="mb-2 flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-purple-900">
                    Discussion Forum
                  </span>
                </div>
                <p className="text-sm text-purple-800">
                  Q&A Thread: Common Questions & Solutions
                </p>
              </div>

              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                <div className="mb-2 flex items-center space-x-2">
                  <Star className="h-5 w-5 text-orange-600" />
                  <span className="font-medium text-orange-900">
                    Sample Solutions
                  </span>
                </div>
                <p className="text-sm text-orange-800">
                  Previous Year: High-Scoring Examples
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
            <button
              onClick={onClose}
              className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
            >
              Close
            </button>
            <button className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
              Submit Assignment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

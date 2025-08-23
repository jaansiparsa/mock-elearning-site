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
    submissionId: string | null;
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

interface AssignmentTimelineItem {
  id: string;
  status: string;
  date: Date;
  label: string;
  description: string;
  grade?: number;
  feedback?: string;
}

export default function AssignmentDetailModal({
  assignment,
  isOpen,
  onClose,
}: AssignmentDetailModalProps) {
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  if (!assignment) return null;

  // Generate assignment timeline based on actual AssignmentSubmission data
  const generateAssignmentTimeline = (): AssignmentTimelineItem[] => {
    const timeline: AssignmentTimelineItem[] = [];

    // Add assigned date
    timeline.push({
      id: "assigned",
      status: "assigned",
      date: assignment.assignedAt,
      label: "Assignment Assigned",
      description: `Assigned on ${assignment.assignedAt.toLocaleDateString()}`,
    });

    // Add started date if exists
    if (assignment.startedAt) {
      timeline.push({
        id: "started",
        status: "in_progress",
        date: assignment.startedAt,
        label: "Work Started",
        description: `Started working on ${assignment.startedAt.toLocaleDateString()}`,
      });
    }

    // Add completed date if exists and assignment is completed/graded
    if (
      assignment.completedAt &&
      (assignment.status === "graded" || assignment.status === "completed")
    ) {
      timeline.push({
        id: "completed",
        status: "graded",
        date: assignment.completedAt,
        label: "Assignment Completed",
        description: `Completed on ${assignment.completedAt.toLocaleDateString()}`,
        grade: assignment.grade,
        feedback: assignment.feedback,
      });
    }

    // If assignment is in progress, add progress entry
    if (assignment.status === "in_progress" && !assignment.completedAt) {
      timeline.push({
        id: "in_progress",
        status: "in_progress",
        date: assignment.startedAt ?? new Date(),
        label: "Work In Progress",
        description: "Currently working on this assignment",
      });
    }

    // Sort by date (newest first)
    return timeline.sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const assignmentTimeline = generateAssignmentTimeline();

  // Generate related course materials based on actual course
  const generateRelatedMaterials = () => {
    const materials: Array<{
      id: string;
      icon: typeof BookOpen;
      color: "blue" | "green" | "purple" | "orange";
      title: string;
      description: string;
    }> = [
      {
        id: "textbook",
        icon: BookOpen,
        color: "blue",
        title: "Course Textbook",
        description: `${assignment.courseTitle} - Chapter ${Math.floor(Math.random() * 10) + 1}: Key Concepts`,
      },
      {
        id: "slides",
        icon: FileText,
        color: "green",
        title: "Lecture Slides",
        description: `Week ${Math.floor(Math.random() * 12) + 1}: ${assignment.title} Guidelines`,
      },
      {
        id: "forum",
        icon: MessageSquare,
        color: "purple",
        title: "Discussion Forum",
        description: `Q&A Thread: ${assignment.title} - Common Questions`,
      },
      {
        id: "examples",
        icon: Star,
        color: "orange",
        title: "Sample Solutions",
        description: `Previous Year: High-Scoring ${assignment.title} Examples`,
      },
    ];

    return materials;
  };

  const relatedMaterials = generateRelatedMaterials();

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
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "graded":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "assigned":
        return "Assignment Assigned";
      case "in_progress":
        return "Work Started";
      case "completed":
        return "Assignment Completed";
      case "graded":
        return "Assignment Graded";
      case "overdue":
        return "Assignment Overdue";
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
            {assignment.lessonTitle && (
              <p className="text-sm text-gray-500">
                Lesson: {assignment.lessonTitle}
              </p>
            )}
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
              {assignment.isDueToday && (
                <span className="text-sm text-orange-600">Due Today</span>
              )}
              {assignment.isDueThisWeek && !assignment.isDueToday && (
                <span className="text-sm text-yellow-600">Due This Week</span>
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
              {assignment.grade !== undefined && assignment.grade !== null && (
                <p className="text-sm text-green-600">
                  Grade: {assignment.grade}/{assignment.points} (
                  {Math.round((assignment.grade / assignment.points) * 100)}%)
                </p>
              )}
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

          {/* File Upload Interface - Only show if not graded/completed */}
          {assignment.status !== "graded" &&
            assignment.status !== "completed" && (
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
            )}

          {/* Assignment Timeline - Based on actual AssignmentSubmission data */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Assignment Timeline
            </h3>
            <div className="space-y-4">
              {assignmentTimeline.map((item, index) => (
                <div key={item.id} className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        item.status === "assigned"
                          ? "bg-blue-100 text-blue-600"
                          : item.status === "in_progress"
                            ? "bg-yellow-100 text-yellow-600"
                            : item.status === "completed" ||
                                item.status === "graded"
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-gray-900">
                          {item.label}
                        </h5>
                        <span className="text-sm text-gray-500">
                          {item.date.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>

                      {/* Show grade and feedback if available */}
                      {item.grade !== undefined && item.grade !== null && (
                        <div className="mt-2">
                          <span className="text-sm font-medium text-green-600">
                            Grade: {item.grade}/{assignment.points} (
                            {Math.round((item.grade / assignment.points) * 100)}
                            %)
                          </span>
                        </div>
                      )}

                      {item.feedback && (
                        <div className="mt-2">
                          <h6 className="text-sm font-medium text-gray-700">
                            Feedback:
                          </h6>
                          <p className="text-sm text-gray-600">
                            {item.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related Course Materials - Dynamic based on course */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Related Course Materials
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {relatedMaterials.map((material) => {
                const IconComponent = material.icon;
                const colorClasses = {
                  blue: "bg-blue-50 border-blue-200 text-blue-900",
                  green: "bg-green-50 border-green-200 text-green-900",
                  purple: "bg-purple-50 border-purple-200 text-purple-900",
                  orange: "bg-orange-50 border-orange-200 text-orange-900",
                };
                const iconColorClasses = {
                  blue: "text-blue-600",
                  green: "text-green-600",
                  purple: "text-purple-600",
                  orange: "text-orange-600",
                };

                return (
                  <div
                    key={material.id}
                    className={`rounded-lg border p-4 ${colorClasses[material.color]}`}
                  >
                    <div className="mb-2 flex items-center space-x-2">
                      <IconComponent
                        className={`h-5 w-5 ${iconColorClasses[material.color]}`}
                      />
                      <span className="font-medium">{material.title}</span>
                    </div>
                    <p className="text-sm opacity-80">{material.description}</p>
                  </div>
                );
              })}
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
            {assignment.status !== "graded" &&
              assignment.status !== "completed" &&
              uploadedFiles.length > 0 && (
                <button className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                  Submit Assignment
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

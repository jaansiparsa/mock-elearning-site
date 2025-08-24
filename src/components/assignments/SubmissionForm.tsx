"use client";

import { useState } from "react";

interface SubmissionFormProps {
  assignmentId: string;
  latestSubmission: any | null;
  onSubmit: (content: string, file: File | null) => Promise<void>;
}

export default function SubmissionForm({
  assignmentId,
  latestSubmission,
  onSubmit,
}: SubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionContent, setSubmissionContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleSubmit = async () => {
    if (!submissionContent.trim() && !selectedFile) return;

    setIsSubmitting(true);
    try {
      await onSubmit(submissionContent, selectedFile);
      // Reset form after successful submission
      setSubmissionContent("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error submitting assignment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Submit Your Work
        </h2>
        {latestSubmission && (
          <span className="text-sm text-gray-500">
            This will create a new submission
          </span>
        )}
      </div>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="submission-content"
            className="block text-sm font-medium text-gray-700"
          >
            Additional Notes (Optional)
          </label>
          <textarea
            id="submission-content"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Add any additional notes or comments about your submission..."
            value={submissionContent}
            onChange={(e) => setSubmissionContent(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload File
          </label>
          <div
            className={`mt-1 flex justify-center rounded-md border-2 border-dashed p-6 ${
              dragActive
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-2 text-center">
              {selectedFile ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="h-8 w-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm text-gray-900">
                    {selectedFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-blue-600 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:outline-none hover:text-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileInput}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX, TXT, or image files up to 10MB
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={
              isSubmitting || (!submissionContent.trim() && !selectedFile)
            }
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Submitting..."
              : latestSubmission
                ? "Submit New Version"
                : "Submit Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Grid3X3, List } from "lucide-react";

export type ViewMode = "grid" | "list";

interface CourseViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
}

export default function CourseViewToggle({
  viewMode,
  onViewModeChange,
  className = "",
}: CourseViewToggleProps) {
  return (
    <div className={`flex items-center space-x-1 rounded-lg border border-gray-200 bg-white p-1 ${className}`}>
      <button
        onClick={() => onViewModeChange("grid")}
        className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          viewMode === "grid"
            ? "bg-blue-100 text-blue-700"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <Grid3X3 className="h-4 w-4" />
        <span>Grid</span>
      </button>
      <button
        onClick={() => onViewModeChange("list")}
        className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          viewMode === "list"
            ? "bg-blue-100 text-blue-700"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <List className="h-4 w-4" />
        <span>List</span>
      </button>
    </div>
  );
}

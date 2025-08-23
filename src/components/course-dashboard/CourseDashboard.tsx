"use client";

import { useState, useMemo } from "react";
import CourseViewToggle, { type ViewMode } from "./CourseViewToggle";
import CourseFilters from "./CourseFilters";
import CourseGrid from "./CourseGrid";
import CourseList from "./CourseList";
import type { CourseCategory, DifficultyLevel } from "@prisma/client";

interface CourseDashboardProps {
  enrollments: Array<{
    enrollmentId: string;
    lessonsCompleted: number;
    enrolledAt: Date;
    course: {
      courseId: string;
      title: string;
      description: string;
      thumbnailUrl?: string;
      category: string;
      difficultyLevel: string;
      instructor: {
        firstName: string;
        lastName: string;
        username: string;
      };
      lessons: Array<{
        lessonId: string;
        order: number;
        estimatedTime: number;
      }>;
      ratings: Array<{
        rating: number;
      }>;
    };
  }>;
  className?: string;
}

export default function CourseDashboard({ enrollments, className = "" }: CourseDashboardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory | undefined>();
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | undefined>();

  // Get unique categories from enrollments
  const categories = useMemo(() => {
    const uniqueCategories = new Set(enrollments.map(e => e.course.category));
    return Array.from(uniqueCategories) as CourseCategory[];
  }, [enrollments]);

  // Filter enrollments based on search and filters
  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((enrollment) => {
      const course = enrollment.course;
      
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          course.title.toLowerCase().includes(searchLower) ||
          course.description.toLowerCase().includes(searchLower) ||
          `${course.instructor.firstName} ${course.instructor.lastName}`.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }
      
      // Category filter
      if (selectedCategory && course.category !== selectedCategory) {
        return false;
      }
      
      // Difficulty filter
      if (selectedDifficulty && course.difficultyLevel !== selectedDifficulty) {
        return false;
      }
      
      return true;
    });
  }, [enrollments, searchQuery, selectedCategory, selectedDifficulty]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(undefined);
    setSelectedDifficulty(undefined);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
          <p className="text-gray-600">
            {filteredEnrollments.length} of {enrollments.length} courses
          </p>
        </div>
        <CourseViewToggle
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* Filters */}
      <CourseFilters
        categories={categories}
        selectedCategory={selectedCategory}
        selectedDifficulty={selectedDifficulty}
        searchQuery={searchQuery}
        onCategoryChange={setSelectedCategory}
        onDifficultyChange={setSelectedDifficulty}
        onSearchChange={setSearchQuery}
        onClearFilters={handleClearFilters}
      />

      {/* Course Display */}
      {viewMode === "grid" ? (
        <CourseGrid enrollments={filteredEnrollments} />
      ) : (
        <CourseList enrollments={filteredEnrollments} />
      )}

      {/* No Results Message */}
      {filteredEnrollments.length === 0 && enrollments.length > 0 && (
        <div className="text-center py-12">
          <div className="mb-4 text-6xl">🔍</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No courses match your filters
          </h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or clearing the filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

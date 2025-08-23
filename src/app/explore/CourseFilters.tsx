"use client";

import type { CourseCategory, DifficultyLevel } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface CourseFiltersProps {
  searchParams: {
    category?: string;
    difficulty?: string;
    search?: string;
  };
}

const CATEGORIES: { value: CourseCategory; label: string; icon: string }[] = [
  { value: "programming", label: "Programming", icon: "💻" },
  { value: "design", label: "Design", icon: "🎨" },
  { value: "business", label: "Business", icon: "💼" },
  { value: "marketing", label: "Marketing", icon: "📈" },
  { value: "science", label: "Science", icon: "🔬" },
  { value: "language", label: "Language", icon: "🗣️" },
  { value: "music", label: "Music", icon: "🎵" },
  { value: "art", label: "Art", icon: "🖼️" },
  { value: "other", label: "Other", icon: "✨" },
];

const DIFFICULTIES: { value: DifficultyLevel; label: string; icon: string }[] =
  [
    { value: "beginner", label: "Beginner", icon: "🌱" },
    { value: "intermediate", label: "Intermediate", icon: "🚀" },
    { value: "advanced", label: "Advanced", icon: "🔥" },
  ];

export default function CourseFilters({ searchParams }: CourseFiltersProps) {
  const router = useRouter();
  const searchParamsUrl = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.search || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.category ? [searchParams.category] : [],
  );
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(
    searchParams.difficulty ? [searchParams.difficulty] : [],
  );

  // Update URL when filters change
  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParamsUrl);

    // Reset to page 1 when filters change
    params.set("page", "1");

    Object.entries(updates).forEach(([key, value]) => {
      if (value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`/explore?${params.toString()}`);
  };

  // Handle search with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== searchParams.search) {
        updateFilters({ search: searchTerm });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      const newCategories = [...selectedCategories, category];
      setSelectedCategories(newCategories);
      updateFilters({ category: newCategories.join(",") });
    } else {
      const newCategories = selectedCategories.filter((c) => c !== category);
      setSelectedCategories(newCategories);
      updateFilters({
        category: newCategories.length > 0 ? newCategories.join(",") : "all",
      });
    }
  };

  const handleDifficultyChange = (difficulty: string, checked: boolean) => {
    if (checked) {
      const newDifficulties = [...selectedDifficulties, difficulty];
      setSelectedDifficulties(newDifficulties);
      updateFilters({ difficulty: newDifficulties.join(",") });
    } else {
      const newDifficulties = selectedDifficulties.filter(
        (d) => d !== difficulty,
      );
      setSelectedDifficulties(newDifficulties);
      updateFilters({
        difficulty:
          newDifficulties.length > 0 ? newDifficulties.join(",") : "all",
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    router.push("/explore");
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedDifficulties.length > 0 ||
    searchTerm;

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label
          htmlFor="search"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Search Courses
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search courses..."
            className="block w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-10 leading-5 placeholder-gray-500 focus:border-blue-500 focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:text-sm"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-gray-900">Category</h3>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <label key={category.value} className="flex items-center">
              <input
                type="checkbox"
                name="category"
                value={category.value}
                checked={selectedCategories.includes(category.value)}
                onChange={(e) =>
                  handleCategoryChange(category.value, e.target.checked)
                }
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {category.icon} {category.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Difficulty Filter */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-gray-900">
          Difficulty Level
        </h3>
        <div className="space-y-2">
          {DIFFICULTIES.map((difficulty) => (
            <label key={difficulty.value} className="flex items-center">
              <input
                type="checkbox"
                name="difficulty"
                value={difficulty.value}
                checked={selectedDifficulties.includes(difficulty.value)}
                onChange={(e) =>
                  handleDifficultyChange(difficulty.value, e.target.checked)
                }
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {difficulty.icon} {difficulty.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div>
          <button
            onClick={clearFilters}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

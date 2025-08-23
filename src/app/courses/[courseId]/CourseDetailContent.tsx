"use client";

import type { CourseCategory, DifficultyLevel } from "@prisma/client";
import {
  CourseHeader,
  CurriculumTab,
  ReviewsTab,
  TabNavigation,
  TabType,
} from "./components";

import { useState } from "react";

interface CourseDetailContentProps {
  course: {
    courseId: string;
    title: string;
    description: string;
    thumbnailUrl?: string;
    category: CourseCategory;
    difficultyLevel: DifficultyLevel;
    instructor: {
      id: string;
      firstName: string;
      lastName: string;
      username: string;
      avatarUrl?: string;
    };
    lessons: Array<{
      lessonId: string;
      title: string;
      description: string;
      order: number;
      estimatedTime: number;
    }>;
    ratings: Array<{
      rating: number;
      review?: string;
      student: {
        firstName: string;
        lastName: string;
        username: string;
      };
      createdAt: Date;
    }>;
    assignments: Array<{
      assignmentId: string;
      title: string;
      description: string;
      points: number;
      createdAt: Date;
    }>;
    prerequisites: Array<{
      courseId: string;
      title: string;
      description: string;
      thumbnailUrl?: string;
      category: CourseCategory;
      difficultyLevel: DifficultyLevel;
    }>;
    totalLessons: number;
    totalTime: number;
    averageRating: number;
    totalRatings: number;
    totalEnrollments: number;
    totalAssignments: number;
    isEnrolled: boolean;
    completedLessonIds?: string[];
  };
}

export default function CourseDetailContent({
  course,
}: CourseDetailContentProps) {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.CURRICULUM);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Course Header */}
      <CourseHeader course={course} />

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        {activeTab === TabType.CURRICULUM && (
          <CurriculumTab
            lessons={course.lessons}
            totalLessons={course.totalLessons}
            totalTime={course.totalTime}
            courseId={course.courseId}
            completedLessonIds={course.completedLessonIds ?? []}
          />
        )}

        {activeTab === TabType.REVIEWS && (
          <ReviewsTab
            ratings={course.ratings}
            averageRating={course.averageRating}
            totalRatings={course.totalRatings}
          />
        )}
      </div>
    </div>
  );
}

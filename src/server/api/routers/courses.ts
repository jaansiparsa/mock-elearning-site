import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const coursesRouter = createTRPCRouter({
  // Get all courses with filtering and pagination
  getAll: publicProcedure
    .input(z.object({
      category: z.enum(["programming", "design", "business", "marketing", "finance", "health", "language", "music", "photography", "cooking"]).optional(),
      difficultyLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
      instructorId: z.string().optional(),
      searchQuery: z.string().optional(),
      minRating: z.number().min(0).max(5).optional(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ ctx, input }) => {
      try {
        const skip = (input.page - 1) * input.limit;
        
        // Build where clause
        const where: any = {};
        
        if (input.category) where.category = input.category;
        if (input.difficultyLevel) where.difficultyLevel = input.difficultyLevel;
        if (input.instructorId) where.instructorId = input.instructorId;
        if (input.searchQuery) {
          where.OR = [
            { title: { contains: input.searchQuery, mode: "insensitive" } },
            { description: { contains: input.searchQuery, mode: "insensitive" } },
          ];
        }

        const [courses, total] = await Promise.all([
          ctx.db.course.findMany({
            where,
            include: {
              instructor: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  username: true,
                  avatarUrl: true,
                },
              },
              lessons: {
                select: {
                  lessonId: true,
                  order: true,
                  estimatedTime: true,
                },
                orderBy: { order: "asc" },
              },
              ratings: {
                select: {
                  rating: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: input.limit,
          }),
          ctx.db.course.count({ where }),
        ]);

        // Calculate average ratings and add progress info for enrolled users
        const coursesWithStats = courses.map(course => {
          const totalLessons = course.lessons.length;
          const totalTime = course.lessons.reduce((acc, lesson) => acc + lesson.estimatedTime, 0);
          const averageRating = course.ratings.length > 0 
            ? course.ratings.reduce((acc, r) => acc + r.rating, 0) / course.ratings.length 
            : 0;

          return {
            ...course,
            totalLessons,
            totalTime,
            averageRating,
            totalRatings: course.ratings.length,
          };
        });

        // Filter by minimum rating if specified
        const filteredCourses = input.minRating 
          ? coursesWithStats.filter(course => course.averageRating >= input.minRating!)
          : coursesWithStats;

        return {
          success: true,
          courses: filteredCourses,
          pagination: {
            page: input.page,
            limit: input.limit,
            total,
            totalPages: Math.ceil(total / input.limit),
          },
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch courses",
          cause: error,
        });
      }
    }),

  // Get course by ID with full details
  getById: publicProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const course = await ctx.db.course.findUnique({
          where: { courseId: input.courseId },
          include: {
            instructor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                avatarUrl: true,
                preferredStudyTime: true,
              },
            },
            lessons: {
              orderBy: { order: "asc" },
            },
            ratings: {
              include: {
                student: {
                  select: {
                    firstName: true,
                    lastName: true,
                    username: true,
                    avatarUrl: true,
                  },
                },
              },
              orderBy: { createdAt: "desc" },
            },
            assignments: {
              orderBy: { dueDate: "asc" },
            },
          },
        });

        if (!course) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Course not found",
          });
        }

        // Calculate course statistics
        const totalLessons = course.lessons.length;
        const totalTime = course.lessons.reduce((acc, lesson) => acc + lesson.estimatedTime, 0);
        const averageRating = course.ratings.length > 0 
          ? course.ratings.reduce((acc, r) => acc + r.rating, 0) / course.ratings.length 
          : 0;

        return {
          success: true,
          course: {
            ...course,
            totalLessons,
            totalTime,
            averageRating,
            totalRatings: course.ratings.length,
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch course",
          cause: error,
        });
      }
    }),

  // Create new course (instructors only)
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().min(10),
      thumbnailUrl: z.string().url(),
      category: z.enum(["programming", "design", "business", "marketing", "finance", "health", "language", "music", "photography", "cooking"]),
      prerequisites: z.array(z.string()).default([]),
      difficultyLevel: z.enum(["beginner", "intermediate", "advanced"]),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if user is instructor
        if (ctx.session.user.role !== "instructor" && ctx.session.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only instructors can create courses",
          });
        }

        const course = await ctx.db.course.create({
          data: {
            ...input,
            instructorId: ctx.session.user.id,
          },
          include: {
            instructor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        });

        return {
          success: true,
          course,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create course",
          cause: error,
        });
      }
    }),

  // Update course (instructor who created it or admin)
  update: protectedProcedure
    .input(z.object({
      courseId: z.string(),
      title: z.string().min(1).optional(),
      description: z.string().min(10).optional(),
      thumbnailUrl: z.string().url().optional(),
      category: z.enum(["programming", "design", "business", "marketing", "finance", "health", "language", "music", "photography", "cooking"]).optional(),
      prerequisites: z.array(z.string()).optional(),
      difficultyLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { courseId, ...updateData } = input;

        // Check if course exists and user has permission
        const existingCourse = await ctx.db.course.findUnique({
          where: { courseId },
          select: { instructorId: true },
        });

        if (!existingCourse) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Course not found",
          });
        }

        if (existingCourse.instructorId !== ctx.session.user.id && ctx.session.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You can only update courses you created",
          });
        }

        const updatedCourse = await ctx.db.course.update({
          where: { courseId },
          data: updateData,
          include: {
            instructor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        });

        return {
          success: true,
          course: updatedCourse,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update course",
          cause: error,
        });
      }
    }),

  // Delete course (instructor who created it or admin)
  delete: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if course exists and user has permission
        const existingCourse = await ctx.db.course.findUnique({
          where: { courseId: input.courseId },
          select: { instructorId: true },
        });

        if (!existingCourse) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Course not found",
          });
        }

        if (existingCourse.instructorId !== ctx.session.user.id && ctx.session.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You can only delete courses you created",
          });
        }

        await ctx.db.course.delete({
          where: { courseId: input.courseId },
        });

        return {
          success: true,
          message: "Course deleted successfully",
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete course",
          cause: error,
        });
      }
    }),

  // Enroll in a course
  enroll: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if user is a student
        if (ctx.session.user.role !== "student") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only students can enroll in courses",
          });
        }

        // Check if course exists
        const course = await ctx.db.course.findUnique({
          where: { courseId: input.courseId },
        });

        if (!course) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Course not found",
          });
        }

        // Check if already enrolled
        const existingEnrollment = await ctx.db.courseEnrollment.findUnique({
          where: {
            studentId_courseId: {
              studentId: ctx.session.user.id,
              courseId: input.courseId,
            },
          },
        });

        if (existingEnrollment) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You are already enrolled in this course",
          });
        }

        const enrollment = await ctx.db.courseEnrollment.create({
          data: {
            studentId: ctx.session.user.id,
            courseId: input.courseId,
          },
          include: {
            course: true,
          },
        });

        return {
          success: true,
          enrollment,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to enroll in course",
          cause: error,
        });
      }
    }),

  // Get user's enrolled courses
  getEnrolled: protectedProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ ctx, input }) => {
      try {
        // Check if user is a student
        if (ctx.session.user.role !== "student") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only students can view enrolled courses",
          });
        }

        const skip = (input.page - 1) * input.limit;

        const [enrollments, total] = await Promise.all([
          ctx.db.courseEnrollment.findMany({
            where: { studentId: ctx.session.user.id },
            include: {
              course: {
                include: {
                  instructor: {
                    select: {
                      firstName: true,
                      lastName: true,
                      username: true,
                    },
                  },
                  lessons: {
                    select: {
                      lessonId: true,
                      order: true,
                      estimatedTime: true,
                    },
                    orderBy: { order: "asc" },
                  },
                },
              },
            },
            orderBy: { enrolledAt: "desc" },
            skip,
            take: input.limit,
          }),
          ctx.db.courseEnrollment.count({
            where: { studentId: ctx.session.user.id },
          }),
        ]);

        // Calculate progress for each course
        const enrollmentsWithProgress = enrollments.map(enrollment => {
          const totalLessons = enrollment.course.lessons.length;
          const progressPercent = totalLessons > 0 
            ? Math.round((enrollment.lessonsCompleted / totalLessons) * 100)
            : 0;
          const estimatedTimeRemaining = enrollment.course.lessons
            .slice(enrollment.lessonsCompleted)
            .reduce((acc, lesson) => acc + lesson.estimatedTime, 0);

          return {
            ...enrollment,
            progressPercent,
            estimatedTimeRemaining,
            totalLessons,
          };
        });

        return {
          success: true,
          enrollments: enrollmentsWithProgress,
          pagination: {
            page: input.page,
            limit: input.limit,
            total,
            totalPages: Math.ceil(total / input.limit),
          },
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch enrolled courses",
          cause: error,
        });
      }
    }),

  // Rate a course
  rate: protectedProcedure
    .input(z.object({
      courseId: z.string(),
      rating: z.number().min(1).max(5),
      review: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if user is a student
        if (ctx.session.user.role !== "student") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only students can rate courses",
          });
        }

        // Check if course exists
        const course = await ctx.db.course.findUnique({
          where: { courseId: input.courseId },
        });

        if (!course) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Course not found",
          });
        }

        // Check if already rated
        const existingRating = await ctx.db.courseRating.findUnique({
          where: {
            studentId_courseId: {
              studentId: ctx.session.user.id,
              courseId: input.courseId,
            },
          },
        });

        let rating;
        if (existingRating) {
          // Update existing rating
          rating = await ctx.db.courseRating.update({
            where: { ratingId: existingRating.ratingId },
            data: {
              rating: input.rating,
              review: input.review,
            },
          });
        } else {
          // Create new rating
          rating = await ctx.db.courseRating.create({
            data: {
              courseId: input.courseId,
              studentId: ctx.session.user.id,
              rating: input.rating,
              review: input.review,
            },
          });
        }

        return {
          success: true,
          rating,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to rate course",
          cause: error,
        });
      }
    }),
});

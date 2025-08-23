import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/server/auth";
import { db } from "@/server/db";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin (optional security check)
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    console.log("Starting to fix existing enrollments...");

    // Get all enrollments
    const enrollments = await db.courseEnrollment.findMany({
      include: {
        course: {
          include: {
            assignments: {
              orderBy: { createdAt: "asc" },
            },
            lessons: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    let totalCreated = 0;
    let totalEnrollments = 0;

    for (const enrollment of enrollments) {
      const course = enrollment.course;
      totalEnrollments++;

      // Check if GivenAssignment records already exist for this enrollment
      const existingGivenAssignments = await db.givenAssignment.findMany({
        where: {
          studentId: enrollment.studentId,
          courseId: enrollment.courseId,
        },
      });

      // Only create if no GivenAssignment records exist
      if (
        existingGivenAssignments.length === 0 &&
        course.assignments.length > 0
      ) {
        for (let i = 0; i < course.assignments.length; i++) {
          const assignment = course.assignments[i];
          const lesson = course.lessons[i] ?? null;

          await db.givenAssignment.create({
            data: {
              studentId: enrollment.studentId,
              courseId: enrollment.courseId,
              assignmentId: assignment.assignmentId,
              lessonId: lesson?.lessonId || null,
              status: "not_started",
              dueDate: assignment.dueDate,
              assignedAt: enrollment.enrolledAt,
            },
          });

          totalCreated++;
        }

        console.log(
          `Created ${course.assignments.length} GivenAssignment records for student ${enrollment.studentId} in course ${course.title}`,
        );
      }
    }

    console.log(`Total enrollments processed: ${totalEnrollments}`);
    console.log(`Total GivenAssignment records created: ${totalCreated}`);

    return NextResponse.json({
      message: "Successfully fixed existing enrollments",
      totalEnrollments,
      totalCreated,
    });
  } catch (error) {
    console.error("Error fixing existing enrollments:", error);
    return NextResponse.json(
      { error: "Failed to fix existing enrollments" },
      { status: 500 },
    );
  }
}

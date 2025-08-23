import { db } from "@/server/db";

/**
 * Creates GivenAssignment records for all assignments in a course when a user enrolls
 * @param studentId - The ID of the student enrolling
 * @param courseId - The ID of the course being enrolled in
 * @param enrollmentEndDate - The end date of the enrollment (due date for assignments)
 */
export async function createGivenAssignmentsForEnrollment(
  studentId: string,
  courseId: string,
  enrollmentEndDate: Date,
) {
  try {
    // Get all assignments for the course
    const courseAssignments = await db.assignment.findMany({
      where: { courseId },
      include: {
        course: {
          include: {
            lessons: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    // Create GivenAssignment records for each assignment
    const givenAssignments = await Promise.all(
      courseAssignments.map(async (assignment, index) => {
        // Find the corresponding lesson (if any) based on assignment order
        const lesson = assignment.course.lessons[index] ?? null;

        return db.givenAssignment.create({
          data: {
            studentId,
            courseId,
            assignmentId: assignment.assignmentId,
            lessonId: lesson?.lessonId ?? null,
            status: "not_started",
            dueDate: enrollmentEndDate,
            assignedAt: new Date(),
          },
        });
      }),
    );

    console.log(
      `Created ${givenAssignments.length} given assignments for student ${studentId} in course ${courseId}`,
    );

    return givenAssignments;
  } catch (error) {
    console.error("Error creating given assignments:", error);
    throw error;
  }
}

/**
 * Retroactively creates GivenAssignment records for existing enrollments
 * This ensures that students who are already enrolled see all assignments
 */
export async function createGivenAssignmentsForExistingEnrollments() {
  try {
    console.log("Creating GivenAssignment records for existing enrollments...");

    // Get all enrollments that don't have GivenAssignment records
    const enrollmentsWithoutAssignments = await db.courseEnrollment.findMany({
      where: {
        // Find enrollments where no GivenAssignment records exist
        course: {
          assignments: {
            some: {
              // This will find courses that have assignments
            },
          },
        },
      },
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

    for (const enrollment of enrollmentsWithoutAssignments) {
      const course = enrollment.course;

      // Check if GivenAssignment records already exist for this enrollment
      const existingGivenAssignments = await db.givenAssignment.findMany({
        where: {
          studentId: enrollment.studentId,
          courseId: enrollment.courseId,
        },
      });

      // Only create if no GivenAssignment records exist
      if (existingGivenAssignments.length === 0) {
        for (let i = 0; i < course.assignments.length; i++) {
          const assignment = course.assignments[i];
          const lesson = course.lessons[i] || null;

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

    console.log(`Total GivenAssignment records created: ${totalCreated}`);
    return totalCreated;
  } catch (error) {
    console.error(
      "Error creating GivenAssignment records for existing enrollments:",
      error,
    );
    throw error;
  }
}

/**
 * Updates the status of a GivenAssignment
 * @param givenAssignmentId - The ID of the GivenAssignment to update
 * @param status - The new status
 * @param additionalData - Optional additional data like grade, feedback, etc.
 */
export async function updateGivenAssignmentStatus(
  givenAssignmentId: string,
  status: string,
  additionalData?: {
    grade?: number;
    feedback?: string;
    notes?: string;
    startedAt?: Date;
    completedAt?: Date;
  },
) {
  try {
    const updateData: {
      status: string;
      grade?: number;
      feedback?: string;
      notes?: string;
      startedAt?: Date;
      completedAt?: Date;
    } = { status };

    if (additionalData?.grade !== undefined) {
      updateData.grade = additionalData.grade;
    }
    if (additionalData?.feedback !== undefined) {
      updateData.feedback = additionalData.feedback;
    }
    if (additionalData?.notes !== undefined) {
      updateData.notes = additionalData.notes;
    }
    if (additionalData?.startedAt !== undefined) {
      updateData.startedAt = additionalData.startedAt;
    }
    if (additionalData?.completedAt !== undefined) {
      updateData.completedAt = additionalData.completedAt;
    }

    // Set startedAt if status is in_progress and not already set
    if (status === "in_progress" && !updateData.startedAt) {
      updateData.startedAt = new Date();
    }

    // Set completedAt if status is completed and not already set
    if (status === "completed" && !updateData.completedAt) {
      updateData.completedAt = new Date();
    }

    const updatedAssignment = await db.givenAssignment.update({
      where: { givenAssignmentId },
      data: updateData,
    });

    console.log(
      `Updated GivenAssignment ${givenAssignmentId} status to ${status}`,
    );

    return updatedAssignment;
  } catch (error) {
    console.error("Error updating given assignment status:", error);
    throw error;
  }
}

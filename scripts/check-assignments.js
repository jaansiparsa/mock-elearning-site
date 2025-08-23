import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAssignments() {
  try {
    console.log('=== Checking Database State ===\n');

    // Check total courses
    const totalCourses = await prisma.course.count();
    console.log(`Total courses: ${totalCourses}`);

    // Check total assignments
    const totalAssignments = await prisma.assignment.count();
    console.log(`Total assignments: ${totalAssignments}`);

    // Check total enrollments
    const totalEnrollments = await prisma.courseEnrollment.count();
    console.log(`Total enrollments: ${totalEnrollments}`);

    // Check total given assignments
    const totalGivenAssignments = await prisma.givenAssignment.count();
    console.log(`Total given assignments: ${totalGivenAssignments}`);

    // Check assignments per course
    const coursesWithAssignments = await prisma.course.findMany({
      include: {
        _count: {
          select: {
            assignments: true,
            enrollments: true,
          },
        },
      },
    });

    console.log('\n=== Assignments per Course ===');
    coursesWithAssignments.forEach(course => {
      console.log(`${course.title}: ${course._count.assignments} assignments, ${course._count.enrollments} enrollments`);
    });

    // Check enrollments per student
    const studentsWithEnrollments = await prisma.user.findMany({
      where: {
        role: 'student',
      },
      include: {
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    console.log('\n=== Enrollments per Student ===');
    studentsWithEnrollments.forEach(student => {
      console.log(`${student.firstName} ${student.lastName}: ${student._count.enrollments} enrollments`);
    });

    // Check given assignments per student
    const studentsWithGivenAssignments = await prisma.user.findMany({
      where: {
        role: 'student',
      },
      include: {
        _count: {
          select: {
            givenAssignments: true,
          },
        },
      },
    });

    console.log('\n=== Given Assignments per Student ===');
    studentsWithGivenAssignments.forEach(student => {
      console.log(`${student.firstName} ${student.lastName}: ${student._count.givenAssignments} given assignments`);
    });

  } catch (error) {
    console.error('Error checking assignments:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAssignments();

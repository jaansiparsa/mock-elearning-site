import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Clear existing data
  console.log("Clearing existing data...");
  await prisma.learningEvent.deleteMany();
  await prisma.studySession.deleteMany();
  await prisma.lessonCompletion.deleteMany();
  await prisma.assignmentSubmission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.courseRating.deleteMany();
  await prisma.courseEnrollment.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.quizSubmission.deleteMany();
  await prisma.progressSummary.deleteMany();
  await prisma.user.deleteMany();
  await prisma.course.deleteMany();

  // Create users
  console.log("Creating users...");
  const users = [
    {
      email: "john.doe@example.com",
      password: "$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0wSdbqK/1m6", // password123
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
      role: "student",
      avatarUrl: "https://placekitten.com/200/200",
      notificationPreference: true,
      preferredStudyTime: "morning",
      currentStreak: 5,
    },
    {
      email: "jane.smith@example.com",
      password: "$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0wSdbqK/1m6", // password123
      firstName: "Jane",
      lastName: "Smith",
      username: "janesmith",
      role: "student",
      avatarUrl: "https://placekitten.com/201/201",
      notificationPreference: false,
      preferredStudyTime: "evening",
      currentStreak: 3,
    },
    {
      email: "prof.wilson@example.com",
      password: "$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0wSdbqK/1m6", // password123
      firstName: "Professor",
      lastName: "Wilson",
      username: "profwilson",
      role: "instructor",
      avatarUrl: "https://placekitten.com/202/202",
      notificationPreference: true,
      preferredStudyTime: "morning",
      currentStreak: 0,
    },
    {
      email: "admin@example.com",
      password: "$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0wSdbqK/1m6", // password123
      firstName: "Admin",
      lastName: "User",
      username: "admin",
      role: "admin",
      avatarUrl: "https://placekitten.com/203/203",
      notificationPreference: true,
      preferredStudyTime: "morning",
      currentStreak: 0,
    },
  ];

  const createdUsers = [];
  for (const userData of users) {
    const user = await prisma.user.create({
      data: userData,
    });
    createdUsers.push(user);
    console.log(`Created user: ${user.username} (${user.role})`);
  }

  const [student1, student2, instructor1, admin] = createdUsers;

  // Create courses
  console.log("Creating courses...");
  const courses = [
    {
      title: "JavaScript Fundamentals",
      description:
        "Learn the basics of JavaScript programming including variables, functions, and control structures.",
      thumbnailUrl: "https://placekitten.com/400/300",
      category: "programming",
      difficultyLevel: "beginner",
      instructorId: instructor1.id,
    },
    {
      title: "Advanced React Development",
      description:
        "Master React hooks, context, and advanced patterns for building scalable applications.",
      thumbnailUrl: "https://placekitten.com/401/301",
      category: "programming",
      difficultyLevel: "advanced",
      instructorId: instructor1.id,
    },
    {
      title: "Digital Marketing Strategy",
      description:
        "Learn modern digital marketing techniques including SEO, social media, and content marketing.",
      thumbnailUrl: "https://placekitten.com/402/302",
      category: "marketing",
      difficultyLevel: "intermediate",
      instructorId: instructor1.id,
    },
    {
      title: "UI/UX Design Principles",
      description:
        "Master the fundamentals of user interface and user experience design.",
      thumbnailUrl: "https://placekitten.com/403/303",
      category: "design",
      difficultyLevel: "intermediate",
      instructorId: instructor1.id,
    },
    {
      title: "Business Finance Fundamentals",
      description:
        "Understand key financial concepts for business decision making.",
      thumbnailUrl: "https://placekitten.com/404/304",
      category: "business",
      difficultyLevel: "beginner",
      instructorId: instructor1.id,
    },
  ];

  const createdCourses = [];
  for (const courseData of courses) {
    const course = await prisma.course.create({
      data: courseData,
    });
    createdCourses.push(course);
    console.log(`Created course: ${course.title}`);
  }

  // Create lessons
  console.log("Creating lessons...");
  const lessons = [
    // JavaScript Fundamentals lessons
    {
      courseId: createdCourses[0].courseId,
      title: "Introduction to JavaScript",
      description:
        "Learn what JavaScript is and how to set up your development environment.",
      order: 1,
      estimatedTime: 30,
    },
    {
      courseId: createdCourses[0].courseId,
      title: "Variables and Data Types",
      description:
        "Understand variables, strings, numbers, and basic data types in JavaScript.",
      order: 2,
      estimatedTime: 45,
    },
    {
      courseId: createdCourses[0].courseId,
      title: "Functions and Scope",
      description:
        "Learn how to create and use functions, and understand variable scope.",
      order: 3,
      estimatedTime: 60,
    },
    // Advanced React lessons
    {
      courseId: createdCourses[1].courseId,
      title: "React Hooks Deep Dive",
      description: "Master useState, useEffect, and custom hooks in React.",
      order: 1,
      estimatedTime: 90,
    },
    {
      courseId: createdCourses[1].courseId,
      title: "Context API and State Management",
      description:
        "Learn advanced state management patterns in React applications.",
      order: 2,
      estimatedTime: 75,
    },
    // Digital Marketing lessons
    {
      courseId: createdCourses[2].courseId,
      title: "SEO Fundamentals",
      description:
        "Learn search engine optimization basics and keyword research.",
      order: 1,
      estimatedTime: 60,
    },
    {
      courseId: createdCourses[2].courseId,
      title: "Social Media Strategy",
      description: "Develop effective social media marketing campaigns.",
      order: 2,
      estimatedTime: 45,
    },
    // UI/UX Design lessons
    {
      courseId: createdCourses[3].courseId,
      title: "Design Principles",
      description: "Learn fundamental design principles and visual hierarchy.",
      order: 1,
      estimatedTime: 60,
    },
    {
      courseId: createdCourses[3].courseId,
      title: "User Research Methods",
      description:
        "Understand user research techniques and persona development.",
      order: 2,
      estimatedTime: 90,
    },
    // Business Finance lessons
    {
      courseId: createdCourses[4].courseId,
      title: "Financial Statements",
      description:
        "Learn to read and analyze balance sheets, income statements, and cash flow.",
      order: 1,
      estimatedTime: 75,
    },
    {
      courseId: createdCourses[4].courseId,
      title: "Budget Planning",
      description: "Master budget creation and financial planning techniques.",
      order: 2,
      estimatedTime: 60,
    },
  ];

  const createdLessons = [];
  for (const lessonData of lessons) {
    const lesson = await prisma.lesson.create({
      data: lessonData,
    });
    createdLessons.push(lesson);
    console.log(`Created lesson: ${lesson.title}`);
  }

  // Create assignments
  console.log("Creating assignments...");
  const assignments = [
    {
      courseId: createdCourses[0].courseId,
      lessonId: createdLessons[0].lessonId,
      title: "Hello World Program",
      description:
        "Create your first JavaScript program that displays 'Hello, World!' in the console.",
      points: 100,
      rubricUrl: "https://example.com/rubric1",
    },
    {
      courseId: createdCourses[0].courseId,
      lessonId: createdLessons[1].lessonId,
      title: "Variable Calculator",
      description:
        "Build a simple calculator using variables and basic arithmetic operations.",
      points: 150,
      rubricUrl: "https://example.com/rubric2",
    },
    {
      courseId: createdCourses[0].courseId,
      lessonId: createdLessons[2].lessonId,
      title: "Function Library",
      description:
        "Create a collection of utility functions for common mathematical operations.",
      points: 200,
      rubricUrl: "https://example.com/rubric3",
    },
    {
      courseId: createdCourses[1].courseId,
      lessonId: createdLessons[3].lessonId,
      title: "Custom Hook Implementation",
      description:
        "Build a custom React hook for form validation and state management.",
      points: 250,
      rubricUrl: "https://example.com/rubric4",
    },
    {
      courseId: createdCourses[1].courseId,
      lessonId: createdLessons[4].lessonId,
      title: "Context Provider",
      description:
        "Implement a React context provider for global state management.",
      points: 300,
      rubricUrl: "https://example.com/rubric5",
    },
    {
      courseId: createdCourses[2].courseId,
      lessonId: createdLessons[5].lessonId,
      title: "SEO Audit Report",
      description:
        "Conduct a comprehensive SEO audit of a website and provide recommendations.",
      points: 200,
      rubricUrl: "https://example.com/rubric6",
    },
    {
      courseId: createdCourses[2].courseId,
      lessonId: createdLessons[6].lessonId,
      title: "Social Media Campaign",
      description:
        "Design and plan a complete social media marketing campaign.",
      points: 250,
      rubricUrl: "https://example.com/rubric7",
    },
    {
      courseId: createdCourses[3].courseId,
      lessonId: createdLessons[7].lessonId,
      title: "Design System",
      description:
        "Create a comprehensive design system with components and guidelines.",
      points: 300,
      rubricUrl: "https://example.com/rubric8",
    },
    {
      courseId: createdCourses[3].courseId,
      lessonId: createdLessons[8].lessonId,
      title: "User Research Report",
      description:
        "Conduct user interviews and create a detailed research report.",
      points: 250,
      rubricUrl: "https://example.com/rubric9",
    },
    {
      courseId: createdCourses[4].courseId,
      lessonId: createdLessons[9].lessonId,
      title: "Financial Analysis",
      description:
        "Analyze financial statements and provide business recommendations.",
      points: 300,
      rubricUrl: "https://example.com/rubric10",
    },
    {
      courseId: createdCourses[4].courseId,
      lessonId: createdLessons[10].lessonId,
      title: "Budget Creation",
      description: "Create a comprehensive budget for a business scenario.",
      points: 250,
      rubricUrl: "https://example.com/rubric11",
    },
  ];

  console.log("Creating assignments...");
  const createdAssignments = [];
  for (const assignmentData of assignments) {
    const assignment = await prisma.assignment.create({
      data: assignmentData,
    });
    createdAssignments.push(assignment);
    console.log(`Created assignment: ${assignment.title}`);
  }

  // Assignment submissions are now handled through AssignmentSubmission model
  console.log(
    "Skipping assignment submissions - using AssignmentSubmission instead",
  );

  // Create assignment submissions for enrolled students
  const submissions = [
    // Student 1 assignments
    {
      studentId: student1.id,
      assignmentId: createdAssignments[0].assignmentId,
      status: "completed",
      assignedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      startedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
      endedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      grade: 88.0,
      feedback: "Good work! Consider adding input validation next time.",
      submissionContent:
        "I implemented the Hello World program using console.log(). The program runs successfully and displays the expected output.",
      fileUrl: "https://example.com/uploads/hello-world.js",
      fileName: "hello-world.js",
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      studentId: student1.id,
      assignmentId: createdAssignments[1].assignmentId,
      status: "in_progress",
      assignedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      studentId: student1.id,
      assignmentId: createdAssignments[2].assignmentId,
      status: "not_started",
      assignedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    // Student 2 assignments
    {
      studentId: student2.id,
      assignmentId: createdAssignments[0].assignmentId,
      status: "completed",
      assignedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      startedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      endedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      grade: 92.0,
      feedback: "Excellent work! Very thorough implementation.",
      submissionContent:
        "Created a comprehensive Hello World program with additional console formatting and error handling.",
      fileUrl: "https://example.com/uploads/hello-world-enhanced.js",
      fileName: "hello-world-enhanced.js",
      submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      studentId: student2.id,
      assignmentId: createdAssignments[1].assignmentId,
      status: "completed",
      assignedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      startedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      endedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      grade: 95.0,
      feedback: "Outstanding work! Great problem-solving approach.",
    },
    // Student 1 in Advanced React course
    {
      studentId: student1.id,
      assignmentId: createdAssignments[3].assignmentId,
      status: "not_started",
      assignedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    },
    {
      studentId: student1.id,
      assignmentId: createdAssignments[4].assignmentId,
      status: "not_started",
      assignedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    },
  ];

  console.log("Creating assignment submissions...");
  for (const submissionData of submissions) {
    const submission = await prisma.assignmentSubmission.create({
      data: submissionData,
    });
    console.log(
      `Created submission: ${submission.status} for assignment ${submission.assignmentId}`,
    );
  }

  // Create course enrollments
  console.log("Creating course enrollments...");
  const enrollments = [
    {
      studentId: student1.id,
      courseId: createdCourses[0].courseId, // JavaScript Fundamentals
    },
    {
      studentId: student1.id,
      courseId: createdCourses[1].courseId, // Advanced React
    },
    {
      studentId: student2.id,
      courseId: createdCourses[0].courseId, // JavaScript Fundamentals
    },
    {
      studentId: student2.id,
      courseId: createdCourses[2].courseId, // Digital Marketing
    },
  ];

  const createdEnrollments = [];
  for (const enrollmentData of enrollments) {
    const enrollment = await prisma.courseEnrollment.create({
      data: enrollmentData,
    });
    createdEnrollments.push(enrollment);
    console.log(
      `Created enrollment: Student ${enrollment.studentId} in course ${enrollment.courseId}`,
    );
  }

  // Create lesson completions
  console.log("Creating lesson completions...");
  const lessonCompletions = [
    {
      enrollmentId: createdEnrollments[0].enrollmentId, // Student 1 in JavaScript
      lessonId: createdLessons[0].lessonId,
    },
    {
      enrollmentId: createdEnrollments[0].enrollmentId,
      lessonId: createdLessons[1].lessonId,
    },
    {
      enrollmentId: createdEnrollments[2].enrollmentId, // Student 2 in JavaScript
      lessonId: createdLessons[0].lessonId,
    },
    {
      enrollmentId: createdEnrollments[2].enrollmentId,
      lessonId: createdLessons[1].lessonId,
    },
  ];

  for (const completionData of lessonCompletions) {
    const completion = await prisma.lessonCompletion.create({
      data: completionData,
    });
    console.log(
      `Created lesson completion: Lesson ${completion.lessonId} for enrollment ${completion.enrollmentId}`,
    );
  }

  // Create course ratings
  console.log("Creating course ratings...");
  const ratings = [
    {
      courseId: createdCourses[0].courseId,
      studentId: student1.id,
      rating: 4.5,
      review: "Great course! Very well structured and easy to follow.",
    },
    {
      courseId: createdCourses[0].courseId,
      studentId: student2.id,
      rating: 4.8,
      review: "Excellent content and practical examples.",
    },
    {
      courseId: createdCourses[2].courseId,
      studentId: student2.id,
      rating: 4.2,
      review: "Good overview of digital marketing concepts.",
    },
  ];

  for (const ratingData of ratings) {
    const rating = await prisma.courseRating.create({
      data: ratingData,
    });
    console.log(
      `Created rating: ${rating.rating} stars for course ${rating.courseId}`,
    );
  }

  // Create achievements
  console.log("Creating achievements...");
  const achievements = [
    {
      studentId: student1.id,
      badgeType: "first_course",
    },
    {
      studentId: student1.id,
      badgeType: "seven_day_streak",
    },
    {
      studentId: student2.id,
      badgeType: "high_scorer",
    },
    {
      studentId: student2.id,
      badgeType: "course_completer",
    },
  ];

  for (const achievementData of achievements) {
    const achievement = await prisma.achievement.create({
      data: achievementData,
    });
    console.log(
      `Created achievement: ${achievement.badgeType} for student ${achievement.studentId}`,
    );
  }

  // Create progress summaries
  console.log("Creating progress summaries...");
  const progressSummaries = [
    {
      userId: student1.id,
      totalCoursesEnrolled: 2,
      totalLessonsCompleted: 2,
      totalAssignmentsCompleted: 1,
      averageGrade: 88.0,
      totalStudyTime: 180, // 3 hours
    },
    {
      userId: student2.id,
      totalCoursesEnrolled: 2,
      totalLessonsCompleted: 2,
      totalAssignmentsCompleted: 2,
      averageGrade: 93.5,
      totalStudyTime: 240, // 4 hours
    },
  ];

  for (const summaryData of progressSummaries) {
    const summary = await prisma.progressSummary.create({
      data: summaryData,
    });
    console.log(`Created progress summary for user ${summary.userId}`);
  }

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

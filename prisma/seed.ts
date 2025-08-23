import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting e-learning platform database seed...");

  // Create sample users with different roles
  const users = [
    {
      email: "admin@elearning.com",
      password: await bcrypt.hash("admin123", 12),
      firstName: "Admin",
      lastName: "User",
      username: "admin",
      role: "admin" as const,
      notificationPreference: true,
      preferredStudyTime: "morning" as const,
      currentStreak: 0,
    },
    {
      email: "instructor1@elearning.com",
      password: await bcrypt.hash("instructor123", 12),
      firstName: "Sarah",
      lastName: "Johnson",
      username: "sarah_johnson",
      role: "instructor" as const,
      notificationPreference: true,
      preferredStudyTime: "morning" as const,
      currentStreak: 0,
    },
    {
      email: "instructor2@elearning.com",
      password: await bcrypt.hash("instructor123", 12),
      firstName: "Michael",
      lastName: "Chen",
      username: "michael_chen",
      role: "instructor" as const,
      notificationPreference: false,
      preferredStudyTime: "evening" as const,
      currentStreak: 0,
    },
    {
      email: "student1@elearning.com",
      password: await bcrypt.hash("student123", 12),
      firstName: "Emma",
      lastName: "Wilson",
      username: "emma_wilson",
      role: "student" as const,
      notificationPreference: true,
      preferredStudyTime: "afternoon" as const,
      currentStreak: 7,
      lastLearned: new Date(),
    },
    {
      email: "student2@elearning.com",
      password: await bcrypt.hash("student123", 12),
      firstName: "Alex",
      lastName: "Davis",
      username: "alex_davis",
      role: "student" as const,
      notificationPreference: true,
      preferredStudyTime: "night" as const,
      currentStreak: 3,
      lastLearned: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      email: "student3@elearning.com",
      password: await bcrypt.hash("student123", 12),
      firstName: "Jordan",
      lastName: "Brown",
      username: "jordan_brown",
      role: "student" as const,
      notificationPreference: false,
      preferredStudyTime: "morning" as const,
      currentStreak: 0,
    },
  ];

  console.log("Creating users...");
  const createdUsers = [];
  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    });
    createdUsers.push(user);
    console.log(
      `Created user: ${user.firstName} ${user.lastName} (${user.email}) - Role: ${user.role}`,
    );
  }

  // Get instructor and student users
  const adminUser = createdUsers.find((u) => u.role === "admin")!;
  const instructor1 = createdUsers.find((u) => u.username === "sarah_johnson")!;
  const instructor2 = createdUsers.find((u) => u.username === "michael_chen")!;
  const student1 = createdUsers.find((u) => u.username === "emma_wilson")!;
  const student2 = createdUsers.find((u) => u.username === "alex_davis")!;
  const student3 = createdUsers.find((u) => u.username === "jordan_brown")!;

  // Create sample courses
  const courses = [
    {
      title: "JavaScript Fundamentals",
      description:
        "Learn the basics of JavaScript programming language from scratch. Perfect for beginners who want to start their coding journey.",
      thumbnailUrl: "https://placekitten.com/400/300",
      category: "programming" as const,
      difficultyLevel: "beginner" as const,
      instructorId: instructor1.id,
    },
    {
      title: "Advanced React Development",
      description:
        "Master React hooks, context, and advanced patterns. Build scalable applications with modern React practices.",
      thumbnailUrl: "https://placekitten.com/400/301",
      category: "programming" as const,
      difficultyLevel: "intermediate" as const,
      instructorId: instructor1.id,
    },
    {
      title: "UI/UX Design Principles",
      description:
        "Learn the fundamentals of user interface and user experience design. Create beautiful and functional digital products.",
      thumbnailUrl: "https://placekitten.com/400/302",
      category: "design" as const,
      difficultyLevel: "beginner" as const,
      instructorId: instructor2.id,
    },
    {
      title: "Digital Marketing Strategy",
      description:
        "Develop comprehensive digital marketing strategies. Learn SEO, social media, and content marketing techniques.",
      thumbnailUrl: "https://placekitten.com/400/303",
      category: "marketing" as const,
      difficultyLevel: "intermediate" as const,
      instructorId: instructor2.id,
    },
    {
      title: "Business Finance Basics",
      description:
        "Understand fundamental business finance concepts. Learn about budgeting, forecasting, and financial analysis.",
      thumbnailUrl: "https://placekitten.com/400/304",
      category: "business" as const,
      difficultyLevel: "beginner" as const,
      instructorId: instructor1.id,
    },
  ];

  console.log("Creating courses...");
  const createdCourses = [];
  for (const courseData of courses) {
    const course = await prisma.course.create({
      data: courseData,
    });
    createdCourses.push(course);
    console.log(`Created course: ${course.title}`);
  }

  // Create course prerequisites (Advanced React requires JavaScript Fundamentals)
  console.log("Creating course prerequisites...");
  await prisma.coursePrerequisite.create({
    data: {
      courseId: createdCourses[1].courseId, // Advanced React
      prerequisiteId: createdCourses[0].courseId, // JavaScript Fundamentals
    },
  });
  console.log(
    "Created prerequisite: Advanced React requires JavaScript Fundamentals",
  );

  // Create lessons for each course
  const lessons = [
    // JavaScript Fundamentals lessons
    {
      courseId: createdCourses[0].courseId,
      title: "Introduction to JavaScript",
      description: "What is JavaScript and why is it important?",
      order: 1,
      estimatedTime: 30,
    },
    {
      courseId: createdCourses[0].courseId,
      title: "Variables and Data Types",
      description: "Learn about variables, strings, numbers, and booleans",
      order: 2,
      estimatedTime: 45,
    },
    {
      courseId: createdCourses[0].courseId,
      title: "Functions and Scope",
      description: "Understanding functions and variable scope",
      order: 3,
      estimatedTime: 60,
    },
    // Advanced React lessons
    {
      courseId: createdCourses[1].courseId,
      title: "React Hooks Deep Dive",
      description: "Master useState, useEffect, and custom hooks",
      order: 1,
      estimatedTime: 90,
    },
    {
      courseId: createdCourses[1].courseId,
      title: "Context API and State Management",
      description: "Learn React Context for global state management",
      order: 2,
      estimatedTime: 75,
    },
    // UI/UX Design lessons
    {
      courseId: createdCourses[2].courseId,
      title: "Design Principles",
      description: "Basic principles of good design",
      order: 1,
      estimatedTime: 45,
    },
    {
      courseId: createdCourses[2].courseId,
      title: "User Research Methods",
      description: "How to conduct effective user research",
      order: 2,
      estimatedTime: 60,
    },
    // Digital Marketing lessons
    {
      courseId: createdCourses[3].courseId,
      title: "Introduction to Digital Marketing",
      description: "Overview of digital marketing landscape and strategies",
      order: 1,
      estimatedTime: 40,
    },
    {
      courseId: createdCourses[3].courseId,
      title: "SEO Fundamentals",
      description: "Search Engine Optimization basics and best practices",
      order: 2,
      estimatedTime: 50,
    },
    {
      courseId: createdCourses[3].courseId,
      title: "Social Media Marketing",
      description: "Creating effective social media campaigns",
      order: 3,
      estimatedTime: 45,
    },
    // Business Finance lessons
    {
      courseId: createdCourses[4].courseId,
      title: "Financial Statements Overview",
      description:
        "Understanding balance sheets, income statements, and cash flow",
      order: 1,
      estimatedTime: 35,
    },
    {
      courseId: createdCourses[4].courseId,
      title: "Budgeting and Forecasting",
      description: "Creating budgets and financial projections",
      order: 2,
      estimatedTime: 40,
    },
    {
      courseId: createdCourses[4].courseId,
      title: "Financial Analysis Tools",
      description: "Ratio analysis and financial metrics",
      order: 3,
      estimatedTime: 45,
    },
  ];

  console.log("Creating lessons...");
  const createdLessons = [];
  for (const lessonData of lessons) {
    const lesson = await prisma.lesson.create({
      data: lessonData,
    });
    createdLessons.push(lesson);
    console.log(
      `Created lesson: ${lesson.title} for course ${lesson.courseId}`,
    );
  }

  // Create course enrollments
  const enrollments = [
    {
      studentId: student1.id,
      courseId: createdCourses[0].courseId,
    },
    {
      studentId: student1.id,
      courseId: createdCourses[2].courseId,
    },
    {
      studentId: student2.id,
      courseId: createdCourses[0].courseId,
    },
    {
      studentId: student2.id,
      courseId: createdCourses[1].courseId,
    },
    {
      studentId: student3.id,
      courseId: createdCourses[3].courseId,
    },
    // Add enrollments for Digital Marketing and Business Finance
    {
      studentId: student1.id,
      courseId: createdCourses[3].courseId,
    },
    {
      studentId: student2.id,
      courseId: createdCourses[3].courseId,
    },
    {
      studentId: student1.id,
      courseId: createdCourses[4].courseId,
    },
    {
      studentId: student2.id,
      courseId: createdCourses[4].courseId,
    },
  ];

  console.log("Creating course enrollments...");
  const createdEnrollments = [];
  for (const enrollmentData of enrollments) {
    const enrollment = await prisma.courseEnrollment.create({
      data: enrollmentData,
    });
    createdEnrollments.push(enrollment);
    console.log(
      `Created enrollment: Student ${enrollmentData.studentId} in course ${enrollmentData.courseId}`,
    );
  }

  // Create lesson completions
  console.log("Creating lesson completions...");

  // Student 1 completes 2 lessons in JavaScript Fundamentals
  const jsEnrollment1 = createdEnrollments.find(
    (e) =>
      e.studentId === student1.id && e.courseId === createdCourses[0].courseId,
  );
  if (jsEnrollment1) {
    const jsLessons = createdLessons
      .filter((l) => l.courseId === createdCourses[0].courseId)
      .slice(0, 2);
    for (const lesson of jsLessons) {
      await prisma.lessonCompletion.create({
        data: {
          enrollment: {
            connect: { enrollmentId: jsEnrollment1.enrollmentId },
          },
          lesson: {
            connect: { lessonId: lesson.lessonId },
          },
        },
      });
      console.log(`Student 1 completed lesson: ${lesson.title}`);
    }
  }

  // Student 1 completes 1 lesson in UI/UX Design
  const designEnrollment1 = createdEnrollments.find(
    (e) =>
      e.studentId === student1.id && e.courseId === createdCourses[2].courseId,
  );
  if (designEnrollment1) {
    const designLessons = createdLessons
      .filter((l) => l.courseId === createdCourses[2].courseId)
      .slice(0, 1);
    for (const lesson of designLessons) {
      await prisma.lessonCompletion.create({
        data: {
          enrollment: {
            connect: { enrollmentId: designEnrollment1.enrollmentId },
          },
          lesson: {
            connect: { lessonId: lesson.lessonId },
          },
        },
      });
      console.log(`Student 1 completed lesson: ${lesson.title}`);
    }
  }

  // Student 2 completes 3 lessons in JavaScript Fundamentals
  const jsEnrollment2 = createdEnrollments.find(
    (e) =>
      e.studentId === student2.id && e.courseId === createdCourses[0].courseId,
  );
  if (jsEnrollment2) {
    const jsLessons = createdLessons
      .filter((l) => l.courseId === createdCourses[0].courseId)
      .slice(0, 3);
    for (const lesson of jsLessons) {
      await prisma.lessonCompletion.create({
        data: {
          enrollment: {
            connect: { enrollmentId: jsEnrollment2.enrollmentId },
          },
          lesson: {
            connect: { lessonId: lesson.lessonId },
          },
        },
      });
      console.log(`Student 2 completed lesson: ${lesson.title}`);
    }
  }

  // Student 1 completes 1 lesson in Digital Marketing
  const marketingEnrollment1 = createdEnrollments.find(
    (e) =>
      e.studentId === student1.id && e.courseId === createdCourses[3].courseId,
  );
  if (marketingEnrollment1) {
    const marketingLessons = createdLessons
      .filter((l) => l.courseId === createdCourses[3].courseId)
      .slice(0, 1);
    for (const lesson of marketingLessons) {
      await prisma.lessonCompletion.create({
        data: {
          enrollment: {
            connect: { enrollmentId: marketingEnrollment1.enrollmentId },
          },
          lesson: {
            connect: { lessonId: lesson.lessonId },
          },
        },
      });
      console.log(`Student 1 completed lesson: ${lesson.title}`);
    }
  }

  // Student 1 completes 2 lessons in Business Finance
  const financeEnrollment1 = createdEnrollments.find(
    (e) =>
      e.studentId === student1.id && e.courseId === createdCourses[4].courseId,
  );
  if (financeEnrollment1) {
    const financeLessons = createdLessons
      .filter((l) => l.courseId === createdCourses[4].courseId)
      .slice(0, 2);
    for (const lesson of financeLessons) {
      await prisma.lessonCompletion.create({
        data: {
          enrollment: {
            connect: { enrollmentId: financeEnrollment1.enrollmentId },
          },
          lesson: {
            connect: { lessonId: lesson.lessonId },
          },
        },
      });
      console.log(`Student 1 completed lesson: ${lesson.title}`);
    }
  }

  // Student 2 completes 1 lesson in Business Finance
  const financeEnrollment2 = createdEnrollments.find(
    (e) =>
      e.studentId === student2.id && e.courseId === createdCourses[4].courseId,
  );
  if (financeEnrollment2) {
    const financeLessons = createdLessons
      .filter((l) => l.courseId === createdCourses[4].courseId)
      .slice(0, 1);
    for (const lesson of financeLessons) {
      await prisma.lessonCompletion.create({
        data: {
          enrollment: {
            connect: { enrollmentId: financeEnrollment2.enrollmentId },
          },
          lesson: {
            connect: { lessonId: lesson.lessonId },
          },
        },
      });
      console.log(`Student 2 completed lesson: ${lesson.title}`);
    }
  }

  // Create course ratings
  const ratings = [
    {
      courseId: createdCourses[0].courseId,
      studentId: student1.id,
      rating: 4.5,
      review: "Great course for beginners! Very clear explanations.",
    },
    {
      courseId: createdCourses[0].courseId,
      studentId: student2.id,
      rating: 5.0,
      review: "Excellent course! I learned so much about JavaScript.",
    },
    {
      courseId: createdCourses[2].courseId,
      studentId: student1.id,
      rating: 4.0,
      review: "Good introduction to design principles.",
    },
    // Add ratings for Digital Marketing and Business Finance
    {
      courseId: createdCourses[3].courseId,
      studentId: student1.id,
      rating: 4.2,
      review: "Great digital marketing course with practical examples.",
    },
    {
      courseId: createdCourses[4].courseId,
      studentId: student1.id,
      rating: 4.5,
      review: "Excellent finance course, very comprehensive and clear.",
    },
    {
      courseId: createdCourses[4].courseId,
      studentId: student2.id,
      rating: 4.3,
      review: "Good course for understanding business finance basics.",
    },
  ];

  console.log("Creating course ratings...");
  for (const ratingData of ratings) {
    const rating = await prisma.courseRating.create({
      data: ratingData,
    });
    console.log(
      `Created rating: ${rating.rating} stars for course ${rating.courseId}`,
    );
  }

  // Create assignments
  const assignments = [
    {
      courseId: createdCourses[0].courseId,
      title: "JavaScript Calculator",
      description:
        "Build a simple calculator using JavaScript functions and DOM manipulation.",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      points: 100,
    },
    {
      courseId: createdCourses[0].courseId,
      title: "Todo List App",
      description:
        "Create a todo list application with add, delete, and mark complete functionality.",
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      points: 150,
    },
    {
      courseId: createdCourses[2].courseId,
      title: "Design Portfolio",
      description:
        "Design a portfolio website following the principles learned in class.",
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      points: 200,
    },
    // Digital Marketing assignments
    {
      courseId: createdCourses[3].courseId,
      title: "SEO Audit Report",
      description:
        "Conduct an SEO audit of a website and provide recommendations.",
      dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
      points: 120,
    },
    {
      courseId: createdCourses[3].courseId,
      title: "Social Media Campaign",
      description:
        "Create a social media marketing campaign for a product or service.",
      dueDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000), // 16 days from now
      points: 180,
    },
    // Business Finance assignments
    {
      courseId: createdCourses[4].courseId,
      title: "Financial Statement Analysis",
      description: "Analyze financial statements and provide insights.",
      dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
      points: 150,
    },
    {
      courseId: createdCourses[4].courseId,
      title: "Budget Creation",
      description: "Create a comprehensive budget for a business scenario.",
      dueDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000), // 13 days from now
      points: 160,
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

  // Create assignment submissions
  const submissions = [
    {
      assignmentId: createdAssignments[0].assignmentId,
      studentId: student1.id,
      status: "submitted" as const,
      submittedAt: new Date(),
      grade: 95.0,
      feedback:
        "Excellent work! Great use of functions and clean code structure.",
    },
    {
      assignmentId: createdAssignments[0].assignmentId,
      studentId: student2.id,
      status: "submitted" as const,
      submittedAt: new Date(),
      grade: 88.0,
      feedback: "Good work! Consider adding input validation next time.",
    },
    {
      assignmentId: createdAssignments[1].assignmentId,
      studentId: student1.id,
      status: "in_progress" as const,
    },
    {
      assignmentId: createdAssignments[2].assignmentId,
      studentId: student1.id,
      status: "not_started" as const,
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

  // Create achievements
  const achievements = [
    {
      studentId: student1.id,
      badgeType: "first_course" as const,
    },
    {
      studentId: student1.id,
      badgeType: "seven_day_streak" as const,
    },
    {
      studentId: student1.id,
      badgeType: "high_scorer" as const,
    },
    {
      studentId: student2.id,
      badgeType: "first_course" as const,
    },
    {
      studentId: student2.id,
      badgeType: "early_bird" as const,
    },
  ];

  console.log("Creating achievements...");
  for (const achievementData of achievements) {
    const achievement = await prisma.achievement.create({
      data: achievementData,
    });
    console.log(
      `Created achievement: ${achievement.badgeType} for student ${achievement.studentId}`,
    );
  }

  // Create quiz submissions
  const quizSubmissions = [
    {
      quizId: "quiz_js_basics",
      studentId: student1.id,
      score: 95.0,
    },
    {
      quizId: "quiz_js_basics",
      studentId: student2.id,
      score: 87.0,
    },
    {
      quizId: "quiz_design_principles",
      studentId: student1.id,
      score: 92.0,
    },
  ];

  console.log("Creating quiz submissions...");
  for (const quizData of quizSubmissions) {
    const quiz = await prisma.quizSubmission.create({
      data: quizData,
    });
    console.log(
      `Created quiz submission: Score ${quiz.score} for quiz ${quiz.quizId}`,
    );
  }

  console.log("✅ E-learning platform database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });

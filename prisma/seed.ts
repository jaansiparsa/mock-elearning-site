import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create sample users with roles
  const users = [
    {
      name: "John Doe",
      email: "john@example.com",
      password: await bcrypt.hash("password123", 12),
      role: "WRITER",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      password: await bcrypt.hash("password123", 12),
      role: "WRITER",
    },
    {
      name: "Mike Johnson",
      email: "mike@example.com",
      password: await bcrypt.hash("password123", 12),
      role: "VIEWER",
    },
    {
      name: "Sarah Wilson",
      email: "sarah@example.com",
      password: await bcrypt.hash("password123", 12),
      role: "VIEWER",
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
      `Created user: ${user.name} (${user.email}) - Role: ${user.role}`,
    );
  }

  // Create sample posts
  const posts = [
    {
      name: "Welcome to Brex-MVP",
      createdById: createdUsers[0]?.id ?? "",
    },
    {
      name: "Getting Started Guide",
      createdById: createdUsers[1]?.id ?? "",
    },
    {
      name: "Community Guidelines",
      createdById: createdUsers[2]?.id ?? "",
    },
    {
      name: "Feature Request: Dark Mode",
      createdById: createdUsers[3]?.id ?? "",
    },
    {
      name: "Platform Updates - Q4 2024",
      createdById: createdUsers[0]?.id ?? "",
    },
    {
      name: "User Feedback and Suggestions",
      createdById: createdUsers[1]?.id ?? "",
    },
    {
      name: "Technical Documentation",
      createdById: createdUsers[2]?.id ?? "",
    },
    {
      name: "Community Spotlight",
      createdById: createdUsers[3]?.id ?? "",
    },
  ];

  console.log("Creating posts...");
  for (const postData of posts) {
    if (postData.createdById) {
      const post = await prisma.post.create({
        data: postData,
      });
      console.log(`Created post: ${post.name}`);
    }
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });

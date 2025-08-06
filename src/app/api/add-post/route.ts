import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/server/auth";
import { z } from "zod";

const prisma = new PrismaClient();

const AddPostSchema = z.object({
  name: z.string().min(1, "Post name is required"),
});

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: You must be signed in to add a post.",
        },
        { status: 401 },
      );
    }

    // Parse and validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      return NextResponse.json(
        {
          success: false,
          error: "Bad Request: Invalid JSON body.",
        },
        { status: 400 },
      );
    }

    const parseResult = AddPostSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation Error",
          details: parseResult.error.flatten(),
        },
        { status: 400 },
      );
    }

    // Create the post
    const { name } = parseResult.data;
    const post = await prisma.post.create({
      data: {
        name,
        createdById: session.user.id,
      },
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error: Failed to add post.",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? (error.stack ?? error.message)
              : String(error)
            : undefined,
      },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

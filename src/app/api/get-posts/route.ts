import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/server/auth";

const prisma = new PrismaClient();

export async function GET(_request: Request) {
  try {
    // Check authentication
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: You must be signed in to view posts.",
        },
        { status: 401 },
      );
    }

    // (Optional) Add role-based check here for 403 Forbidden in the future
    // if (session.user.role !== 'admin') {
    //   return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    // }

    // Fetch posts
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    // Handle known bad request errors (example placeholder)
    if (error instanceof TypeError) {
      return NextResponse.json(
        {
          success: false,
          error: "Bad Request: Invalid input.",
          details:
            process.env.NODE_ENV === "development"
              ? error instanceof Error
                ? (error.stack ?? error.message)
                : String(error)
              : undefined,
        },
        { status: 400 },
      );
    }
    // Handle all other errors as internal server error
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error: Failed to fetch posts.",
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

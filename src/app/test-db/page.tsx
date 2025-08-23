import { db } from "@/server/db";

export default async function TestDBPage() {
  const courses = await db.course.findMany({
    include: {
      lessons: true,
      assignments: true,
      ratings: true,
      enrollments: true,
    },
  });

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Database Test</h1>
      <pre className="overflow-auto rounded bg-gray-100 p-4">
        {JSON.stringify(courses, null, 2)}
      </pre>
    </div>
  );
}

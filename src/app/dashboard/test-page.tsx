export default function TestDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Test Dashboard
        </h1>
        <p className="text-gray-600">
          This is a test page to see if basic rendering works
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Test Content</h2>
        <p>If you can see this, basic rendering is working.</p>
        <div className="mt-4 rounded bg-blue-100 p-4">
          <p className="text-blue-800">
            This is a test card to verify styling works.
          </p>
        </div>
      </div>
    </div>
  );
}

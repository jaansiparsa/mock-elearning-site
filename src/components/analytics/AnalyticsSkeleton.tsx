export default function AnalyticsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Period Selector Skeleton */}
      <div className="mb-8 flex space-x-2">
        <div className="h-10 w-24 animate-pulse rounded-md bg-gray-200"></div>
        <div className="h-10 w-24 animate-pulse rounded-md bg-gray-200"></div>
      </div>

      {/* Weekly Learning Goal Skeleton */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-200"></div>
          </div>
          <div className="text-right">
            <div className="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
            <div className="mt-1 h-4 w-20 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>

        {/* Progress Bar Skeleton */}
        <div className="mt-6">
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-12 animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="h-3 w-full animate-pulse rounded-full bg-gray-200"></div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="h-16 animate-pulse rounded bg-gray-200"></div>
            <div className="h-16 animate-pulse rounded bg-gray-200"></div>
            <div className="h-16 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center">
              <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                <div className="mt-2 h-6 w-16 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section Skeleton */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Study Time Chart Skeleton */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 h-6 w-32 animate-pulse rounded bg-gray-200"></div>
          <div className="h-64 animate-pulse rounded bg-gray-200"></div>
        </div>

        {/* Course Progress Chart Skeleton */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 h-6 w-40 animate-pulse rounded bg-gray-200"></div>
          <div className="h-64 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>

      {/* Recent Activity Skeleton */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 h-6 w-32 animate-pulse rounded bg-gray-200"></div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-4 w-48 animate-pulse rounded bg-gray-200"></div>
                <div className="mt-1 h-3 w-32 animate-pulse rounded bg-gray-200"></div>
              </div>
              <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Section Skeleton */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 h-6 w-32 animate-pulse rounded bg-gray-200"></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200"></div>
                <div className="flex-1">
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                  <div className="mt-1 h-3 w-48 animate-pulse rounded bg-gray-200"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

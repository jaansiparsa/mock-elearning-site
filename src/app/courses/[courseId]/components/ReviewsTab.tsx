import { Star } from "lucide-react";

interface ReviewsTabProps {
  ratings: Array<{
    rating: number;
    review?: string;
    student: {
      firstName: string;
      lastName: string;
      username: string;
    };
    createdAt: Date;
  }>;
  averageRating: number;
  totalRatings: number;
}

export default function ReviewsTab({
  ratings,
  averageRating,
  totalRatings,
}: ReviewsTabProps) {
  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Student Reviews</h3>
        <div className="text-sm text-gray-600">
          {averageRating > 0 ? (
            <div className="flex items-center">
              <span className="font-medium">{averageRating}</span>
              <Star className="ml-1 h-4 w-4 fill-current text-yellow-400" />
              <span className="ml-1">({totalRatings} reviews)</span>
            </div>
          ) : (
            "No reviews yet"
          )}
        </div>
      </div>

      {ratings.length > 0 ? (
        <div className="space-y-4">
          {ratings.map((rating, index) => (
            <div
              key={index}
              className="border-b border-gray-200 pb-4 last:border-b-0"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                    <span className="text-sm font-medium text-gray-700">
                      {rating.student.firstName[0]}
                      {rating.student.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {rating.student.firstName} {rating.student.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      @{rating.student.username}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < rating.rating
                          ? "fill-current text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              {rating.review && (
                <p className="ml-11 text-gray-700">{rating.review}</p>
              )}
              <p className="mt-2 ml-11 text-xs text-gray-500">
                {new Date(rating.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <Star className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <p className="text-gray-500">
            No reviews yet. Be the first to review this course!
          </p>
        </div>
      )}
    </div>
  );
}

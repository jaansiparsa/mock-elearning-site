interface PeriodSelectorProps {
  period: "week" | "month";
  onPeriodChange: (period: "week" | "month") => void;
}

export default function PeriodSelector({
  period,
  onPeriodChange,
}: PeriodSelectorProps) {
  return (
    <div className="mb-8 flex space-x-2">
      <button
        onClick={() => onPeriodChange("week")}
        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
          period === "week"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        This Week
      </button>
      <button
        onClick={() => onPeriodChange("month")}
        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
          period === "month"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        This Month
      </button>
    </div>
  );
}

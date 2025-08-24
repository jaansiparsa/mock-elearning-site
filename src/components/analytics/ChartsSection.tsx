"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Mock data for charts
const mockStudyTimeData = [
  { date: "Jan 1", minutes: 45 },
  { date: "Jan 2", minutes: 60 },
  { date: "Jan 3", minutes: 30 },
  { date: "Jan 4", minutes: 75 },
  { date: "Jan 5", minutes: 90 },
  { date: "Jan 6", minutes: 120 },
  { date: "Jan 7", minutes: 85 },
];

const mockCategoryData = [
  { category: "Programming", hours: 12.5 },
  { category: "Marketing", hours: 8.2 },
  { category: "Design", hours: 6.8 },
  { category: "Business", hours: 4.5 },
];

const mockCompletionData = [
  { name: "Completed", value: 2 },
  { name: "In Progress", value: 1 },
  { name: "Not Started", value: 2 },
];

export default function ChartsSection() {
  return (
    <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-semibold text-gray-900">
        Progress at a Glance
      </h3>

      {/* Study Time Line Chart */}
      <div className="mb-8">
        <h4 className="text-md mb-4 font-medium text-gray-800">
          Study Time Over Last 30 Days
        </h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockStudyTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [`${value} min`, "Study Time"]}
                labelFormatter={(label: string) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="minutes"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Course Category Bar Chart */}
      <div className="mb-8">
        <h4 className="text-md mb-4 font-medium text-gray-800">
          Hours Spent per Course Category
        </h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockCategoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [`${value} hours`, "Study Time"]}
              />
              <Bar dataKey="hours" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Course Completion Pie Chart */}
      <div className="mb-8">
        <h4 className="text-md mb-4 font-medium text-gray-800">
          Course Completion Rate
        </h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockCompletionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {mockCompletionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444"][index]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Learning Activity Heatmap */}
      <div>
        <h4 className="text-md mb-4 font-medium text-gray-800">
          Daily Learning Activity
        </h4>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="text-center text-xs text-gray-500">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i]}
            </div>
          ))}
          {Array.from({ length: 28 }, (_, i) => {
            const intensity = Math.floor(Math.random() * 4);
            const colors = [
              "bg-gray-100",
              "bg-green-200",
              "bg-green-400",
              "bg-green-600",
            ];
            return (
              <div
                key={i}
                className={`h-8 w-8 rounded ${colors[intensity]} border border-gray-200`}
                title={`Day ${i + 1}: ${intensity * 25}% activity`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

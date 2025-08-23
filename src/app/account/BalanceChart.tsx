"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { api } from "@/trpc/react";

interface BalanceDataPoint {
  date: string;
  balance: number;
  transactionId: string | null;
}

export default function BalanceChart() {
  const { data, error, isLoading } =
    api.transactions.getBalanceHistory.useQuery();

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Balance History
        </h2>
        <div className="h-64 animate-pulse rounded bg-gray-200"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading balance history
            </h3>
            <div className="mt-2 text-sm text-red-700">
              {error.message ??
                "Failed to load balance history. Please try again."}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.balanceHistory || data.balanceHistory.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Balance History
        </h2>
        <div className="py-12 text-center">
          <div className="text-gray-500">
            <p className="text-lg font-medium">No transaction history</p>
            <p className="text-sm">
              Your balance history will appear here once you make transactions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Format data for the chart
  const chartData: BalanceDataPoint[] = data.balanceHistory.map((item) => ({
    date: new Date(item.date).toLocaleDateString(),
    balance: Number(item.balance), // Ensure balance is a number
    transactionId: item.transactionId,
  }));

  // Debug: Log the chart data to see what we're working with
  console.log("BalanceChart rendered with data:", chartData);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Balance History
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value: any) => {
                console.log("YAxis tick formatter called with value:", value);
                return `$${Number(value).toFixed(0)}`;
              }}
            />
            <Tooltip
              formatter={(value: any) => {
                console.log("Tooltip formatter called with value:", value);
                console.log("Value type:", typeof value);
                console.log("Value converted to number:", Number(value));
                // Add an alert to make sure this is being called
                alert(`Tooltip value: ${value} (type: ${typeof value})`);
                return [`$${Number(value).toFixed(2)}`, "Balance"];
              }}
              labelFormatter={(label) => {
                console.log(
                  "Tooltip label formatter called with label:",
                  label,
                );
                return `Date: ${label}`;
              }}
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

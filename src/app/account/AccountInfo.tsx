"use client";

import BalanceChart from "./BalanceChart";
import { api } from "@/trpc/react";

export default function AccountInfo() {
  const { data, error, isLoading } = api.transactions.getAccountInfo.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 h-6 w-1/3 rounded bg-gray-200"></div>
          <div className="h-8 w-1/4 rounded bg-gray-200"></div>
        </div>
        <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-2 h-4 w-1/2 rounded bg-gray-200"></div>
          <div className="h-4 w-1/3 rounded bg-gray-200"></div>
        </div>
        <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 h-6 w-1/3 rounded bg-gray-200"></div>
          <div className="h-64 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading account information
            </h3>
            <div className="mt-2 text-sm text-red-700">
              {error.message ??
                "Failed to load account information. Please try again."}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.account) {
    return (
      <div className="py-12 text-center">
        <div className="text-gray-500">
          <p className="text-lg font-medium">No account found</p>
          <p className="text-sm">You don't have a financial account yet.</p>
        </div>
      </div>
    );
  }

  const { account } = data;

  return (
    <div className="space-y-6">
      {/* Account Balance Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-gray-900">
          Account Balance
        </h2>
        <div className="text-3xl font-bold text-green-600">
          ${account.balance.toFixed(2)}
        </div>
      </div>

      {/* Account Details Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Account Details
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Account ID:</span>
            <span className="font-medium text-gray-900">{account.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Account Holder:</span>
            <span className="font-medium text-gray-900">
              {account.user.name ?? account.user.email ?? "Unknown"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium text-gray-900">
              {account.user.email ?? "Not provided"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Account Created:</span>
            <span className="font-medium text-gray-900">
              {new Date(account.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Balance History Chart */}
      <BalanceChart />
    </div>
  );
}

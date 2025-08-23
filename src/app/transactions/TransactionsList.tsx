"use client";

import { api } from "@/trpc/react";

interface Transaction {
  id: string;
  senderAccountId: string;
  receiverAccountId: string;
  amount: number;
  description?: string;
  createdAt: string;
  senderAccount: {
    user: {
      id: string;
      name?: string;
      email?: string;
    };
  };
  receiverAccount: {
    user: {
      id: string;
      name?: string;
      email?: string;
    };
  };
}

interface TransactionData {
  transactions: Transaction[];
  userAccount: {
    id: string;
  };
}

export default function TransactionsList() {
  const { data, error, isLoading } = api.transactions.getAllForUser.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="h-6 w-1/3 rounded bg-gray-200"></div>
              <div className="h-6 w-20 rounded bg-gray-200"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-gray-200"></div>
              <div className="h-4 w-20 rounded bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading transactions
            </h3>
            <div className="mt-2 text-sm text-red-700">
              {error.message ??
                "Failed to load transactions. Please try again."}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const transactionData = data as TransactionData | undefined;

  if (
    !transactionData?.transactions ||
    transactionData.transactions.length === 0
  ) {
    return (
      <div className="py-12 text-center">
        <div className="text-gray-500">
          <p className="text-lg font-medium">No transactions found</p>
          <p className="text-sm">You haven&apos;t made any transactions yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactionData.transactions.map((transaction: Transaction) => {
        const isSender =
          transaction.senderAccountId === transactionData.userAccount?.id;
        const amount = isSender ? -transaction.amount : transaction.amount;
        const otherUser = isSender
          ? transaction.receiverAccount.user
          : transaction.senderAccount.user;

        return (
          <div
            key={transaction.id}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-2 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {transaction.description ||
                    `${isSender ? "Sent to" : "Received from"} ${otherUser?.name || otherUser?.email || "Unknown"}`}
                </h3>
                <p className="text-sm text-gray-600">
                  {isSender ? "Sent to" : "Received from"}{" "}
                  {otherUser?.name || otherUser?.email || "Unknown"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-lg font-semibold ${
                    amount >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {amount >= 0 ? "+" : ""}${Math.abs(amount).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span className="capitalize">
                {isSender ? "Sent" : "Received"}
              </span>
              <span>
                {new Date(transaction.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

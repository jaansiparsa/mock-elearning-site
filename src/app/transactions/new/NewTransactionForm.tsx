"use client";

import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewTransactionForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    receiverAccountId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get available accounts to send money to
  const { data: accountsData, isLoading: isLoadingAccounts } =
    api.transactions.getAvailableAccounts.useQuery();

  // Create transaction mutation
  const createTransaction = api.transactions.createTransaction.useMutation({
    onSuccess: () => {
      router.push("/transactions");
      router.refresh();
    },
    onError: (error) => {
      alert(`Error creating transaction: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.receiverAccountId) {
      alert("Please select a receiver");
      setIsSubmitting(false);
      return;
    }

    try {
      await createTransaction.mutateAsync({
        description: formData.description,
        amount: parseFloat(formData.amount),
        receiverAccountId: formData.receiverAccountId,
      });
    } catch (error) {
      // Error is handled in onError callback
      console.error("Transaction creation failed:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoadingAccounts) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Transaction Details
          </h2>
        </div>
        <div className="space-y-4">
          <div className="h-4 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Transaction Details
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <input
            id="description"
            type="text"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Enter transaction description"
            required
            className="focus:border-brex-orange focus:ring-brex-orange mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-1 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.amount}
            onChange={(e) => handleInputChange("amount", e.target.value)}
            placeholder="0.00"
            required
            className="focus:border-brex-orange focus:ring-brex-orange mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-1 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="receiver"
            className="block text-sm font-medium text-gray-700"
          >
            Send to
          </label>
          <select
            id="receiver"
            value={formData.receiverAccountId}
            onChange={(e) =>
              handleInputChange("receiverAccountId", e.target.value)
            }
            required
            className="focus:border-brex-orange focus:ring-brex-orange mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-1 focus:outline-none"
          >
            <option value="">Select a recipient</option>
            {accountsData?.availableAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.user.name ?? account.user.email ?? "Unknown User"}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-brex-orange hover:bg-brex-orange flex-1 rounded-md px-4 py-2 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Transaction"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/transactions")}
            className="flex-1 rounded-md bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

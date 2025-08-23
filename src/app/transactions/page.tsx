import { Suspense } from "react";
import TransactionsList from "./TransactionsList";

export default function TransactionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <p className="mt-2 text-gray-600">
          View all your transaction history and details.
        </p>
      </div>

      <Suspense fallback={<div>Loading transactions...</div>}>
        <TransactionsList />
      </Suspense>
    </div>
  );
}

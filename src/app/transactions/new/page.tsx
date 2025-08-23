import NewTransactionForm from "./NewTransactionForm";
import { Suspense } from "react";

export default function NewTransactionPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">New Transaction</h1>
        <p className="mt-2 text-gray-600">Create a new transaction record.</p>
      </div>

      <Suspense fallback={<div>Loading form...</div>}>
        <NewTransactionForm />
      </Suspense>
    </div>
  );
}

import AccountInfo from "./AccountInfo";
import { Suspense } from "react";

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
        <p className="mt-2 text-gray-600">
          View your account information and balance.
        </p>
      </div>

      <Suspense fallback={<div>Loading account information...</div>}>
        <AccountInfo />
      </Suspense>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!firstName.trim()) {
      setError("First name is required");
      return;
    }
    if (!lastName.trim()) {
      setError("Last name is required");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!showVerification) {
      // First step: Send verification code
      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            username,
            password,
          }),
        });

        if (response.ok) {
          setShowVerification(true);
          setError("");
        } else {
          const data = (await response.json()) as { error?: string };
          setError(data.error ?? "Failed to send verification code");
        }
      } catch (error) {
        setError("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Second step: Verify code and create account
      if (!verificationCode.trim()) {
        setError("Verification code is required");
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/signup/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            username,
            password,
            verificationCode,
          }),
        });

        if (response.ok) {
          router.push("/auth/signin?message=Account created successfully");
        } else {
          const data = (await response.json()) as { error?: string };
          setError(data.error ?? "Failed to create account");
        }
      } catch (error) {
        setError("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-background-white flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              href="/auth/signin"
              className="text-brex-orange hover:text-brex-orange font-medium"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!showVerification ? (
            // First step: Registration form
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:text-sm"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:text-sm"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:text-sm"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:text-sm"
                  placeholder="Password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:text-sm"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          ) : (
            // Second step: Email verification
            <div className="space-y-4">
              <div className="text-center">
                <p className="mb-4 text-sm text-gray-600">
                  We've sent a verification code to <strong>{email}</strong>
                </p>
                <p className="mb-6 text-xs text-gray-500">
                  For demo purposes, you can use any 6-digit code (e.g., 123456)
                </p>
              </div>

              <div>
                <label
                  htmlFor="verificationCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Verification Code
                </label>
                <input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  maxLength={6}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-center font-mono text-lg text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:text-sm"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(e.target.value.replace(/\D/g, ""))
                  }
                />
              </div>
            </div>
          )}

          {error && (
            <div className="text-center text-sm text-red-600">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading
                ? showVerification
                  ? "Verifying..."
                  : "Sending code..."
                : showVerification
                  ? "Verify & Create Account"
                  : "Send Verification Code"}
            </button>
          </div>

          {showVerification && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowVerification(false)}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                ← Back to registration
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

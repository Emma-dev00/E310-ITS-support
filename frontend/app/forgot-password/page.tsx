"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [devResetLink, setDevResetLink] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setDevResetLink(null);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = "https://e310-its-support.onrender.com/api/auth/forgot-password";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "Failed to process request. Please try again.");
        return;
      }

      setSuccessMessage(
        data?.message || "If an account with that email exists, a password reset link has been generated."
      );
      if (data?.data?.resetLink) {
        setDevResetLink(data.data.resetLink);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="w-full min-h-screen flex justify-center items-center bg-[#F8FAFC] px-4">
      <div className="w-full max-w-110 bg-white rounded-xl shadow-xl p-8 flex flex-col">
        {/* Wordmark */}
        <div className="flex justify-center items-center mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="E310 ITS Support" className="h-10" />
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-[#0B2545] tracking-tight">Forgot Password</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Enter your email to receive a password reset link.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        {/* Success message */}
        {successMessage ? (
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-sm text-green-800 text-center">
              <p className="font-semibold mb-1">Check your inbox</p>
              <p>{successMessage}</p>
            </div>

            {devResetLink && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 break-all">
                <p className="font-bold mb-1">Demo / Test Reset Link:</p>
                <Link href={devResetLink} className="text-[#0B2545] underline font-mono">
                  {devResetLink}
                </Link>
              </div>
            )}

            <Link
              href="/login"
              className="w-full py-2.5 px-4 rounded-lg bg-[#C9A227] text-[#0B2545] font-bold text-center hover:opacity-90 transition mt-2"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-[#0B2545]">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8FAFC] text-[#1E2A3A] placeholder:text-[#64748B]/60 focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-lg bg-[#C9A227] text-[#0B2545] font-bold hover:opacity-90 active:scale-[0.99] transition disabled:opacity-50"
            >
              {isLoading ? "Sending Link..." : "Send Reset Link"}
            </button>

            <div className="mt-2 text-center">
              <Link href="/login" className="text-xs text-[#64748B] hover:text-[#0B2545] font-medium">
                ← Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

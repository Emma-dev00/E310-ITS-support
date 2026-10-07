"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const urlToken = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setIsLoading(true);

        try {
            const endpoint = "https://e310-its-support.onrender.com/api/auth/reset-password";

            // If token in URL search param, use token-based reset
            if (urlToken) {
                const res = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token: urlToken,
                        newPassword,
                    }),
                });

                const data = await res.json().catch(() => null);

                if (!res.ok) {
                    setError(data?.message || "Failed to reset password. The link may have expired.");
                    return;
                }

                setIsSuccess(true);
                return;
            }

            // Fallback: authenticated first-time login password change
            const authToken = localStorage.getItem("token");
            if (!authToken) {
                setError("No reset token found. Please request a new password reset link.");
                return;
            }

            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({ newPassword }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                setError(data?.message || "Failed to reset password. Please try again.");
                return;
            }

            const cachedUser = localStorage.getItem("user");
            if (cachedUser) {
                try {
                    const user = JSON.parse(cachedUser);
                    user.isFirstLogin = false;
                    localStorage.setItem("user", JSON.stringify(user));
                } catch {
                    // ignore malformed cache
                }
            }

            router.push("/dashboard");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }

    if (isSuccess) {
        return (
            <div className="text-center flex flex-col gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto text-xl font-bold">
                    ✓
                </div>
                <h1 className="text-xl font-bold text-[#0B2545]">Password Reset Successful</h1>
                <p className="text-sm text-[#64748B]">
                    Your password has been securely updated. You can now sign in with your new password.
                </p>
                <Link
                    href="/login"
                    className="w-full mt-2 py-2.5 px-4 rounded-lg bg-[#C9A227] text-[#0B2545] font-bold text-center hover:opacity-90 transition"
                >
                    Sign In
                </Link>
            </div>
        );
    }

    return (
        <>
            {/* Title */}
            <div className="text-center mb-6">
                <h1 className="text-xl font-bold text-[#0B2545] tracking-tight">
                    {urlToken ? "Reset Your Password" : "Set a New Password"}
                </h1>
                <p className="text-sm text-[#64748B] mt-1">
                    {urlToken
                        ? "Enter and confirm your new password below."
                        : "This is your first sign-in. Please choose a new password to continue."}
                </p>
            </div>

            {/* Error message */}
            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 text-center">
                    {error}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* New password */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="newPassword" className="text-sm font-semibold text-[#0B2545]">
                        New Password
                    </label>
                    <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8FAFC] text-[#1E2A3A] placeholder:text-[#64748B]/60 focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition"
                    />
                </div>

                {/* Confirm password */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="confirmPassword" className="text-sm font-semibold text-[#0B2545]">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8FAFC] text-[#1E2A3A] placeholder:text-[#64748B]/60 focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-2.5 px-4 rounded-lg bg-[#C9A227] text-[#0B2545] font-bold hover:opacity-90 active:scale-[0.99] transition disabled:opacity-50"
                >
                    {isLoading ? "Saving..." : "Save New Password"}
                </button>

                <div className="mt-2 text-center">
                    <Link href="/login" className="text-xs text-[#64748B] hover:text-[#0B2545] font-medium">
                        ← Back to Sign In
                    </Link>
                </div>
            </form>
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <main className="w-full min-h-screen flex justify-center items-center bg-[#F8FAFC] px-4">
            <div className="w-full max-w-110 bg-white rounded-xl shadow-xl p-8 flex flex-col">
                {/* Wordmark */}
                <div className="flex justify-center items-center mb-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo.png" alt="E310 ITS Support" className="h-10" />
                </div>

                <Suspense fallback={<p className="text-sm text-[#64748B] text-center">Loading...</p>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </main>
    );
}
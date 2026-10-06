"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
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
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Your session has expired. Please sign in again.");
                router.push("/login");
                return;
            }

            const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
            const endpoint = baseUrl.endsWith("/api") ? `${baseUrl}/auth/reset-password` : `${baseUrl}/api/auth/reset-password`;

            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
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
                    // ignore malformed cache, not critical
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
                    <h1 className="text-xl font-bold text-[#0B2545] tracking-tight">Set a New Password</h1>
                    <p className="text-sm text-[#64748B] mt-1">
                        This is your first sign-in. Please choose a new password to continue.
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
                        className="w-full mt-2 py-2.5 px-4 rounded-lg bg-[#C9A227] text-[#0B2545] font-bold hover:opacity-90 active:scale-[0.99] transition"
                    >
                        {isLoading ? "Saving..." : "Save New Password"}
                    </button>
                </form>
            </div>
        </main>
    );
}
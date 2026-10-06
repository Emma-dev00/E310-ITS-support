"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";

function generateTempPassword() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let pwd = "";
    for (let i = 0; i < 12; i++) {
        pwd += chars[Math.floor(Math.random() * chars.length)];
    }
    return pwd;
}

export default function CreateUserPage() {
    const { isAuthenticated, isLoading } = useRequireAuth();
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<{ role: string } | null>(null);

    const [email, setEmail] = useState("");
    const [role, setRole] = useState("STAFF");
    const [tempPassword, setTempPassword] = useState(generateTempPassword());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [createdUser, setCreatedUser] = useState<{ email: string; password: string } | null>(null);

    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
    const apiBase = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;

    useEffect(() => {
        const cachedUser = localStorage.getItem("user");
        if (cachedUser) {
            try {
                setCurrentUser(JSON.parse(cachedUser));
            } catch {
                // ignore malformed cache
            }
        }
    }, []);

    if (isLoading || !isAuthenticated) {
        return null;
    }

    if (currentUser && currentUser.role !== "TECHNICAL_LEAD_ADMIN") {
        return (
            <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
                <div className="bg-white rounded-xl shadow-xl p-8 text-center max-w-md">
                    <h1 className="text-lg font-bold text-[#0B2545] mb-2">Access restricted</h1>
                    <p className="text-sm text-[#64748B] mb-4">
                        Only a Technical Lead/Admin can create new users.
                    </p>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="text-sm text-[#C9A227] font-semibold"
                    >
                        ← Back to dashboard
                    </button>
                </div>
            </main>
        );
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!email.trim()) {
            setError("Please enter an email address.");
            return;
        }

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${apiBase}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password: tempPassword,
                    role,
                }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                setError(data?.message || "Failed to create user. Please try again.");
                return;
            }

            setCreatedUser({ email: email.trim(), password: tempPassword });
        } catch {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleCreateAnother() {
        setCreatedUser(null);
        setEmail("");
        setRole("STAFF");
        setTempPassword(generateTempPassword());
    }

    if (createdUser) {
        return (
            <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
                <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-14 h-14 rounded-full bg-[#C9A227] flex items-center justify-center mx-auto mb-4">
                        <span className="text-[#0B2545] text-2xl font-bold">✓</span>
                    </div>
                    <h1 className="text-lg font-bold text-[#0B2545] mb-4">User created</h1>

                    <div className="bg-[#F8FAFC] rounded-lg p-4 mb-4 text-left">
                        <p className="text-xs text-[#64748B] mb-1">Email</p>
                        <p className="text-sm font-medium text-[#0B2545] mb-3">{createdUser.email}</p>
                        <p className="text-xs text-[#64748B] mb-1">Temporary password</p>
                        <p className="text-sm font-mono font-medium text-[#0B2545]">{createdUser.password}</p>
                    </div>

                    <p className="text-xs text-[#64748B] mb-6">
                        Share these credentials with the new user. They&apos;ll be asked to set their own
                        password the first time they sign in.
                    </p>

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={handleCreateAnother}
                            className="px-4 py-2 rounded-lg border border-[#0B2545] text-[#0B2545] text-sm font-semibold"
                        >
                            Create Another
                        </button>
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="px-4 py-2 rounded-lg bg-[#C9A227] text-[#0B2545] text-sm font-bold hover:opacity-90 transition"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F8FAFC] px-4 py-10 flex justify-center">
            <div className="w-full max-w-lg">
                <button
                    onClick={() => router.push("/dashboard")}
                    className="text-sm text-[#64748B] hover:text-[#0B2545] mb-4"
                >
                    ← Back to Dashboard
                </button>

                <div className="bg-white rounded-xl shadow-xl p-8">
                    <h1 className="text-xl font-bold text-[#0B2545] mb-1">Create New User</h1>
                    <p className="text-sm text-[#64748B] mb-6">
                        Add a staff, technical team, or admin account.
                    </p>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-[#0B2545]">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8FAFC] text-[#1E2A3A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-[#0B2545]">Role</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="px-3.5 py-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#0B2545] focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                            >
                                <option value="STAFF">Staff</option>
                                <option value="TECHNICAL_TEAM">Technical Team</option>
                                <option value="TECHNICAL_LEAD_ADMIN">Technical Lead / Admin</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-[#0B2545]">Temporary Password</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={tempPassword}
                                    readOnly
                                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8FAFC] text-[#1E2A3A] font-mono text-sm border border-[#E2E8F0]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setTempPassword(generateTempPassword())}
                                    className="px-3 py-2.5 rounded-lg border border-[#0B2545] text-[#0B2545] text-sm font-semibold whitespace-nowrap"
                                >
                                    Regenerate
                                </button>
                            </div>
                            <p className="text-xs text-[#64748B]">
                                Auto-generated. You&apos;ll see this again after creating the user.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full mt-2 py-2.5 px-4 rounded-lg bg-[#C9A227] text-[#0B2545] font-bold hover:opacity-90 active:scale-[0.99] transition disabled:opacity-50"
                        >
                            {isSubmitting ? "Creating..." : "Create User"}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
} 
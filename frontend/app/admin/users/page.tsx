"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";

interface UserRow {
    id: string;
    email: string;
    role: string;
    isFirstLogin: boolean;
    createdAt: string;
    _count: { ticketsCreated: number; ticketsAssigned: number };
}

function formatRoleLabel(role: string) {
    return role
        .split("_")
        .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
        .join(" ");
}

export default function ManageUsersPage() {
    const { isAuthenticated, isLoading } = useRequireAuth();
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<{ id: string; role: string } | null>(null);
    const [users, setUsers] = useState<UserRow[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionUserId, setActionUserId] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [resetResult, setResetResult] = useState<{ email: string; temporaryPassword: string } | null>(null);

    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
    const apiBase = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;

    const loadUsers = useCallback(async () => {
        setIsFetching(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${apiBase}/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json().catch(() => null);

            if (!res.ok) {
                setError(data?.message || "Could not load users.");
                return;
            }

            setUsers(data?.data || []);
        } catch {
            setError("Could not load users. Please refresh the page.");
        } finally {
            setIsFetching(false);
        }
    }, [apiBase]);

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

    useEffect(() => {
        if (!isAuthenticated || currentUser?.role !== "TECHNICAL_LEAD_ADMIN") return;
        loadUsers();
    }, [isAuthenticated, currentUser, loadUsers]);

    async function handleRoleChange(userId: string, newRole: string) {
        setActionUserId(userId);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${apiBase}/users/${userId}/role`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ role: newRole }),
            });
            const data = await res.json().catch(() => null);

            if (!res.ok) {
                setError(data?.message || "Failed to update role.");
                return;
            }

            await loadUsers();
        } catch {
            setError("An unexpected error occurred while updating the role.");
        } finally {
            setActionUserId(null);
        }
    }

    async function handleResetPassword(userId: string) {
        setActionUserId(userId);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${apiBase}/users/${userId}/reset-password`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json().catch(() => null);

            if (!res.ok) {
                setError(data?.message || "Failed to reset password.");
                return;
            }

            setResetResult(data?.data || null);
            await loadUsers();
        } catch {
            setError("An unexpected error occurred while resetting the password.");
        } finally {
            setActionUserId(null);
        }
    }

    async function handleDelete(userId: string) {
        setActionUserId(userId);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${apiBase}/users/${userId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json().catch(() => null);

            if (!res.ok) {
                setError(data?.message || "Failed to delete user.");
                return;
            }

            setConfirmDeleteId(null);
            await loadUsers();
        } catch {
            setError("An unexpected error occurred while deleting the user.");
        } finally {
            setActionUserId(null);
        }
    }

    if (isLoading || !isAuthenticated) {
        return null;
    }

    if (currentUser && currentUser.role !== "TECHNICAL_LEAD_ADMIN") {
        return (
            <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
                <div className="bg-white rounded-xl shadow-xl p-8 text-center max-w-md">
                    <h1 className="text-lg font-bold text-[#0B2545] mb-2">Access restricted</h1>
                    <p className="text-sm text-[#64748B] mb-4">
                        Only a Technical Lead/Admin can manage users.
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

    return (
        <main className="min-h-screen bg-[#F8FAFC] px-4 py-10">
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => router.push("/dashboard")}
                    className="text-sm text-[#64748B] hover:text-[#0B2545] mb-4"
                >
                    ← Back to Dashboard
                </button>

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-[#0B2545]">Manage Users</h1>
                    <button
                        onClick={() => router.push("/admin/create-user")}
                        className="bg-[#C9A227] text-[#0B2545] font-bold px-5 py-2.5 rounded-lg hover:opacity-90 transition"
                    >
                        + Create User
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {resetResult && (
                    <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-200">
                        <p className="text-sm font-semibold text-green-800 mb-1">
                            Password reset for {resetResult.email}
                        </p>
                        <p className="text-sm text-green-800">
                            New temporary password:{" "}
                            <span className="font-mono font-bold">{resetResult.temporaryPassword}</span>
                        </p>
                        <button
                            onClick={() => setResetResult(null)}
                            className="text-xs text-green-700 hover:underline mt-2"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
                    {isFetching ? (
                        <p className="px-4 py-6 text-sm text-[#64748B]">Loading users...</p>
                    ) : users.length === 0 ? (
                        <p className="px-4 py-6 text-sm text-[#64748B]">No users found.</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-[#F8FAFC] text-[#64748B] text-left">
                                <tr>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3">First Login Pending</th>
                                    <th className="px-4 py-3">Tickets Submitted</th>
                                    <th className="px-4 py-3">Tickets Assigned</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id} className="border-t border-[#E2E8F0] hover:bg-[#F8FAFC]">
                                        <td className="px-4 py-3 text-[#0B2545] font-medium">{u.email}</td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={u.role}
                                                disabled={actionUserId === u.id || u.id === currentUser?.id}
                                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                className="px-2 py-1.5 rounded-lg border border-[#E2E8F0] text-sm text-[#0B2545] bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227] disabled:opacity-50"
                                            >
                                                <option value="STAFF">Staff</option>
                                                <option value="TECHNICAL_TEAM">Technical Team</option>
                                                <option value="TECHNICAL_LEAD_ADMIN">Technical Lead Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 text-[#64748B]">
                                            {u.isFirstLogin ? "Yes" : "No"}
                                        </td>
                                        <td className="px-4 py-3 text-[#64748B]">{u._count.ticketsCreated}</td>
                                        <td className="px-4 py-3 text-[#64748B]">{u._count.ticketsAssigned}</td>
                                        <td className="px-4 py-3">
                                            {u.id === currentUser?.id ? (
                                                <span className="text-xs text-[#94A3B8]">You</span>
                                            ) : (
                                                <div className="flex gap-3 items-center">
                                                    <button
                                                        onClick={() => handleResetPassword(u.id)}
                                                        disabled={actionUserId === u.id}
                                                        className="text-xs font-semibold text-[#0B2545] hover:underline disabled:opacity-50"
                                                    >
                                                        Reset Password
                                                    </button>
                                                    {confirmDeleteId === u.id ? (
                                                        <div className="flex gap-2 items-center">
                                                            <span className="text-xs text-red-600">Delete?</span>
                                                            <button
                                                                onClick={() => handleDelete(u.id)}
                                                                disabled={actionUserId === u.id}
                                                                className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
                                                            >
                                                                Yes
                                                            </button>
                                                            <button
                                                                onClick={() => setConfirmDeleteId(null)}
                                                                className="text-xs font-semibold text-[#64748B] hover:underline"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setConfirmDeleteId(u.id)}
                                                            className="text-xs font-semibold text-red-600 hover:underline"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </main>
    );
}

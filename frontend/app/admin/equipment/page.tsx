"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";

interface EquipmentItem {
    id: string;
    assetTag: string;
    type: string;
    location: string;
    createdAt?: string;
}

export default function AdminEquipmentPage() {
    const { isAuthenticated, isLoading } = useRequireAuth();
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<{ id: string; role: string } | null>(null);
    const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Modal & form states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [assetTag, setAssetTag] = useState("");
    const [type, setType] = useState("");
    const [location, setLocation] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
    const apiBase = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;

    const loadEquipment = useCallback(async () => {
        setIsFetching(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${apiBase}/equipment`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json().catch(() => null);

            if (!res.ok) {
                setError(data?.message || "Could not load equipment.");
                return;
            }

            setEquipment(data?.data || []);
        } catch {
            setError("Could not load equipment. Please refresh the page.");
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
        loadEquipment();
    }, [isAuthenticated, currentUser, loadEquipment]);

    async function handleRegisterEquipment(e: React.FormEvent) {
        e.preventDefault();
        setFormError(null);

        if (!assetTag.trim() || !type.trim() || !location.trim()) {
            setFormError("All fields (Asset Tag, Type, and Location) are required.");
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${apiBase}/equipment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    assetTag: assetTag.trim(),
                    type: type.trim(),
                    location: location.trim(),
                }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                setFormError(data?.message || "Failed to register equipment.");
                return;
            }

            setSuccessMessage(`Equipment '${assetTag.trim()}' successfully registered.`);
            setAssetTag("");
            setType("");
            setLocation("");
            setIsModalOpen(false);
            await loadEquipment();
        } catch {
            setFormError("An unexpected error occurred while registering equipment.");
        } finally {
            setIsSubmitting(false);
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
                        Only a Technical Lead/Admin can manage equipment.
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
                    <div>
                        <h1 className="text-2xl font-bold text-[#0B2545]">Equipment Management</h1>
                        <p className="text-sm text-[#64748B] mt-1">
                            Track hardware, devices, and classroom equipment across campus.
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setFormError(null);
                            setIsModalOpen(true);
                        }}
                        className="bg-[#C9A227] text-[#0B2545] font-bold px-5 py-2.5 rounded-lg hover:opacity-90 transition"
                    >
                        + Register Equipment
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-200 flex justify-between items-center">
                        <p className="text-sm font-semibold text-green-800">{successMessage}</p>
                        <button
                            onClick={() => setSuccessMessage(null)}
                            className="text-xs text-green-700 hover:underline"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Equipment Table */}
                <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
                    {isFetching ? (
                        <p className="px-4 py-6 text-sm text-[#64748B]">Loading equipment...</p>
                    ) : equipment.length === 0 ? (
                        <p className="px-4 py-6 text-sm text-[#64748B]">No equipment items found.</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-[#F8FAFC] text-[#64748B] text-left">
                                <tr>
                                    <th className="px-4 py-3">Asset Tag</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3">Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                {equipment.map((item) => (
                                    <tr key={item.id} className="border-t border-[#E2E8F0] hover:bg-[#F8FAFC]">
                                        <td className="px-4 py-3 font-mono font-medium text-[#0B2545]">
                                            {item.assetTag}
                                        </td>
                                        <td className="px-4 py-3 text-[#1E2A3A]">{item.type}</td>
                                        <td className="px-4 py-3 text-[#64748B]">{item.location}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Register Equipment Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 max-w-md w-full">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-[#0B2545]">Register New Equipment</h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                                >
                                    ✕
                                </button>
                            </div>

                            {formError && (
                                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                                    {formError}
                                </div>
                            )}

                            <form onSubmit={handleRegisterEquipment} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-[#0B2545]">Asset Tag</label>
                                    <input
                                        type="text"
                                        required
                                        value={assetTag}
                                        onChange={(e) => setAssetTag(e.target.value)}
                                        placeholder="e.g. PC-E310-01"
                                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E2A3A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-[#0B2545]">Equipment Type</label>
                                    <input
                                        type="text"
                                        required
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        placeholder="e.g. Desktop PC, Projector, Smart Board"
                                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E2A3A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-[#0B2545]">Location</label>
                                    <input
                                        type="text"
                                        required
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="e.g. Room E310 - Row 2"
                                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E2A3A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition"
                                    />
                                </div>

                                <div className="flex gap-3 justify-end mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:text-[#0B2545] text-sm font-semibold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-5 py-2 rounded-lg bg-[#C9A227] text-[#0B2545] text-sm font-bold hover:opacity-90 transition disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Registering..." : "Register"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";

interface DashboardStats {
    total: number;
    open: number;
    assigned: number;
    inProgress: number;
    resolved: number;
    closed: number;
    resolvedThisMonth: number;
}

interface SlaMetrics {
    byPriority: { priority: string; count: number }[];
    byCategory: { categoryId: string; categoryName: string; count: number }[];
    technicians: { id: string; email: string; activeTicketsCount: number }[];
}

export default function AdminAnalyticsPage() {
    const { isAuthenticated, isLoading } = useRequireAuth();
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<{ id: string; role: string } | null>(null);
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
    const [slaMetrics, setSlaMetrics] = useState<SlaMetrics | null>(null);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
    const apiBase = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;

    const loadAnalytics = useCallback(async () => {
        setIsFetching(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            const [dashRes, slaRes] = await Promise.all([
                fetch(`${apiBase}/analytics/dashboard`, { headers }),
                fetch(`${apiBase}/analytics/sla`, { headers }),
            ]);

            const [dashData, slaData] = await Promise.all([
                dashRes.json().catch(() => null),
                slaRes.json().catch(() => null),
            ]);

            if (!dashRes.ok || !slaRes.ok) {
                setError(
                    dashData?.message ||
                    slaData?.message ||
                    "Could not load analytics metrics."
                );
                return;
            }

            setDashboardStats(dashData?.data || null);
            setSlaMetrics(slaData?.data || null);
        } catch {
            setError("Could not load analytics data. Please refresh the page.");
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
        loadAnalytics();
    }, [isAuthenticated, currentUser, loadAnalytics]);

    if (isLoading || !isAuthenticated) {
        return null;
    }

    if (currentUser && currentUser.role !== "TECHNICAL_LEAD_ADMIN") {
        return (
            <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
                <div className="bg-white rounded-xl shadow-xl p-8 text-center max-w-md">
                    <h1 className="text-lg font-bold text-[#0B2545] mb-2">Access restricted</h1>
                    <p className="text-sm text-[#64748B] mb-4">
                        Only a Technical Lead/Admin can view analytics and SLA metrics.
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
                        <h1 className="text-2xl font-bold text-[#0B2545]">Analytics & SLA Overview</h1>
                        <p className="text-sm text-[#64748B] mt-1">
                            Real-time metrics on ticket resolution, category volume, and technician workload.
                        </p>
                    </div>
                    <button
                        onClick={loadAnalytics}
                        disabled={isFetching}
                        className="border border-[#E2E8F0] bg-white text-[#0B2545] font-semibold text-sm px-4 py-2 rounded-lg hover:bg-[#F8FAFC] transition disabled:opacity-50"
                    >
                        {isFetching ? "Refreshing..." : "Refresh Data"}
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {isFetching && !dashboardStats ? (
                    <div className="bg-white rounded-lg border border-[#E2E8F0] p-8 text-center text-[#64748B] text-sm">
                        Loading analytics data...
                    </div>
                ) : (
                    <>
                        {/* Overall Ticket Stat Cards */}
                        <div className="mb-8">
                            <h2 className="text-base font-bold text-[#0B2545] mb-3">Ticket Status Summary</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="bg-white rounded-lg border border-[#E2E8F0] p-4">
                                    <p className="text-xs text-[#64748B]">Total Tickets</p>
                                    <p className="text-2xl font-bold text-[#0B2545]">
                                        {dashboardStats?.total ?? 0}
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg border border-[#E2E8F0] p-4">
                                    <p className="text-xs text-[#64748B]">Open</p>
                                    <p className="text-2xl font-bold text-[#64748B]">
                                        {dashboardStats?.open ?? 0}
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg border border-[#E2E8F0] p-4">
                                    <p className="text-xs text-[#64748B]">Assigned</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {dashboardStats?.assigned ?? 0}
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg border border-[#E2E8F0] p-4">
                                    <p className="text-xs text-[#64748B]">In Progress</p>
                                    <p className="text-2xl font-bold text-[#C9A227]">
                                        {dashboardStats?.inProgress ?? 0}
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg border border-[#E2E8F0] p-4">
                                    <p className="text-xs text-[#64748B]">Resolved</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {dashboardStats?.resolved ?? 0}
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg border border-[#E2E8F0] p-4">
                                    <p className="text-xs text-[#64748B]">Closed</p>
                                    <p className="text-2xl font-bold text-gray-700">
                                        {dashboardStats?.closed ?? 0}
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg border border-[#E2E8F0] p-4 sm:col-span-2">
                                    <p className="text-xs text-[#64748B]">Resolved This Month</p>
                                    <p className="text-2xl font-bold text-green-700">
                                        {dashboardStats?.resolvedThisMonth ?? 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Breakdowns: Priority & Category */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* By Priority */}
                            <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
                                <div className="px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
                                    <h3 className="text-sm font-bold text-[#0B2545]">Tickets by Priority</h3>
                                </div>
                                {!slaMetrics?.byPriority || slaMetrics.byPriority.length === 0 ? (
                                    <p className="p-4 text-sm text-[#64748B]">No priority records found.</p>
                                ) : (
                                    <table className="w-full text-sm">
                                        <thead className="bg-[#F8FAFC] text-[#64748B] text-left">
                                            <tr>
                                                <th className="px-4 py-2.5 font-medium">Priority</th>
                                                <th className="px-4 py-2.5 font-medium text-right">Tickets</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {slaMetrics.byPriority.map((item) => (
                                                <tr key={item.priority} className="border-t border-[#E2E8F0] hover:bg-[#F8FAFC]">
                                                    <td className="px-4 py-2.5 font-medium text-[#0B2545]">
                                                        {item.priority}
                                                    </td>
                                                    <td className="px-4 py-2.5 text-right font-semibold text-[#1E2A3A]">
                                                        {item.count}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            {/* By Category */}
                            <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
                                <div className="px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
                                    <h3 className="text-sm font-bold text-[#0B2545]">Tickets by Category</h3>
                                </div>
                                {!slaMetrics?.byCategory || slaMetrics.byCategory.length === 0 ? (
                                    <p className="p-4 text-sm text-[#64748B]">No category records found.</p>
                                ) : (
                                    <table className="w-full text-sm">
                                        <thead className="bg-[#F8FAFC] text-[#64748B] text-left">
                                            <tr>
                                                <th className="px-4 py-2.5 font-medium">Category</th>
                                                <th className="px-4 py-2.5 font-medium text-right">Tickets</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {slaMetrics.byCategory.map((item) => (
                                                <tr key={item.categoryId} className="border-t border-[#E2E8F0] hover:bg-[#F8FAFC]">
                                                    <td className="px-4 py-2.5 font-medium text-[#0B2545]">
                                                        {item.categoryName}
                                                    </td>
                                                    <td className="px-4 py-2.5 text-right font-semibold text-[#1E2A3A]">
                                                        {item.count}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                        {/* Technician Active Workload */}
                        <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
                            <div className="px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
                                <h3 className="text-sm font-bold text-[#0B2545]">Technician Workload (Assigned & In Progress)</h3>
                            </div>
                            {!slaMetrics?.technicians || slaMetrics.technicians.length === 0 ? (
                                <p className="p-4 text-sm text-[#64748B]">No technician accounts found.</p>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="bg-[#F8FAFC] text-[#64748B] text-left">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Technician</th>
                                            <th className="px-4 py-3 font-medium text-right">Active Tickets</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {slaMetrics.technicians.map((tech) => (
                                            <tr key={tech.id} className="border-t border-[#E2E8F0] hover:bg-[#F8FAFC]">
                                                <td className="px-4 py-3 text-[#0B2545] font-medium">
                                                    {tech.email}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                        tech.activeTicketsCount > 0
                                                            ? "bg-[#C9A227]/20 text-[#0B2545]"
                                                            : "bg-gray-100 text-gray-600"
                                                    }`}>
                                                        {tech.activeTicketsCount} active
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}

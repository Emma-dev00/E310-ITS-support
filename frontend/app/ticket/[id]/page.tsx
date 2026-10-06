"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";

interface Person {
    id: string;
    email: string;
    role: string;
}

interface Technician {
    id: string;
    email: string;
    role: string;
    _count?: { ticketsAssigned: number };
}

interface ActivityLog {
    id: string;
    action: string;
    timestamp: string;
    user: Person;
}

interface TicketDetail {
    id: string;
    description: string;
    status: string;
    priority: string;
    deviceLocation: string | null;
    createdAt: string;
    resolvedAt: string | null;
    category: { id: string; name: string };
    staff: Person;
    technician: Person | null;
    activityLogs: ActivityLog[];
}

const statusStyles: Record<string, string> = {
    OPEN: "bg-gray-100 text-gray-600 border border-gray-300",
    ASSIGNED: "bg-blue-100 text-blue-700",
    IN_PROGRESS: "bg-[#C9A227] text-[#0B2545]",
    RESOLVED: "bg-green-100 text-green-700",
    CLOSED: "bg-gray-200 text-gray-700",
    REOPENED: "bg-red-100 text-red-700",
};

const priorityStyles: Record<string, string> = {
    LOW: "bg-gray-100 text-gray-600",
    MEDIUM: "bg-blue-100 text-blue-700",
    HIGH: "bg-orange-100 text-orange-700",
    URGENT: "bg-red-100 text-red-700",
};

function formatLabel(value: string) {
    return value
        .split("_")
        .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
        .join(" ");
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString();
}

export default function TicketDetailPage() {
    const { isAuthenticated, isLoading } = useRequireAuth();
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [ticket, setTicket] = useState<TicketDetail | null>(null);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [newStatus, setNewStatus] = useState("");
    const [currentUser, setCurrentUser] = useState<Person | null>(null);
    const [technicians, setTechnicians] = useState<Technician[]>([]);
    const [selectedTechId, setSelectedTechId] = useState("");

    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
    const apiBase = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;

    const loadTicket = useCallback(async () => {
        setIsFetching(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${apiBase}/tickets/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json().catch(() => null);

            if (!res.ok) {
                setError(data?.message || "Could not load this ticket.");
                return;
            }

            const t = data?.data;
            setTicket(t);
            setNewStatus(t?.status || "");
            setSelectedTechId(t?.technician?.id || "");
        } catch {
            setError("Could not load this ticket. Please refresh the page.");
        } finally {
            setIsFetching(false);
        }
    }, [apiBase, id]);

    useEffect(() => {
        if (!isAuthenticated || !id) return;

        const cachedUser = localStorage.getItem("user");
        if (cachedUser) {
            try {
                setCurrentUser(JSON.parse(cachedUser));
            } catch {
                // ignore malformed cache
            }
        }

        loadTicket();
    }, [isAuthenticated, id, loadTicket]);

    useEffect(() => {
        if (!isAuthenticated || currentUser?.role !== "TECHNICAL_LEAD_ADMIN") return;

        async function loadTechnicians() {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${apiBase}/users/technicians`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json().catch(() => null);
                if (res.ok) {
                    setTechnicians(data?.data || []);
                }
            } catch {
                // non-critical, dropdown just stays empty
            }
        }

        loadTechnicians();
    }, [isAuthenticated, currentUser, apiBase]);

    async function handleAssign(technicianId: string) {
        if (!technicianId) return;
        setActionLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${apiBase}/tickets/${id}/assign`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ technicianId }),
            });
            const data = await res.json().catch(() => null);

            if (!res.ok) {
                setError(data?.message || "Failed to assign ticket.");
                return;
            }

            await loadTicket();
        } catch {
            setError("An unexpected error occurred while assigning.");
        } finally {
            setActionLoading(false);
        }
    }

    async function handleStatusUpdate() {
        if (!newStatus) return;
        setActionLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${apiBase}/tickets/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json().catch(() => null);

            if (!res.ok) {
                setError(data?.message || "Failed to update status.");
                return;
            }

            await loadTicket();
        } catch {
            setError("An unexpected error occurred while updating status.");
        } finally {
            setActionLoading(false);
        }
    }

    if (isLoading || !isAuthenticated) {
        return null;
    }

    const isAdmin = currentUser?.role === "TECHNICAL_LEAD_ADMIN";
    const isTech = currentUser?.role === "TECHNICAL_TEAM";
    const canAssignToMe = isTech && ticket && !ticket.technician;
    const canUpdateStatus =
        (isTech || isAdmin) && ticket && (ticket.technician?.id === currentUser?.id || isAdmin);

    return (
        <main className="min-h-screen bg-[#F8FAFC] px-4 py-10 flex justify-center">
            <div className="w-full max-w-3xl">
                <button
                    onClick={() => router.push("/dashboard")}
                    className="text-sm text-[#64748B] hover:text-[#0B2545] mb-4"
                >
                    ← Back to My Tickets
                </button>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {isFetching ? (
                    <div className="bg-white rounded-xl shadow-xl p-8 text-sm text-[#64748B]">
                        Loading ticket...
                    </div>
                ) : !ticket ? (
                    <div className="bg-white rounded-xl shadow-xl p-8 text-sm text-[#64748B]">
                        Ticket not found.
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-xl shadow-xl p-8 mb-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-xl font-bold text-[#0B2545]">
                                        Ticket #{ticket.id.slice(0, 8)}
                                    </h1>
                                    <p className="text-sm text-[#64748B] mt-1">
                                        {ticket.category?.name} · Submitted {formatDate(ticket.createdAt)}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <span
                                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[ticket.status] || "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {formatLabel(ticket.status)}
                                    </span>
                                    <span
                                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${priorityStyles[ticket.priority] || "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {formatLabel(ticket.priority)}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                <div>
                                    <p className="text-[#64748B]">Submitted by</p>
                                    <p className="text-[#0B2545] font-medium">{ticket.staff?.email}</p>
                                </div>
                                <div>
                                    <p className="text-[#64748B]">Assigned to</p>
                                    <p className="text-[#0B2545] font-medium">
                                        {ticket.technician?.email || "Unassigned"}
                                    </p>
                                </div>
                                {ticket.deviceLocation && (
                                    <div>
                                        <p className="text-[#64748B]">Device / Location</p>
                                        <p className="text-[#0B2545] font-medium">{ticket.deviceLocation}</p>
                                    </div>
                                )}
                                {ticket.resolvedAt && (
                                    <div>
                                        <p className="text-[#64748B]">Resolved</p>
                                        <p className="text-[#0B2545] font-medium">{formatDate(ticket.resolvedAt)}</p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <p className="text-[#64748B] text-sm mb-1">Description</p>
                                <p className="text-[#1E2A3A] text-sm whitespace-pre-wrap">{ticket.description}</p>
                            </div>

                            {/* Admin: assign/reassign to any technician */}
                            {isAdmin && (
                                <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
                                    <p className="text-sm font-semibold text-[#0B2545] mb-2">Assign to technician</p>
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <select
                                            value={selectedTechId}
                                            onChange={(e) => setSelectedTechId(e.target.value)}
                                            className="px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#0B2545] bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                                        >
                                            <option value="">Select a technician...</option>
                                            {technicians.map((tech) => (
                                                <option key={tech.id} value={tech.id}>
                                                    {tech.email}
                                                    {typeof tech._count?.ticketsAssigned === "number"
                                                        ? ` (${tech._count.ticketsAssigned} open)`
                                                        : ""}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => handleAssign(selectedTechId)}
                                            disabled={
                                                actionLoading || !selectedTechId || selectedTechId === ticket.technician?.id
                                            }
                                            className="px-4 py-2 rounded-lg bg-[#0B2545] text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            {actionLoading ? "Assigning..." : "Assign"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Technician: claim an unassigned ticket for themselves */}
                            {canAssignToMe && (
                                <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
                                    <button
                                        onClick={() => handleAssign(currentUser!.id)}
                                        disabled={actionLoading}
                                        className="px-4 py-2 rounded-lg bg-[#0B2545] text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        {actionLoading ? "Assigning..." : "Assign to Me"}
                                    </button>
                                </div>
                            )}

                            {/* Status update: assigned technician, or admin */}
                            {canUpdateStatus && (
                                <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
                                    <p className="text-sm font-semibold text-[#0B2545] mb-2">Update status</p>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={newStatus}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                            className="px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#0B2545] bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                                        >
                                            {["OPEN", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "CLOSED", "REOPENED"].map(
                                                (s) => (
                                                    <option key={s} value={s}>
                                                        {formatLabel(s)}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                        <button
                                            onClick={handleStatusUpdate}
                                            disabled={actionLoading || newStatus === ticket.status}
                                            className="px-4 py-2 rounded-lg bg-[#C9A227] text-[#0B2545] text-sm font-bold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            {actionLoading ? "Updating..." : "Update Status"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-xl shadow-xl p-8">
                            <h2 className="text-sm font-bold text-[#0B2545] mb-4">Activity</h2>
                            {ticket.activityLogs.length === 0 ? (
                                <p className="text-sm text-[#64748B]">No activity yet.</p>
                            ) : (
                                <ul className="flex flex-col gap-3">
                                    {ticket.activityLogs.map((log) => (
                                        <li key={log.id} className="text-sm border-l-2 border-[#E2E8F0] pl-3">
                                            <p className="text-[#1E2A3A]">{log.action}</p>
                                            <p className="text-[#94A3B8] text-xs mt-0.5">
                                                {log.user?.email} · {formatDate(log.timestamp)}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}   
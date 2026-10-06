"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";

interface Ticket {
  id: string;
  description: string;
  status: string;
  priority: string;
  deviceLocation: string | null;
  category: { id: string; name: string };
  createdAt: string;
}

interface CurrentUser {
  id: string;
  email: string;
  role: string;
}

const statusStyles: Record<string, string> = {
  OPEN: "bg-gray-100 text-gray-600 border border-gray-300",
  ASSIGNED: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-[#C9A227] text-[#0B2545]",
  RESOLVED: "bg-green-100 text-green-700",
  CLOSED: "bg-gray-200 text-gray-700",
  REOPENED: "bg-red-100 text-red-700",
};

function formatStatus(status: string) {
  return status
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

function formatRoleLabel(role: string) {
  return role
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useRequireAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
  const apiBase = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;

  useEffect(() => {
    if (!isAuthenticated) return;

    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      try {
        setCurrentUser(JSON.parse(cachedUser));
      } catch {
        // ignore malformed cache
      }
    }

    async function loadTickets() {
      setIsFetching(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${apiBase}/tickets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          setError(data?.message || "Could not load tickets.");
          return;
        }

        setTickets(data?.data || []);
      } catch {
        setError("Could not load tickets. Please refresh the page.");
      } finally {
        setIsFetching(false);
      }
    }

    loadTickets();
  }, [isAuthenticated, apiBase]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const role = currentUser?.role;
  const isStaff = role === "STAFF";
  const isTech = role === "TECHNICAL_TEAM";
  const isAdmin = role === "TECHNICAL_LEAD_ADMIN";

  const openCount = tickets.filter((t) => t.status === "OPEN").length;
  const inProgressCount = tickets.filter((t) =>
    ["ASSIGNED", "IN_PROGRESS"].includes(t.status)
  ).length;
  const resolvedCount = tickets.filter((t) => t.status === "RESOLVED").length;

  let heading = "My Tickets";
  let statLabels = { open: "Open Tickets", inProgress: "In Progress", resolved: "Resolved" };
  let emptyMessage = "No tickets yet.";

  if (isTech) {
    heading = "My Queue";
    statLabels = { open: "Unassigned", inProgress: "In Progress", resolved: "Resolved" };
    emptyMessage = "No tickets assigned to you, and nothing unassigned right now.";
  } else if (isAdmin) {
    heading = "All Tickets";
    statLabels = { open: "Open", inProgress: "In Progress", resolved: "Resolved" };
    emptyMessage = "No tickets have been submitted yet.";
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* Top nav */}
      <header className="bg-white border-b border-[#E2E8F0] px-6 py-4 flex justify-between items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="E310 ITS Support" className="h-8" />
        <div className="flex items-center gap-4">
          {isAdmin && (
            <>
              <Link
                href="/admin/create-user"
                className="text-sm text-[#0B2545] font-semibold hover:text-[#C9A227] transition"
              >
                + Create User
              </Link>
              <Link
                href="/admin/users"
                className="text-sm text-[#0B2545] font-semibold hover:text-[#C9A227] transition"
              >
                Manage Users
              </Link>
              <Link
                href="/admin/equipment"
                className="text-sm text-[#0B2545] font-semibold hover:text-[#C9A227] transition"
              >
                Equipment
              </Link>
              <Link
                href="/admin/analytics"
                className="text-sm text-[#0B2545] font-semibold hover:text-[#C9A227] transition"
              >
                Analytics
              </Link>
              <Link
                href="/qr-code"
                className="text-sm text-[#0B2545] font-semibold hover:text-[#C9A227] transition"
              >
                QR Code
              </Link>
            </>
          )}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0B2545] text-white flex items-center justify-center text-sm font-bold">
              {currentUser?.email?.[0]?.toUpperCase() || "?"}
            </div>
            <span className="text-sm text-[#64748B]">
              {role ? formatRoleLabel(role) : ""}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-[#64748B] hover:text-[#0B2545] border border-[#E2E8F0] rounded-lg px-3 py-1.5 transition"
          >
            Log Out
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header row */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#0B2545]">{heading}</h1>
          {isStaff && (
            <Link
              href="/report-issue"
              className="bg-[#C9A227] text-[#0B2545] font-bold px-5 py-2.5 rounded-lg hover:opacity-90 transition"
            >
              + Report an Issue
            </Link>
          )}
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-[#E2E8F0] p-4">
            <p className="text-xs text-[#64748B]">{statLabels.open}</p>
            <p className="text-2xl font-bold text-[#0B2545]">{openCount}</p>
          </div>
          <div className="bg-white rounded-lg border border-[#E2E8F0] p-4">
            <p className="text-xs text-[#64748B]">{statLabels.inProgress}</p>
            <p className="text-2xl font-bold text-[#C9A227]">{inProgressCount}</p>
          </div>
          <div className="bg-white rounded-lg border border-[#E2E8F0] p-4">
            <p className="text-xs text-[#64748B]">{statLabels.resolved}</p>
            <p className="text-2xl font-bold text-green-600">{resolvedCount}</p>
          </div>
        </div>

        {/* Ticket table */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
          {isFetching ? (
            <p className="px-4 py-6 text-sm text-[#64748B]">Loading tickets...</p>
          ) : tickets.length === 0 ? (
            <p className="px-4 py-6 text-sm text-[#64748B]">
              {emptyMessage}
              {isStaff && (
                <>
                  {" "}
                  <Link href="/report-issue" className="text-[#C9A227] font-semibold">
                    Report your first issue
                  </Link>
                  .
                </>
              )}
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFC] text-[#64748B] text-left">
                <tr>
                  <th className="px-4 py-3">Ticket ID</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id} className="border-t border-[#E2E8F0] hover:bg-[#F8FAFC]">
                    <td className="px-4 py-3 font-medium text-[#0B2545]">
                      #{t.id.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3 text-[#1E2A3A]">{t.category?.name}</td>
                    <td className="px-4 py-3 text-[#64748B] max-w-xs truncate">
                      {t.description}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[t.status] || "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {formatStatus(t.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/ticket/${t.id}`}
                        className="text-[#0B2545] hover:text-[#C9A227] font-medium"
                      >
                        View →
                      </Link>
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
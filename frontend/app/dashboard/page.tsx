"use client";

import Link from "next/link";

const fakeTickets = [
  { id: "#1049", category: "Network", description: "Conference Room B video call connection...", status: "In Progress" },
  { id: "#1045", category: "Hardware", description: "MacBook Pro battery draining fast, dies at 20%...", status: "In Progress" },
  { id: "#1041", category: "Software", description: "Excel crashes when opening large spreadsheets...", status: "Resolved" },
];

const statusStyles: Record<string, string> = {
  "Open": "bg-gray-100 text-gray-600 border border-gray-300",
  "In Progress": "bg-[#C9A227] text-[#0B2545]",
  "Resolved": "bg-green-100 text-green-700",
  "Closed": "bg-gray-200 text-gray-700",
};

export default function StaffDashboard() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* Top nav */}
      <header className="bg-white border-b border-[#E2E8F0] px-6 py-4 flex justify-between items-center">
        <img src="/logo.png" alt="E310 ITS Support" className="h-8" />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#0B2545] text-white flex items-center justify-center text-sm font-bold">
            E
          </div>
          <span className="text-sm text-[#64748B]">Staff</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header row */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#0B2545]">My Tickets</h1>
          <Link
            href="/report-issue"
            className="bg-[#C9A227] text-[#0B2545] font-bold px-5 py-2.5 rounded-lg hover:opacity-90 transition"
          >
            + Report an Issue
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-[#E2E8F0] p-4">
            <p className="text-xs text-[#64748B]">Open Tickets</p>
            <p className="text-2xl font-bold text-[#0B2545]">2</p>
          </div>
          <div className="bg-white rounded-lg border border-[#E2E8F0] p-4">
            <p className="text-xs text-[#64748B]">In Progress</p>
            <p className="text-2xl font-bold text-[#C9A227]">2</p>
          </div>
          <div className="bg-white rounded-lg border border-[#E2E8F0] p-4">
            <p className="text-xs text-[#64748B]">Resolved (this month)</p>
            <p className="text-2xl font-bold text-green-600">4</p>
          </div>
        </div>

        {/* Ticket table */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
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
              {fakeTickets.map((t) => (
                <tr key={t.id} className="border-t border-[#E2E8F0] hover:bg-[#F8FAFC]">
                  <td className="px-4 py-3 font-medium text-[#0B2545]">{t.id}</td>
                  <td className="px-4 py-3 text-[#1E2A3A]">{t.category}</td>
                  <td className="px-4 py-3 text-[#64748B] max-w-xs truncate">{t.description}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[t.status]}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/ticket/${t.id.replace("#", "")}`} className="text-[#0B2545] hover:text-[#C9A227] font-medium">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
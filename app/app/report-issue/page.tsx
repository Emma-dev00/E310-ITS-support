"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateIssueForm() {
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-xl p-10 max-w-md text-center">
          <div className="w-14 h-14 rounded-full bg-[#C9A227] flex items-center justify-center mx-auto mb-4">
            <span className="text-[#0B2545] text-2xl font-bold">✓</span>
          </div>
          <h1 className="text-xl font-bold text-[#0B2545] mb-2">Ticket #1050 submitted</h1>
          <p className="text-sm text-[#64748B] mb-6">
            You&apos;ll be notified when a technician is assigned.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-[#C9A227] text-[#0B2545] font-bold px-6 py-2.5 rounded-lg hover:opacity-90 transition"
          >
            View My Tickets →
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-10 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl p-8">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm text-[#64748B] hover:text-[#0B2545] mb-4"
        >
          ← Back to My Tickets
        </button>
        <h1 className="text-2xl font-bold text-[#0B2545] mb-6">Report an Issue</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0B2545]">Category</label>
            <select className="px-3.5 py-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#C9A227]">
              <option>Computer/Laptop</option>
              <option>Network</option>
              <option>Printer</option>
              <option>Account/Access</option>
              <option>Software</option>
              <option>Hardware</option>
              <option>Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0B2545]">Priority</label>
            <div className="flex gap-2">
              {["Low", "Medium", "High", "Urgent"].map((p) => (
                <label key={p} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E2E8F0] cursor-pointer text-sm">
                  <input type="radio" name="priority" value={p} defaultChecked={p === "Medium"} />
                  {p}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0B2545]">Device / Location</label>
            <input
              type="text"
              placeholder="e.g. Front desk printer, Room 204"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8FAFC] text-[#1E2A3A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0B2545]">Description</label>
            <textarea
              rows={4}
              placeholder="Describe the issue in detail — what happened, when it started, any error messages you saw"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8FAFC] text-[#1E2A3A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="px-5 py-2.5 rounded-lg border border-[#0B2545] text-[#0B2545] font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#C9A227] text-[#0B2545] font-bold hover:opacity-90 transition"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
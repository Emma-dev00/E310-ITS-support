"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";

interface Category {
  id: string;
  name: string;
}

export default function CreateIssueForm() {
  const { isAuthenticated, isLoading } = useRequireAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [deviceLocation, setDeviceLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const router = useRouter();

  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
  const apiBase = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;

  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadCategories() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${apiBase}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => null);
        const list = data?.data || data || [];
        setCategories(list);
        if (list.length > 0) {
          setCategoryId(list[0].id);
        }
      } catch {
        setError("Could not load categories. Please refresh the page.");
      }
    }

    loadCategories();
  }, [isAuthenticated, apiBase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }
    if (!description.trim()) {
      setError("Please describe the issue.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiBase}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          categoryId,
          description,
          priority,
          deviceLocation: deviceLocation || null,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "Failed to submit ticket. Please try again.");
        return;
      }

      const ticket = data?.data || data;
      setTicketId(ticket?.id || null);
      setSubmitted(true);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading || !isAuthenticated) {
    return null;
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-xl p-10 max-w-md text-center">
          <div className="w-14 h-14 rounded-full bg-[#C9A227] flex items-center justify-center mx-auto mb-4">
            <span className="text-[#0B2545] text-2xl font-bold">✓</span>
          </div>
          <h1 className="text-xl font-bold text-[#0B2545] mb-2">
            {ticketId ? `Ticket #${ticketId.slice(0, 8)} submitted` : "Ticket submitted"}
          </h1>
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

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0B2545]">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="px-3.5 py-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
            >
              {categories.length === 0 && <option value="">Loading categories...</option>}
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0B2545]">Priority</label>
            <div className="flex gap-2">
              {["LOW", "MEDIUM", "HIGH", "URGENT"].map((p) => (
                <label key={p} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E2E8F0] cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="priority"
                    value={p}
                    checked={priority === p}
                    onChange={() => setPriority(p)}
                  />
                  {p.charAt(0) + p.slice(1).toLowerCase()}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0B2545]">Device / Location</label>
            <input
              type="text"
              value={deviceLocation}
              onChange={(e) => setDeviceLocation(e.target.value)}
              placeholder="e.g. Front desk printer, Room 204"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8FAFC] text-[#1E2A3A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0B2545]">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg bg-[#C9A227] text-[#0B2545] font-bold hover:opacity-90 transition"
            >
              {isSubmitting ? "Submitting..." : "Submit Ticket"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function QrCodePage() {
    const router = useRouter();
    const [reportUrl, setReportUrl] = useState("/report-issue");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setReportUrl(`${window.location.origin}/report-issue`);
        }
    }, []);

    const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
        reportUrl
    )}`;

    return (
        <main className="min-h-screen bg-[#F8FAFC] px-4 py-10 flex flex-col items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 border border-[#E2E8F0] text-center">
                <button
                    onClick={() => router.push("/dashboard")}
                    className="text-sm text-[#64748B] hover:text-[#0B2545] mb-6 inline-block font-medium"
                >
                    ← Back to Dashboard
                </button>

                <div className="w-12 h-12 rounded-full bg-[#0B2545] text-[#C9A227] flex items-center justify-center mx-auto mb-3 font-bold text-xl">
                    QR
                </div>

                <h1 className="text-2xl font-bold text-[#0B2545] mb-2">Scan to Report Issue</h1>
                <p className="text-sm text-[#64748B] mb-6">
                    Scan this QR code with any mobile device or tablet to immediately submit an ITS support ticket for Room E310.
                </p>

                {/* QR Code Container */}
                <div className="bg-[#F8FAFC] border-2 border-dashed border-[#E2E8F0] rounded-xl p-6 mb-6 flex flex-col items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={qrCodeApiUrl}
                        alt="QR Code to Report Issue"
                        width={240}
                        height={240}
                        className="rounded-lg shadow-sm bg-white p-2"
                    />
                    <p className="mt-3 text-xs font-mono text-[#64748B] break-all">
                        {reportUrl}
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <Link
                        href="/report-issue"
                        className="w-full py-2.5 px-4 rounded-lg bg-[#C9A227] text-[#0B2545] font-bold text-sm hover:opacity-90 transition text-center"
                    >
                        Open Issue Reporter Directly
                    </Link>
                    <button
                        onClick={() => window.print()}
                        className="w-full py-2 px-4 rounded-lg border border-[#0B2545] text-[#0B2545] text-sm font-semibold hover:bg-slate-50 transition"
                    >
                        Print Display Poster
                    </button>
                </div>
            </div>
        </main>
    );
}

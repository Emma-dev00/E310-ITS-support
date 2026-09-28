"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/dashboard");
  }

  return (
    <main className="w-full min-h-screen flex justify-center items-center bg-[#F8FAFC] px-4">
      <div className="w-full max-w-[440px] bg-white rounded-xl shadow-xl p-8 flex flex-col">
        {/* Wordmark */}
        <div className="flex justify-center items-center mb-6">
          <img src="/logo.png" alt="E310 ITS Support" className="h-10" />
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-[#0B2545] tracking-tight">Sign In</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Log in to report or manage technical issues
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-semibold text-[#0B2545]">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@company.com"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8FAFC] text-[#1E2A3A] placeholder:text-[#64748B]/60 focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-sm font-semibold text-[#0B2545]">
                Password
              </label>
              <a href="#" className="text-xs text-[#C9A227] hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative flex items-center">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8FAFC] text-[#1E2A3A] placeholder:text-[#64748B]/60 focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-[#64748B] hover:text-[#0B2545] text-xs"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-2 py-2.5 px-4 rounded-lg bg-[#C9A227] text-[#0B2545] font-bold hover:opacity-90 active:scale-[0.99] transition"
          >
            Sign In
          </button>
        </form>

        {/* Footer note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-[#64748B]">
            Don&apos;t have an account? Contact your{" "}
            <strong className="text-[#0B2545]">Technical Lead/Admin</strong> to be added.
          </p>
        </div>
      </div>
    </main>
  );
}
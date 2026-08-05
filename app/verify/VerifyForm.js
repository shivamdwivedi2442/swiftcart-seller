"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error("Enter the 6-digit OTP.");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setTimeout(() => router.push("/login"), 2000);
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <form onSubmit={handleVerify} className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center space-y-5">
        <div className="size-16 bg-indigo-50 flex items-center justify-center rounded-2xl mx-auto border border-indigo-100">
          <Mail className="size-8 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Verify Your Email</h1>
          <p className="text-slate-500 text-sm mt-1">OTP sent to {email}</p>
        </div>
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          placeholder="Enter 6-digit OTP"
          style={{ color: "#000000" }}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center text-2xl font-bold tracking-widest outline-none focus:border-indigo-500"
        />
        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-3.5 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
          {loading ? <Loader2 className="size-5 animate-spin" /> : "Verify"}
        </button>
      </form>
    </div>
  );
}
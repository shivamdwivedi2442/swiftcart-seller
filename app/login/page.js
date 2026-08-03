"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);
  const [unlockOtp, setUnlockOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill all fields.");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(data.error);
        if (data.locked) setLocked(true);
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendUnlockOtp = async () => {
    if (!email) return toast.error("Enter your email first.");
    setLoading(true);
    const res = await fetch("/api/auth/unlock-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success(data.message);
      setOtpSent(true);
    } else {
      toast.error(data.error);
    }
    setLoading(false);
  };

  const handleVerifyUnlock = async () => {
    setLoading(true);
    const res = await fetch("/api/auth/verify-unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: unlockOtp }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success(data.message);
      setLocked(false);
      setOtpSent(false);
    } else {
      toast.error(data.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-5">
        <div className="text-center space-y-3">
          <div className="size-16 bg-indigo-50 flex items-center justify-center rounded-2xl mx-auto border border-indigo-100">
            <Store className="size-8 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">SwiftCart Seller</h1>
            <p className="text-slate-500 text-sm mt-1">Login to manage your store</p>
          </div>
        </div>

        {!locked ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 text-sm" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 text-sm" />
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-3.5 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="size-5 animate-spin" /> : "Login"}
            </button>
            <p className="text-center text-sm text-slate-500">
              New seller? <Link href="/signup" className="text-indigo-600 font-semibold">Sign up</Link>
            </p>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-100 text-amber-700 text-xs p-3 rounded-xl text-center">
              Account locked due to failed attempts. Verify OTP to unlock.
            </div>
            {!otpSent ? (
              <button onClick={handleSendUnlockOtp} disabled={loading} className="w-full bg-amber-600 text-white p-3 rounded-xl font-bold hover:bg-amber-700 transition disabled:opacity-60">
                {loading ? <Loader2 className="size-5 animate-spin mx-auto" /> : "Send Unlock OTP"}
              </button>
            ) : (
              <>
                <input value={unlockOtp} onChange={(e) => setUnlockOtp(e.target.value)} maxLength={6} placeholder="Enter OTP" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-center tracking-widest outline-none focus:border-indigo-500" />
                <button onClick={handleVerifyUnlock} disabled={loading} className="w-full bg-indigo-600 text-white p-3 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-60">
                  {loading ? <Loader2 className="size-5 animate-spin mx-auto" /> : "Verify & Unlock"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
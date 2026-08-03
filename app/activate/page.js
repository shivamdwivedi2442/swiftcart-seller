"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Key, Loader2, CheckCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function ActivatePage() {
  const [email, setEmail] = useState("");
  const [activationCode, setActivationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginCode, setLoginCode] = useState(null);
  const router = useRouter();

  const handleActivate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, activationCode }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setLoginCode(data.loginCode);
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (loginCode) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center space-y-5">
          <CheckCircle className="size-14 text-emerald-600 mx-auto" />
          <h1 className="text-xl font-extrabold text-slate-900">Account Activated!</h1>
          <p className="text-slate-500 text-sm">Your permanent login code is:</p>
          <div className="text-2xl font-black tracking-widest bg-slate-50 border border-slate-200 rounded-xl p-4">
            {loginCode}
          </div>
          <p className="text-xs text-slate-400">Save this code — you'll need it every time you log in.</p>
          <button onClick={() => router.push("/login")} className="w-full bg-indigo-600 text-white p-3 rounded-xl font-bold hover:bg-indigo-700 transition">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <form onSubmit={handleActivate} className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center space-y-5">
        <div className="size-16 bg-indigo-50 flex items-center justify-center rounded-2xl mx-auto border border-indigo-100">
          <Key className="size-8 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Activate Your Account</h1>
          <p className="text-slate-500 text-sm mt-1">Enter the code from your approval email</p>
        </div>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 text-sm" />
        <input value={activationCode} onChange={(e) => setActivationCode(e.target.value)} maxLength={8} placeholder="8-digit Activation Code" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center text-lg font-bold tracking-widest outline-none focus:border-indigo-500" />
        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-3.5 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
          {loading ? <Loader2 className="size-5 animate-spin" /> : "Activate"}
        </button>
      </form>
    </div>
  );
}
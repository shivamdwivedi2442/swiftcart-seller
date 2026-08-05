"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, Loader2, Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.phone) {
      return toast.error("Please fill all fields.");
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        router.push(`/verify?email=${encodeURIComponent(form.email)}`);
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
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-4">
        <div className="text-center space-y-3">
          <div className="size-16 bg-indigo-50 flex items-center justify-center rounded-2xl mx-auto border border-indigo-100">
            <Store className="size-8 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Become a Seller</h1>
            <p className="text-slate-500 text-sm mt-1">Sign up — your account needs admin approval</p>
          </div>
        </div>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Full Name"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 text-sm text-slate-900"
        />
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          type="email"
          placeholder="Email"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 text-sm text-slate-900"
        />
        <input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Phone Number"
          maxLength={10}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 text-sm text-slate-900"
        />

        <div className="relative">
          <input
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-11 outline-none focus:border-indigo-500 text-sm text-slate-900"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-3.5 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
          {loading ? <Loader2 className="size-5 animate-spin" /> : "Sign Up"}
        </button>

        <p className="text-center text-sm text-slate-500">
          Already have an account? <Link href="/login" className="text-indigo-600 font-semibold">Login</Link>
        </p>
      </form>
    </div>
  );
}
"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "seller_token=; Max-Age=0; path=/;";
    router.push("/login");
    router.refresh();
  };

  return (
    <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-red-600 px-3 py-2 rounded-xl hover:bg-red-50 transition">
      <LogOut className="size-4" />
    </button>
  );
}
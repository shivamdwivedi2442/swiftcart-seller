import Link from "next/link";
import { Store, Package, ClipboardList } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import { hasNewOrders } from "@/actions/orderActions";

export default async function DashboardLayout({ children }) {
  const { hasNew } = await hasNewOrders();

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-slate-900">
            <Store className="size-5 text-indigo-600" /> SwiftCart Seller
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/products" className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-xl hover:bg-indigo-50 transition">
              <Package className="size-4" /> Products
            </Link>
            <Link href="/dashboard/orders" className="relative flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-xl hover:bg-indigo-50 transition">
              <ClipboardList className="size-4" /> Orders
              {hasNew && (
                <span className="absolute top-1 right-1 size-2 bg-emerald-500 rounded-full animate-pulse"></span>
              )}
            </Link>
            <LogoutButton />
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
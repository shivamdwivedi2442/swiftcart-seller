export const dynamic = "force-dynamic";

import { getSellerAnalytics } from "@/actions/analyticsActions";
import { IndianRupee, ShoppingBag, Eye, Package, TrendingUp } from "lucide-react";
import Image from "next/image";

export default async function DashboardPage() {
  const data = await getSellerAnalytics();

  if (!data.success) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <p className="text-slate-500">Unable to load analytics. Please try again.</p>
      </div>
    );
  }

  const { summary, products } = data;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Live view of your store's performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600">
              <IndianRupee className="size-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 font-bold uppercase">Total Revenue</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">₹{summary.totalRevenue.toLocaleString("en-IN")}</h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
              <ShoppingBag className="size-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 font-bold uppercase">Total Orders</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{summary.totalOrders}</h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-purple-50 p-2.5 rounded-xl text-purple-600">
              <TrendingUp className="size-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 font-bold uppercase">Units Sold</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{summary.totalUnitsSold}</h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-amber-50 p-2.5 rounded-xl text-amber-600">
              <Eye className="size-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 font-bold uppercase">Total Views</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{summary.totalViews}</h3>
        </div>
      </div>

      {/* Per-Product Performance */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Package className="size-5 text-indigo-600" /> Product Performance
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-sm">No products yet.</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs text-slate-400 uppercase font-semibold">
                <th className="p-4">Product</th>
                <th className="p-4">Views</th>
                <th className="p-4">Units Sold</th>
                <th className="p-4">Revenue</th>
                <th className="p-4">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="p-4 flex items-center gap-3">
                    <div className="relative w-10 h-10 bg-slate-50 rounded-lg border border-slate-100 overflow-hidden shrink-0">
                      <Image src={p.image} alt={p.name} fill className="object-contain p-1" unoptimized />
                    </div>
                    <span className="font-semibold text-slate-800">{p.name}</span>
                  </td>
                  <td className="p-4 text-slate-600 flex items-center gap-1">
                    <Eye className="size-3.5 text-slate-400" /> {p.views}
                  </td>
                  <td className="p-4">
                    <span className="bg-indigo-50 text-indigo-600 font-bold px-2.5 py-1 rounded-full text-xs">{p.unitsSold} sold</span>
                  </td>
                  <td className="p-4 font-bold text-slate-800">₹{p.revenue.toLocaleString("en-IN")}</td>
                  <td className="p-4">
                    {p.stock > 0 ? (
                      <span className="text-emerald-600 text-xs font-bold">{p.stock} in stock</span>
                    ) : (
                      <span className="text-red-600 text-xs font-bold">Out of stock</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { Package, RefreshCw, AlertCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { updateProductStock } from "@/actions/productActions";
import { useRouter } from "next/navigation";

export default function ProductsTable({ products }) {
  const [updatingId, setUpdatingId] = useState(null);
  const router = useRouter();

  const handleStockUpdate = async (productId, currentStock) => {
    const newStock = prompt("Enter new stock quantity:", currentStock);
    if (newStock !== null && newStock !== "" && !isNaN(newStock)) {
      setUpdatingId(productId);
      const toastId = toast.loading("Updating stock...");
      const res = await updateProductStock(productId, newStock);
      if (res.success) {
        toast.success(res.message, { id: toastId });
        router.refresh();
      } else {
        toast.error(res.error, { id: toastId });
      }
      setUpdatingId(null);
    }
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center">
        <Package className="size-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">No products yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <Toaster position="top-center" />
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500">
            <th className="p-4 font-semibold">Product</th>
            <th className="p-4 font-semibold">Price</th>
            <th className="p-4 font-semibold">Status</th>
            <th className="p-4 font-semibold">Stock</th>
            <th className="p-4 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="border-b border-slate-100 hover:bg-slate-50/50">
              <td className="p-4 flex items-center gap-3">
                <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover border" />
                <span className="font-semibold text-slate-800">{product.name}</span>
              </td>
              <td className="p-4 text-slate-600">₹{product.price}</td>
              <td className="p-4">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  product.status === "approved" ? "bg-emerald-50 text-emerald-600" :
                  product.status === "rejected" ? "bg-red-50 text-red-600" :
                  "bg-amber-50 text-amber-600"
                }`}>
                  {product.status}
                </span>
              </td>
              <td className="p-4">
                {product.stock > 0 ? (
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full text-xs">
                    {product.stock} Units
                  </span>
                ) : (
                  <span className="text-red-600 font-bold bg-red-50 px-3 py-1 rounded-full flex items-center gap-1 w-max text-xs">
                    <AlertCircle className="size-3" /> Out of Stock
                  </span>
                )}
              </td>
              <td className="p-4">
                <button
                  onClick={() => handleStockUpdate(product._id, product.stock)}
                  disabled={updatingId === product._id}
                  className="flex items-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition disabled:opacity-50"
                >
                  <RefreshCw className="size-4" /> Update Stock
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
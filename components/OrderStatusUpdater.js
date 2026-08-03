"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/actions/orderActions";

const statusColors = {
  Processing: "bg-amber-50 text-amber-600",
  Packed: "bg-blue-50 text-blue-600",
  "Out for Delivery": "bg-purple-50 text-purple-600",
  Delivered: "bg-emerald-50 text-emerald-600",
};

export default function OrderStatusUpdater({ orderId, currentStatus }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = async (e) => {
    setLoading(true);
    const res = await updateOrderStatus(orderId, e.target.value);
    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.error);
    }
    setLoading(false);
  };

  // Seller sirf Processing/Packed tak hi control kar sakta hai, aage locked hai
  const isLocked = !["Processing", "Packed"].includes(currentStatus);

  if (isLocked) {
    return (
      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusColors[currentStatus]}`}>
        {currentStatus}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {loading && <Loader2 className="size-4 animate-spin text-indigo-500" />}
      <select
        value={currentStatus}
        onChange={handleChange}
        disabled={loading}
        className={`text-xs font-bold px-3 py-1.5 rounded-full border-none outline-none cursor-pointer ${statusColors[currentStatus]}`}
      >
        <option value="Processing">Processing</option>
        <option value="Packed">Packed</option>
      </select>
    </div>
  );
}
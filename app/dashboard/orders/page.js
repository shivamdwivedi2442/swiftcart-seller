export const dynamic = "force-dynamic";

import { getSellerOrders } from "@/actions/orderActions";
import OrderStatusUpdater from "@/components/OrderStatusUpdater";
import { ClipboardList, MapPin } from "lucide-react";

export default async function OrdersPage() {
  const { orders } = await getSellerOrders();

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
          <ClipboardList className="size-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
          <p className="text-sm text-slate-500">Orders containing your products — pack them for delivery</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center">
          <ClipboardList className="size-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                <div>
                  <p className="text-xs text-slate-400">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="font-bold text-slate-800 text-sm">{order.customerName}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    {" • "}{order.paymentMethod} {order.paymentMethod === "COD" ? `(Collect ₹${order.myTotal.toLocaleString("en-IN")})` : "(Paid Online)"}
                  </p>
                </div>
                <OrderStatusUpdater orderId={order._id} currentStatus={order.status} />
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain bg-slate-50 rounded-lg border border-slate-100" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
                <MapPin className="size-3.5 shrink-0 mt-0.5" />
                <span>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
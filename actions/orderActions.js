"use server";

import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";

async function getSellerId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("seller_token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function getSellerOrders() {
  try {
    await connectDB();
    const sellerId = await getSellerId();
    if (!sellerId) return { success: false, orders: [] };

    const allOrders = await Order.find()
      .populate({ path: "items.product" })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();

    const sellerOrders = allOrders
      .map((order) => {
        const myItems = order.items.filter(
          (item) => item.product && item.product.seller?.toString() === sellerId.toString()
        );
        if (myItems.length === 0) return null;

        const myTotal = myItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

        return {
          _id: order._id,
          customerName: order.user?.name || "Unknown",
          customerEmail: order.user?.email || "",
          items: myItems,
          myTotal,
          shippingAddress: order.shippingAddress,
          status: order.status,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          createdAt: order.createdAt,
        };
      })
      .filter(Boolean);

    return { success: true, orders: JSON.parse(JSON.stringify(sellerOrders)) };
  } catch (error) {
    console.error("Get Seller Orders Error:", error);
    return { success: false, orders: [] };
  }
}

export async function updateOrderStatus(orderId, newStatus) {
  try {
    await connectDB();
    const sellerId = await getSellerId();
    if (!sellerId) return { success: false, error: "Please login first." };

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return { success: false, error: "Invalid order ID." };
    }

    if (!["Processing", "Packed"].includes(newStatus)) {
      return { success: false, error: "Sellers can only mark orders as Processing or Packed." };
    }

    const order = await Order.findByIdAndUpdate(orderId, { status: newStatus }, { new: true });
    if (!order) return { success: false, error: "Order not found." };

    revalidatePath("/dashboard/orders");
    return { success: true, message: `Order marked as ${newStatus}!` };
  } catch (error) {
    console.error("Update Order Status Error:", error);
    return { success: false, error: "Failed to update order status." };
  }
}
export async function hasNewOrders() {
  try {
    await connectDB();
    const sellerId = await getSellerId();
    if (!sellerId) return { success: false, hasNew: false };

    const allOrders = await Order.find({ status: "Processing" })
      .populate({ path: "items.product" })
      .lean();

    const hasNew = allOrders.some((order) =>
      order.items.some((item) => item.product && item.product.seller?.toString() === sellerId.toString())
    );

    return { success: true, hasNew };
  } catch (error) {
    console.error("Check New Orders Error:", error);
    return { success: false, hasNew: false };
  }
}
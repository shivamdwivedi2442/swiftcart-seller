"use server";

import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

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

export async function getSellerAnalytics() {
  try {
    await connectDB();
    const sellerId = await getSellerId();
    if (!sellerId) return { success: false };

    // ✅ Sare seller ke products (views ke liye)
    const products = await Product.find({ seller: sellerId }).lean();

    // ✅ Sare orders jinme is seller ka koi product ho (sales ke liye)
    const allOrders = await Order.find()
      .populate({ path: "items.product" })
      .lean();

    // Per-product sold count aur revenue calculate karo
    const productStats = {};
    products.forEach((p) => {
      productStats[p._id.toString()] = {
        _id: p._id.toString(),
        name: p.name,
        image: p.image,
        price: p.price,
        views: p.views || 0,
        stock: p.stock,
        unitsSold: 0,
        revenue: 0,
      };
    });

    let totalRevenue = 0;
    let totalOrders = 0;
    let totalUnitsSold = 0;

    allOrders.forEach((order) => {
      let orderHasMyItem = false;
      order.items.forEach((item) => {
        if (item.product && item.product.seller?.toString() === sellerId.toString()) {
          const pid = item.product._id.toString();
          if (productStats[pid]) {
            productStats[pid].unitsSold += item.quantity;
            productStats[pid].revenue += item.price * item.quantity;
          }
          totalRevenue += item.price * item.quantity;
          totalUnitsSold += item.quantity;
          orderHasMyItem = true;
        }
      });
      if (orderHasMyItem) totalOrders += 1;
    });

    const productList = Object.values(productStats).sort((a, b) => b.unitsSold - a.unitsSold);

    const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);

    return {
      success: true,
      summary: {
        totalRevenue,
        totalOrders,
        totalUnitsSold,
        totalViews,
        totalProducts: products.length,
      },
      products: productList,
    };
  } catch (error) {
    console.error("Get Seller Analytics Error:", error);
    return { success: false };
  }
}
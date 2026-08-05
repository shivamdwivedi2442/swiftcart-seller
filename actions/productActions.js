"use server";

import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
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

export async function updateProductStock(productId, newStock) {
  try {
    await connectDB();
    const sellerId = await getSellerId();
    if (!sellerId) return { success: false, error: "Please login first." };

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return { success: false, error: "Invalid Product ID" };
    }

    const product = await Product.findOne({ _id: productId, seller: sellerId });
    if (!product) return { success: false, error: "Product not found." };

    product.stock = Number(newStock);
    await product.save();

    revalidatePath("/dashboard/products");
    return { success: true, message: "Stock updated successfully!" };
  } catch (error) {
    console.error("Stock Update Error:", error);
    return { success: false, error: "Failed to update stock" };
  }
}

export async function getSellerProducts() {
  try {
    await connectDB();
    const sellerId = await getSellerId();
    if (!sellerId) return { success: false, products: [] };

    const products = await Product.find({ seller: sellerId }).sort({ createdAt: -1 }).lean();
    return { success: true, products: JSON.parse(JSON.stringify(products)) };
  } catch (error) {
    console.error("Fetch Products Error:", error);
    return { success: false, products: [] };
  }
}

export async function addProduct(formData) {
  try {
    await connectDB();
    const sellerId = await getSellerId();
    if (!sellerId) return { success: false, error: "Please login first." };

    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const category = formData.get("category");
    const stock = formData.get("stock");
    const image = formData.get("image");

    if (!name || !price || !image || !category || !stock) {
      return { success: false, error: "Please fill all required fields." };
    }

    await Product.create({
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock),
      image,
      seller: sellerId,
      status: "approved",
    });

    revalidatePath("/dashboard/products");
    return { success: true, message: "Product added successfully!" };
  } catch (error) {
    console.error("Add Product Error:", error);
    return { success: false, error: "Internal Server Error" };
  }
}
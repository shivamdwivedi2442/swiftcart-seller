import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export default async function sitemap() {
  await connectDB();
  const products = await Product.find({ status: "approved" }).select("_id updatedAt").lean();

  const productUrls = products.map((p) => ({
    url: `https://localhost:3000/product/${p._id}`,
    lastModified: p.updatedAt,
  }));

  return [
    { url: "https://localhost:3000", lastModified: new Date() },
    { url: "https://localhost:3000/cart", lastModified: new Date() },
    ...productUrls,
  ];
}
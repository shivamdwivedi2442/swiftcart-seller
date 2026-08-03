import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export default async function sitemap() {
  await connectDB();
  const products = await Product.find({ status: "approved" }).select("_id updatedAt").lean();

  const productUrls = products.map((p) => ({
    url: `https://swiftcart-ashen.vercel.app/product/${p._id}`,
    lastModified: p.updatedAt,
  }));

  return [
    { url: "https://swiftcart-ashen.vercel.app", lastModified: new Date() },
    { url: "https://swiftcart-ashen.vercel.app/cart", lastModified: new Date() },
    ...productUrls,
  ];
}
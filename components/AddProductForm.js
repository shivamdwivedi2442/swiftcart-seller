"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { addProduct } from "@/actions/productActions";

export default function AddProductForm() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Adding product...");

        const formData = new FormData(e.target);
        const res = await addProduct(formData);

        if (res.success) {
            toast.success(res.message, { id: toastId });
            e.target.reset();
            setTimeout(() => router.push("/dashboard/products"), 1000);
        } else {
            toast.error(res.error, { id: toastId });
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <Toaster position="top-center" />

            <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Product Name</label>
                <input name="name" required placeholder="e.g. Wireless Headphones" className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 text-sm text-slate-900" />
            </div>

            <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Description</label>
                <textarea name="description" rows={4} placeholder="Describe your product..." className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 text-sm text-slate-900 resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Price (₹)</label>
                    <input name="price" type="number" required min="1" placeholder="999" className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 text-sm text-slate-900" />
                </div>
                <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Stock Quantity</label>
                    <input name="stock" type="number" required min="0" placeholder="10" className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 text-sm text-slate-900" />
                </div>
            </div>

            <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Category</label>
                <input name="category" required placeholder="e.g. Electronics" className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 text-sm text-slate-900" />
            </div>

            <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Image URL</label>
                <input name="image" type="url" required placeholder="https://example.com/image.jpg" className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 text-sm text-slate-900" />
                <p className="text-xs text-slate-400 mt-1">Paste a direct image link (from Imgur, Cloudinary, etc.)</p>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5" />}
                {loading ? "Adding..." : "Add Product"}
            </button>
        </form>
    );
}
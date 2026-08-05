import AddProductForm from "@/components/AddProductForm";
import { Package } from "lucide-react";

export default function AddProductPage() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
          <Package className="size-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add New Product</h1>
          <p className="text-sm text-slate-500">List a new product in your store</p>
        </div>
      </div>

      <AddProductForm />
    </div>
  );
}
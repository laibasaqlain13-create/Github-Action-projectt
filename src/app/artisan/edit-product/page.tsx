"use client";

import { useState } from "react";

const categories = ["Embroidery", "Crochet", "Tailoring", "Jewelry", "Home Decor", "Candles"];

const initialData = {
  name: "Handcrafted Candle Set",
  price: "PKR 1,200",
  category: "Candles",
  description: "A premium candle set wrapped in elegant handmade paper and natural wax.",
  image: "",
};

export default function EditProductPage() {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      <section className="rounded-4xl bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8B1E4F]">Edit Product</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">Update your listing</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
          Adjust product details, pricing, and category information for your existing item.
        </p>
      </section>

      <form className="rounded-4xl bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-[#FFF8F5] px-4 py-3 text-sm outline-none transition focus:border-[#8B1E4F] focus:ring-2 focus:ring-[#8B1E4F]/20"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Price</label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-[#FFF8F5] px-4 py-3 text-sm outline-none transition focus:border-[#8B1E4F] focus:ring-2 focus:ring-[#8B1E4F]/20"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Category</label>
            <select
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-[#FFF8F5] px-4 py-3 text-sm outline-none transition focus:border-[#8B1E4F] focus:ring-2 focus:ring-[#8B1E4F]/20"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Upload Image</label>
            <input
              type="file"
              onChange={(e) => handleChange("image", e.target.value)}
              className="mt-2 block w-full rounded-2xl border border-dashed border-slate-300 bg-[#FFF8F5] px-4 py-3 text-sm text-slate-600"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={5}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-[#FFF8F5] px-4 py-3 text-sm outline-none transition focus:border-[#8B1E4F] focus:ring-2 focus:ring-[#8B1E4F]/20"
          />
        </div>

        <div className="mt-8">
          <button type="button" className="rounded-full bg-[#8B1E4F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6F173D]">
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
}

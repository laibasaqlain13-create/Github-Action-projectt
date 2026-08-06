"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type CategoryData = {
  id: number;
  categoryName: string;
  categorySlug: string;
};

export default function AddProductPage() {
  const router = useRouter();
  const { authState, isLoading: isAuthLoading } = useAuth();

  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    categoryId: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not logged in as artisan
  useEffect(() => {
    if (!isAuthLoading && (!authState.loggedIn || authState.role !== "artisan")) {
      router.push("/");
    }
  }, [authState, isAuthLoading, router]);

  // Fetch real categories from DB
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories ?? []);
        }
      } catch {
        // Silently fail – fallback to empty list
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    setErrors((prev) => ({ ...prev, image: "" }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const nextErrors: Record<string, string> = {};
    if (!formData.productName.trim()) nextErrors.productName = "Product name is required.";
    if (!formData.price.trim()) nextErrors.price = "Price is required.";
    else if (isNaN(Number(formData.price.replace(/[^0-9.]/g, ""))) || Number(formData.price) <= 0) {
      nextErrors.price = "Please enter a valid price.";
    }
    if (!formData.categoryId) nextErrors.categoryId = "Please choose a category.";
    if (!formData.description.trim()) nextErrors.description = "Description is required.";
    if (!imageFile) nextErrors.image = "Please upload an image.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload image
      const imageFormData = new FormData();
      imageFormData.append("file", imageFile!);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: imageFormData,
      });

      if (!uploadRes.ok) {
        const uploadErr = await uploadRes.json();
        alert(uploadErr.error || "Failed to upload image.");
        setIsSubmitting(false);
        return;
      }

      const { url: imageUrl } = await uploadRes.json();

      // 2. Create product via API
      const productRes = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: formData.productName.trim(),
          price: Number(formData.price.replace(/[^0-9.]/g, "")),
          categoryId: Number(formData.categoryId),
          description: formData.description.trim(),
          image: imageUrl,
        }),
      });

      if (!productRes.ok) {
        const productErr = await productRes.json();
        alert(productErr.error || "Failed to create product.");
        setIsSubmitting(false);
        return;
      }

      // 3. Redirect to portfolio on success
      router.push("/artisan/portfolio");
    } catch {
      alert("Network error. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Show loading while checking auth
  if (isAuthLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-600">
        Loading...
      </div>
    );
  }

  // Don't render form if not artisan (will redirect)
  if (!authState.loggedIn || authState.role !== "artisan") {
    return null;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-4xl bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8B1E4F]">Add Product</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">Create a new listing</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
          Add your latest handmade creation to your portfolio and start attracting buyers.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="rounded-4xl bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Product Name */}
          <div>
            <label className="text-sm font-medium text-slate-700">Product Name</label>
            <input
              type="text"
              value={formData.productName}
              onChange={(e) => handleChange("productName", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-[#FFF8F5] px-4 py-3 text-sm outline-none transition focus:border-[#8B1E4F] focus:ring-2 focus:ring-[#8B1E4F]/20"
              placeholder="e.g. Handcrafted Crochet Set"
            />
            {errors.productName ? <p className="mt-2 text-sm text-rose-600">{errors.productName}</p> : null}
          </div>

          {/* Price */}
          <div>
            <label className="text-sm font-medium text-slate-700">Price (PKR)</label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-[#FFF8F5] px-4 py-3 text-sm outline-none transition focus:border-[#8B1E4F] focus:ring-2 focus:ring-[#8B1E4F]/20"
              placeholder="e.g. 2000"
            />
            {errors.price ? <p className="mt-2 text-sm text-rose-600">{errors.price}</p> : null}
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-slate-700">Category</label>
            <select
              value={formData.categoryId}
              onChange={(e) => handleChange("categoryId", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-[#FFF8F5] px-4 py-3 text-sm outline-none transition focus:border-[#8B1E4F] focus:ring-2 focus:ring-[#8B1E4F]/20"
            >
              <option value="">
                {isLoadingCategories ? "Loading categories..." : "Select a category"}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
            {errors.categoryId ? <p className="mt-2 text-sm text-rose-600">{errors.categoryId}</p> : null}
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-sm font-medium text-slate-700">Upload Image</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              className="mt-2 block w-full rounded-2xl border border-dashed border-slate-300 bg-[#FFF8F5] px-4 py-3 text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-[#8B1E4F] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-[#6F173D]"
            />
            {errors.image ? <p className="mt-2 text-sm text-rose-600">{errors.image}</p> : null}
            {imagePreview && (
              <div className="mt-3 overflow-hidden rounded-2xl">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-40 w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={5}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-[#FFF8F5] px-4 py-3 text-sm outline-none transition focus:border-[#8B1E4F] focus:ring-2 focus:ring-[#8B1E4F]/20"
            placeholder="Describe the product, materials, and design details"
          />
          {errors.description ? <p className="mt-2 text-sm text-rose-600">{errors.description}</p> : null}
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-[#8B1E4F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6F173D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save Product"}
          </button>
          <a
            href="/artisan/portfolio"
            className="rounded-full border border-[#8B1E4F] bg-white px-6 py-3 text-center text-sm font-semibold text-[#8B1E4F] transition hover:bg-[#8B1E4F]/10"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}


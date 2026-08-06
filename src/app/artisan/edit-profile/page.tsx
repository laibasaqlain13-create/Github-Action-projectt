"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  bio: string;
  experience: string;
  address: string;
};

const CRAFT_CATEGORIES = [
  { id: 0, name: "Machine Stitching" },
  { id: 1, name: "Embroidery" },
  { id: 2, name: "Zardozi" },
  { id: 3, name: "Applique" },
  { id: 4, name: "Crochet" },
  { id: 5, name: "Fabric Painting" },
  { id: 6, name: "Mirror Work" },
  { id: 7, name: "Lace Trims" },
];

export default function EditProfilePage() {
  const router = useRouter();
  const { authState, isLoading: isAuthLoading } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    businessName: "",
    bio: "",
    experience: "",
    address: "",
  });
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (isAuthLoading) return;
    if (!authState.loggedIn || authState.role !== "artisan") {
      router.push("/");
      return;
    }

    const fetchData = async () => {
      try {
        const [profileRes, artisanCatsRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/artisan-categories"),
        ]);

        if (profileRes.ok) {
          const data = await profileRes.json();
          setFormData({
            fullName: data.fullName || "",
            email: data.email || "",
            phone: data.phone || "",
            businessName: data.businessName || "",
            bio: data.bio || "",
            experience: data.experience?.toString() || "",
            address: data.address || "",
          });
          if (data.profileImage) {
            setProfileImage(data.profileImage);
          }
        }

        if (artisanCatsRes.ok) {
          const data = await artisanCatsRes.json();
          // Map the API category IDs to our hardcoded CRAFT_CATEGORIES IDs
          const apiIds = data.categories?.map((c: { id: number }) => c.id) ?? [];
          setSelectedCategoryIds(apiIds);
        }
      } catch {
        // Silently fail
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [authState, isAuthLoading, router]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (categoryId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: "error", text: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "File too large. Maximum size is 5MB." });
      return;
    }

    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setMessage({ type: "", text: "" });
  };

  const handleUploadImage = async () => {
    if (!selectedFile) return null;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (uploadRes.ok) {
        const data = await uploadRes.json();
        return data.url as string;
      } else {
        const err = await uploadRes.json().catch(() => ({ error: "Upload failed." }));
        setMessage({ type: "error", text: err.error || "Failed to upload image." });
        return null;
      }
    } catch {
      setMessage({ type: "error", text: "Network error during upload." });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setIsUpdating(true);

    try {
      // Upload profile image first if a new file was selected
      let finalProfileImage = profileImage;
      if (selectedFile) {
        const uploadedUrl = await handleUploadImage();
        if (!uploadedUrl) {
          setIsUpdating(false);
          return;
        }
        finalProfileImage = uploadedUrl;
      }

      // Update profile info (including profileImage)
      const profileRes = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          businessName: formData.businessName,
          bio: formData.bio,
          experience: formData.experience ? parseInt(formData.experience, 10) : null,
          address: formData.address,
          profileImage: finalProfileImage,
        }),
      });

      // Update categories
      const catsRes = await fetch("/api/artisan-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryIds: selectedCategoryIds }),
      });

      if (profileRes.ok && catsRes.ok) {
        setMessage({ type: "success", text: "Profile and categories updated successfully!" });
      } else {
        const data = await profileRes.json().catch(() => ({}));
        setMessage({ type: "error", text: data.error || "Failed to update profile." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isAuthLoading || isFetching) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-4xl bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8B1E4F]">Edit Profile</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">Update artisan details</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              Keep your artisan profile up to date to ensure clients see your latest information.
            </p>
          </div>
          <div className="rounded-full bg-[#FDF2F8] px-4 py-3 text-sm font-semibold text-[#8B1E4F]">Password is managed separately</div>
        </div>
      </section>

      {message.text && (
        <div
          className={`rounded-4xl p-4 text-sm font-medium ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.type === "success" ? "✅ " : "❌ "}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-4xl bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
        {/* Profile Image Upload */}
        <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="relative shrink-0">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#FEE7E9] via-[#FFEDF0] to-[#FFF8F5] shadow-md ring-4 ring-white">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              ) : profileImage ? (
                <img
                  src={profileImage}
                  alt="Current profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-[#8B1E4F]/40">
                  ?
                </div>
              )}
            </div>
            {selectedFile && (
              <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-xs text-white shadow-sm ring-2 ring-white">
                ✓
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-slate-800">Profile Picture</p>
            <p className="text-xs text-slate-500">JPEG, PNG, WebP or GIF. Max 5MB.</p>
            <div className="flex flex-wrap gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="rounded-full bg-[#8B1E4F] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#6F173D] disabled:opacity-60"
              >
                {isUploading ? "Uploading..." : selectedFile ? "Change Photo" : "Upload Photo"}
              </button>
              {(imagePreview || profileImage) && !selectedFile && (
                <button
                  type="button"
                  onClick={() => {
                    setProfileImage(null);
                    setImagePreview(null);
                    setSelectedFile(null);
                  }}
                  className="rounded-full border border-red-300 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Remove
                </button>
              )}
              {selectedFile && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setImagePreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Full Name</label>
            <input
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-[#FFF8F5] px-4 py-3 text-sm outline-none transition focus:border-[#8B1E4F] focus:ring-2 focus:ring-[#8B1E4F]/20"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Phone Number</label>
            <input
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-[#FFF8F5] px-4 py-3 text-sm outline-none transition focus:border-[#8B1E4F] focus:ring-2 focus:ring-[#8B1E4F]/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">City / Address</label>
            <input
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-[#FFF8F5] px-4 py-3 text-sm outline-none transition focus:border-[#8B1E4F] focus:ring-2 focus:ring-[#8B1E4F]/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Business Name</label>
            <input
              value={formData.businessName}
              onChange={(e) => handleChange("businessName", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-[#FFF8F5] px-4 py-3 text-sm outline-none transition focus:border-[#8B1E4F] focus:ring-2 focus:ring-[#8B1E4F]/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Experience (years)</label>
            <input
              type="number"
              min="0"
              value={formData.experience}
              onChange={(e) => handleChange("experience", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-[#FFF8F5] px-4 py-3 text-sm outline-none transition focus:border-[#8B1E4F] focus:ring-2 focus:ring-[#8B1E4F]/20"
            />
          </div>

          {/* Craft Categories - Multi Select */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Craft Categories <span className="text-xs text-slate-400">(select all that apply)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {CRAFT_CATEGORIES.map((cat) => (
                <label
                  key={cat.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    selectedCategoryIds.includes(cat.id)
                      ? "border-[#8B1E4F] bg-[#8B1E4F]/10 text-[#8B1E4F]"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[#8B1E4F]/40"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategoryIds.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                    className="h-4 w-4 accent-[#8B1E4F]"
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Bio / About</label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-[#FFF8F5] px-4 py-3 text-sm outline-none transition focus:border-[#8B1E4F] focus:ring-2 focus:ring-[#8B1E4F]/20"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isUpdating}
            className="rounded-full bg-[#8B1E4F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6F173D] disabled:opacity-60"
          >
            {isUpdating ? "Updating..." : "Update Profile"}
          </button>
          <a href="/artisan/portfolio" className="rounded-full border border-[#8B1E4F] bg-white px-6 py-3 text-center text-sm font-semibold text-[#8B1E4F] transition hover:bg-[#8B1E4F]/10">
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}

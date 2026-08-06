"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type ProductData = {
  id: number;
  productName: string;
  description: string | null;
  price: number;
  image: string | null;
  category: { id: number; categoryName: string };
};

type ProfileData = {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  businessName: string;
  bio: string | null;
  experience: number | null;
  address: string | null;
  profileImage: string | null;
  verificationStatus: string;
};

type CategoryData = {
  id: number;
  categoryName: string;
  categorySlug: string;
};

const formatPrice = (price: number) =>
  `PKR ${price.toLocaleString("en-PK")}`;

export default function ArtisanPortfolioPage() {
  const router = useRouter();
  const { authState, isLoading: isAuthLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!authState.loggedIn || authState.role !== "artisan") {
      router.push("/");
      return;
    }

    const fetchData = async () => {
      try {
        const [profileRes, productsRes, catsRes] = await Promise.all([
          fetch("/api/profile"),
          fetch(`/api/products?artisanId=${authState.id}`),
          fetch("/api/artisan-categories"),
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
        }

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(productsData.products ?? []);
        }

        if (catsRes.ok) {
          const catsData = await catsRes.json();
          setCategories(catsData.categories ?? []);
        }
      } catch {
        // Silently fail
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [authState, isAuthLoading, router]);

  const handleDeleteProduct = async (productId: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    setDeletingId(productId);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete product.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-600">
        Loading portfolio...
      </div>
    );
  }

  const initials = profile?.fullName
    ? profile.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const verificationBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "Verified";
      case "REJECTED":
        return "Rejected";
      default:
        return "Pending";
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-4xl bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8B1E4F]">Artisan Profile</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
              {profile?.fullName || "Artisan"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              {profile?.bio || "No bio added yet."}
            </p>
          </div>
          <a href="/artisan/edit-profile" className="inline-flex items-center justify-center rounded-full bg-[#8B1E4F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6F173D]">
            Edit Profile
          </a>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-4xl bg-[#FFF8F5] p-6">
            <div className="flex flex-col items-center gap-4 text-center">
              {profile?.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.fullName}
                  className="h-28 w-28 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#F1DCE0] text-3xl font-semibold text-[#8B1E4F]">
                  {initials}
                </div>
              )}
              <div>
                <p className="text-xl font-semibold text-slate-900">{profile?.fullName}</p>
                <p className="text-sm text-slate-500">{profile?.businessName || "Artisan"}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-4xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8B1E4F]">Contact</p>
              <div className="mt-4 grid gap-3 text-sm text-slate-700">
                <p>
                  <span className="font-semibold text-slate-900">Email:</span> {profile?.email || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Phone:</span> {profile?.phone || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">City:</span> {profile?.address || "N/A"}
                </p>
              </div>
            </div>
            <div className="rounded-4xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8B1E4F]">Verification</p>
              <div className="mt-4 grid gap-3 text-sm text-slate-700">
                <p>
                  <span className="font-semibold text-slate-900">Status:</span>{" "}
                  {verificationBadge(profile?.verificationStatus || "PENDING")}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Experience:</span>{" "}
                  {profile?.experience ? `${profile.experience} years` : "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Business:</span>{" "}
                  {profile?.businessName || "N/A"}
                </p>
              </div>
            </div>

            {/* Craft Categories */}
            {categories.length > 0 && (
              <div className="rounded-4xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8B1E4F]">Craft Skills</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="rounded-full bg-[#FDF2F8] px-3 py-1 text-xs font-semibold text-[#8B1E4F]"
                    >
                      {cat.categoryName}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-4xl bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8B1E4F]">My Products</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              {products.length > 0
                ? `Products added by you (${products.length})`
                : "No products added yet"}
            </h2>
          </div>
          <a href="/artisan/add-product" className="inline-flex items-center justify-center rounded-full bg-[#8B1E4F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6F173D]">
            Add New Product
          </a>
        </div>

        {products.length === 0 ? (
          <div className="mt-8 rounded-4xl bg-[#FFF8F5] p-12 text-center text-sm text-slate-500">
            You haven&apos;t added any products yet. Click "Add New Product" to get started.
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className="overflow-hidden rounded-4xl bg-[#FFF8F5] shadow-sm shadow-slate-200/50 transition hover:-translate-y-1 hover:shadow-lg">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="h-44 bg-linear-to-br from-[#FEE7E9] via-[#FFEDF0] to-[#FFF8F5]" />
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold text-slate-900">{product.productName}</h3>
                    <span className="rounded-full bg-[#FDF2F8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#8B1E4F]">
                      {product.category.categoryName}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-[#8B1E4F]">{formatPrice(product.price)}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{product.description || "No description provided."}</p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <a href={`/artisan/edit-product?id=${product.id}`} className="flex-1 rounded-full border border-[#8B1E4F] bg-white px-4 py-2 text-center text-sm font-semibold text-[#8B1E4F] transition hover:bg-[#8B1E4F]/10">
                      Edit
                    </a>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      disabled={deletingId === product.id}
                      className="flex-1 rounded-full bg-[#8B1E4F] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#6F173D] disabled:opacity-60"
                    >
                      {deletingId === product.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

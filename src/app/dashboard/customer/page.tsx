"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { categories } from "@/data/categories";
import { useUnreadMessageCount } from "@/hooks/useUnreadMessageCount";

type ArtisanOption = {
  id: number;
  fullName: string;
  businessName: string;
};

type ArtisanApiResponse = {
  id: number;
  fullName: string;
  businessName: string;
  [key: string]: unknown;
};

type ReviewFormData = {
  artisanId: number;
  category: string;
  rating: number;
  comment: string;
};

const reviewCategories = [
  "Tailoring",
  "Bridal Wear",
  "Embroidery",
  "Crochet",
  "Fabric Painting",
  "Zardozi",
  "Applique",
  "Mirror Work",
  "Machine Stitching",
  "Lace Trims",
];

function CustomerDashboardContent() {
  const router = useRouter();

  const {
    authState,
    isLoading: isAuthLoading,
  } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [artisans, setArtisans] = useState<ArtisanOption[]>([]);
  const [reviewForm, setReviewForm] = useState<ReviewFormData>({
    artisanId: 0,
    category: "",
    rating: 0,
    comment: "",
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [reviewError, setReviewError] = useState("");
  const unreadMessageCount = useUnreadMessageCount();

  useEffect(() => {
    if (isAuthLoading) return;

    if (!authState.loggedIn) {
      router.push("/");
      return;
    }

    if (authState.role !== "customer") {
      router.push("/dashboard");
      return;
    }

    setIsLoading(false);
  }, [authState, isAuthLoading, router]);

  // Fetch artisans for review form
  useEffect(() => {
    if (!showReviewForm) return;
    const fetchArtisans = async () => {
      try {
        const res = await fetch("/api/artisans");
        if (res.ok) {
          const data = await res.json();
          setArtisans(data.artisans ?? []);
        }
      } catch {
        // Silently fail
      }
    };
    fetchArtisans();
  }, [showReviewForm]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");

    if (!reviewForm.artisanId || !reviewForm.rating) {
      setReviewError("Please select an artisan and rating.");
      return;
    }

    setReviewSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewForm),
      });
      const data = await res.json();
      if (res.ok) {
        setReviewSuccess("Your review has been submitted successfully!");
        setReviewForm({ artisanId: 0, category: "", rating: 0, comment: "" });
        setShowReviewForm(false);
      } else {
        setReviewError(data.error || "Failed to submit review.");
      }
    } catch {
      setReviewError("Network error. Please try again.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (isLoading || isAuthLoading) {
    return (
      <main className="min-h-screen bg-[#FFF8F5] p-4 sm:p-6 lg:p-8">
        <p className="py-20 text-center text-gray-600">
          Loading dashboard...
        </p>
      </main>
    );
  }

  const dashboardCategories = showAllCategories
    ? categories
    : categories.filter((category) =>
        ["Embroidery", "Zardozi", "Crochet"].includes(category.name)
      );

  return (
    <main className="min-h-screen bg-[#FFF8F5] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4 rounded-3xl bg-gradient-to-r from-[#8B1E4D] to-[#A03060] p-8 text-white shadow-lg">

          <div>
            <h1 className="text-4xl font-bold">
              Welcome back
              {authState.name ? `, ${authState.name}` : ""}!
            </h1>

            <p className="mt-2 text-[#FFE5EC]">
              Discover amazing handmade products and connect with talented artisans.
            </p>
          </div>

          <div className="flex gap-3">

            <Link
              href="/notifications"
              className="rounded-full bg-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/25"
            >
              Notifications
            </Link>

          </div>
        </div>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-[#2D1F25]">
            Quick Actions
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <Link
              href="/artisans"
              className="rounded-2xl bg-white p-6 text-center shadow transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="font-semibold text-[#8B1E4D]">
                View Artisans
              </h3>
            </Link>

            <Link
              href="/chat"
              aria-label={unreadMessageCount > 0 ? `Messages, ${unreadMessageCount} unread` : "Messages"}
              className="relative rounded-2xl bg-white p-6 text-center shadow transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="font-semibold text-[#8B1E4D]">
                Messages
              </h3>
              {unreadMessageCount > 0 && (
                <span className="absolute right-4 top-4 inline-flex min-w-6 items-center justify-center rounded-full bg-[#8B1E4D] px-1.5 py-0.5 text-xs font-bold text-white shadow-sm">
                  {unreadMessageCount > 99 ? "99+" : unreadMessageCount}
                </span>
              )}
            </Link>

            <Link
              href="/reviews"
              className="rounded-2xl bg-white p-6 text-center shadow transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="font-semibold text-[#8B1E4D]">
                Reviews
              </h3>
            </Link>

            <Link
              href="/profile"
              className="rounded-2xl bg-white p-6 text-center shadow transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="font-semibold text-[#8B1E4D]">
                Profile
              </h3>
            </Link>

          </div>
        </section>

        {/* Write a Review Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#2D1F25]">
              Write a Review
            </h2>
            <button
              type="button"
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="rounded-full bg-[#8B1E4D] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#731942]"
            >
              {showReviewForm ? "Cancel" : "Review an Artisan"}
            </button>
          </div>

          {reviewSuccess && (
            <div className="mb-4 rounded-2xl bg-green-100 p-4 font-medium text-green-700">
              ✅ {reviewSuccess}
            </div>
          )}

          {reviewError && (
            <div className="mb-4 rounded-2xl bg-red-100 p-4 font-medium text-red-700">
              ❌ {reviewError}
            </div>
          )}

          {showReviewForm && (
            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <form onSubmit={handleReviewSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block font-medium">Select Artisan *</label>
                  <select
                    value={reviewForm.artisanId}
                    onChange={(e) => setReviewForm({ ...reviewForm, artisanId: Number(e.target.value) })}
                    required
                    className="w-full rounded-xl border border-gray-300 p-3 focus:border-[#8B1E4D] focus:outline-none"
                  >
                    <option value={0}>Choose an artisan</option>
                    {artisans.map((a) => (
                      <option key={a.id} value={a.id}>
                      {a.businessName || a.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-medium">Craft Category</label>
                  <select
                    value={reviewForm.category}
                    onChange={(e) => setReviewForm({ ...reviewForm, category: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 p-3 focus:border-[#8B1E4D] focus:outline-none"
                  >
                    <option value="">Select category (optional)</option>
                    {reviewCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-medium">Rating *</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                    required
                    className="w-full rounded-xl border border-gray-300 p-3 focus:border-[#8B1E4D] focus:outline-none"
                  >
                    <option value={0}>Select Rating</option>
                    <option value={5}>★★★★★ Excellent</option>
                    <option value={4}>★★★★ Very Good</option>
                    <option value={3}>★★★ Good</option>
                    <option value={2}>★★ Fair</option>
                    <option value={1}>★ Poor</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-medium">Your Review</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    rows={4}
                    placeholder="Share your experience with this artisan..."
                    className="w-full rounded-xl border border-gray-300 p-3 focus:border-[#8B1E4D] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="w-full rounded-xl bg-[#8B1E4D] py-3 text-lg font-semibold text-white transition hover:bg-[#731942] disabled:opacity-60"
                >
                  {reviewSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          )}
        </section>

        {/* Categories */}
        <div className="mx-auto w-full">

          <section className="min-w-0 rounded-3xl bg-white p-6 shadow-lg">

            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#2D1F25]">
                Categories
              </h2>

              <button
                type="button"
                onClick={() => setShowAllCategories((current) => !current)}
                className="text-sm font-semibold text-[#8B1E4D] hover:underline"
              >
                {showAllCategories
                  ? "View Less"
                  : "View All Categories"}
              </button>
            </div>

            <div
              className="grid gap-6"
              style={{
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              }}
            >
              {dashboardCategories.map((category) => (
                <div
                  key={category.route}
                  className="group w-full rounded-[32px] bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-5 h-44 overflow-hidden rounded-xl bg-[#FEE7E9]">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={300}
                      height={200}
                      className="h-44 w-full rounded-xl object-cover transition group-hover:scale-105"
                    />
                  </div>

                  <h3 className="text-xl font-semibold">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-sm text-slate-600">
                    {category.description}
                  </p>

                  <Link
                    href={`/categories/${category.route}`}
                    className="mt-6 inline-flex rounded-full bg-[#8B1E4F] px-5 py-2 text-sm font-semibold text-white hover:bg-[#6F173D]"
                  >
                    Explore
                  </Link>
                </div>
              ))}
            </div>

          </section>
        </div>

      </div>
    </main>
  );
}

export default function CustomerDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center"><p className="text-gray-600">Loading dashboard...</p></div>}>
      <CustomerDashboardContent />
    </Suspense>
  );
}

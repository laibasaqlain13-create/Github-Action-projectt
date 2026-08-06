"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type Review = {
  id: number;
  customer: { id: number; fullName: string };
  artisan: { id: number; fullName: string; businessName: string };
  category: string | null;
  rating: number;
  comment: string | null;
  createdAt: string;
};

type ArtisanOption = {
  id: number;
  fullName: string;
  businessName: string;
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

export default function ReviewsPage() {
  const { authState, isLoading: isAuthLoading } = useAuth();
  const isCustomer = authState.loggedIn && authState.role === "customer";

  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Review form state
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

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/reviews");
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews ?? []);
      }
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

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
        // Refresh the reviews list
        setIsLoading(true);
        fetchReviews();
      } else {
        setReviewError(data.error || "Failed to submit review.");
      }
    } catch {
      setReviewError("Network error. Please try again.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  if (isLoading && reviews.length === 0) {
    return (
      <main className="min-h-screen bg-[#FFF8F5] px-6 py-12 text-[#2D1F25]">
        <div className="mx-auto max-w-6xl">
          <p className="py-20 text-center text-gray-600">Loading reviews...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF8F5] px-6 py-12 text-[#2D1F25]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold">Customer Reviews</h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            See what customers are saying about artisans on HunarConnect.
          </p>
        </div>

        {/* Write a Review Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#2D1F25]">Write a Review</h2>
            {isCustomer && !isAuthLoading && (
              <button
                type="button"
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="rounded-full bg-[#8B1E4D] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#731942]"
              >
                {showReviewForm ? "Cancel" : "Review an Artisan"}
              </button>
            )}
          </div>

          {!isCustomer && !isAuthLoading && (
            <p className="mt-2 text-sm text-gray-500">
              <a href="/login" className="text-[#8B1E4D] underline">Log in</a> as a customer to write a review.
            </p>
          )}

          {reviewSuccess && (
            <div className="mb-4 mt-4 rounded-2xl bg-green-100 p-4 font-medium text-green-700">
              ✅ {reviewSuccess}
            </div>
          )}

          {reviewError && (
            <div className="mb-4 mt-4 rounded-2xl bg-red-100 p-4 font-medium text-red-700">
              ❌ {reviewError}
            </div>
          )}

          {showReviewForm && (
            <div className="mt-4 rounded-3xl bg-white p-6 shadow-lg">
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
        </div>

        {/* Existing Reviews */}
        {reviews.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
            <p className="text-lg font-semibold text-gray-600">No reviews yet. Be the first to review an artisan!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-[32px] bg-white p-6 shadow-lg shadow-slate-200/50">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{review.customer.fullName}</h3>
                    <p className="text-sm text-slate-500">
                      {review.artisan.businessName || review.artisan.fullName}
                      {review.category ? ` - ${review.category}` : ""}
                    </p>
                  </div>
                  <div className="text-lg text-amber-500">{renderStars(review.rating)}</div>
                </div>
                <p className="text-sm leading-7 text-slate-600">{review.comment}</p>
                <p className="mt-3 text-xs text-slate-400">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}


"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ArtisanProfileSection from "@/app/artisan/components/ArtisanProfileSection";
import ProductCard from "@/app/artisan/components/ProductCard";

type CustomerInfo = { id: number; fullName: string };
type ArtisanInfo = { id: number; fullName: string; businessName: string };

type Review = {
  id: number;
  customer: CustomerInfo;
  artisan: ArtisanInfo;
  category: string | null;
  rating: number;
  comment: string | null;
  createdAt: string;
};

type ApiArtisan = {
  id: number;
  fullName: string;
  businessName: string;
  bio: string;
  experience: number | null;
  address: string;
  profileImage: string | null;
  verificationStatus: string;
  artisanCategories: { category: { categoryName: string } }[];
  products: ApiProduct[];
  reviews: Review[];
};

type ApiProduct = {
  id: number;
  productName: string;
  price: number;
  description: string | null;
  image: string | null;
  category: { categoryName: string };
};

type MappedArtisan = {
  id: number;
  name: string;
  city: string;
  category: string;
  rating: number;
  description: string;
  about: string;
  image?: string;
};

type MappedProduct = {
  id: number;
  artisanId: number;
  name: string;
  price: number;
  category: string;
};

function mapArtisan(api: ApiArtisan): MappedArtisan {
  const categoryName = api.artisanCategories?.[0]?.category?.categoryName ?? "General";
  return {
    id: api.id,
    name: api.fullName,
    city: api.address ?? "",
    category: categoryName,
    rating: 5,
    description: api.bio ?? "",
    about: api.bio ?? "",
    image: api.profileImage ?? undefined,
  };
}

function mapProduct(api: ApiProduct, artisanId: number): MappedProduct {
  return {
    id: api.id,
    artisanId,
    name: api.productName,
    price: api.price,
    category: api.category?.categoryName ?? "General",
  };
}

export default function ArtisanProfilePage() {
  const params = useParams<{ id?: string }>();
  const artisanId = Number(params?.id);

  const [artisan, setArtisan] = useState<MappedArtisan | null>(null);
  const [artisanProducts, setArtisanProducts] = useState<MappedProduct[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch artisan from DB API
  useEffect(() => {
    if (!artisanId) {
      setLoading(false);
      return;
    }
    const fetchArtisan = async () => {
      try {
        const res = await fetch(`/api/artisans/${artisanId}`);
        if (res.ok) {
          const data = await res.json();
          const apiArtisan: ApiArtisan = data.artisan;
          setArtisan(mapArtisan(apiArtisan));
          setArtisanProducts((apiArtisan.products ?? []).map((p) => mapProduct(p, artisanId)));
          setReviews(apiArtisan.reviews ?? []);
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchArtisan();
  }, [artisanId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFF8F5] text-slate-900">
        <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-6xl rounded-[36px] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50 sm:p-10 lg:p-14">
            <div className="rounded-[28px] bg-[#FFF8F5] p-8 text-center shadow-sm shadow-slate-200/50">
              <p className="text-lg font-semibold text-slate-900">Loading artisan profile...</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!artisan) {
    return (
      <main className="min-h-screen bg-[#FFF8F5] text-slate-900">
        <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-6xl rounded-[36px] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50 sm:p-10 lg:p-14">
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-[#FFF8F5] p-8 text-center shadow-sm shadow-slate-200/50">
              <p className="text-lg font-semibold text-slate-900">Artisan profile is not available.</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <main className="min-h-screen bg-[#FFF8F5] text-slate-900">
      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl space-y-8">
          <ArtisanProfileSection artisan={artisan} />

          <section className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8 lg:p-10">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Products</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">All products uploaded by {artisan.name}.</p>
              </div>
            </div>

            {artisanProducts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {artisanProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-[28px] border border-dashed border-slate-300 bg-[#FFF8F5] p-8 text-center shadow-sm shadow-slate-200/50">
                <p className="text-lg font-semibold text-slate-900">No products available yet.</p>
              </div>
            )}
          </section>

          {/* Reviews Section */}
          <section className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8 lg:p-10">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">Customer Reviews</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">What customers are saying about {artisan.name}.</p>
            </div>

            {reviews.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {reviews.map((review) => (
                  <div key={review.id} className="rounded-[28px] border border-slate-200 bg-[#FFF8F5] p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{review.customer.fullName}</p>
                        {review.category && (
                          <p className="text-xs text-slate-500">{review.category}</p>
                        )}
                      </div>
                      <div className="text-amber-500">{renderStars(review.rating)}</div>
                    </div>
                    <p className="text-sm leading-6 text-slate-600">{review.comment}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[28px] border border-dashed border-slate-300 bg-[#FFF8F5] p-8 text-center shadow-sm shadow-slate-200/50">
                <p className="text-lg font-semibold text-slate-900">No reviews yet.</p>
                <p className="mt-1 text-sm text-slate-500">Be the first to review this artisan!</p>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}


"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ArtisanCard from "@/app/artisan/components/ArtisanCard";
import { artisanCategories } from "@/data/artisans";

type ApiArtisan = {
  id: number;
  fullName: string;
  businessName: string;
  bio: string;
  address: string;
  profileImage: string | null;
  verificationStatus: string;
  artisanCategories: { category: { categoryName: string } }[];
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

const pageSize = 4;

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

function ArtisansContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") ?? "";
  const filterField = searchParams.get("filter");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [artisans, setArtisans] = useState<MappedArtisan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setQuery(searchQuery);
    setVisibleCount(pageSize);
  }, [searchQuery]);

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const res = await fetch("/api/artisans");
        if (res.ok) {
          const data = await res.json();
          const mapped = (data.artisans ?? []).map(mapArtisan);
          setArtisans(mapped);
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchArtisans();
  }, []);

  const filteredArtisans = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return artisans.filter((artisan) => {
      const matchesCategory = category === "All" || artisan.category === category;
      const searchableValue = filterField === "name"
        ? artisan.name
        : filterField === "category"
          ? artisan.category
          : filterField === "city"
            ? artisan.city
            : `${artisan.name} ${artisan.city} ${artisan.category}`;
      const matchesQuery = normalizedQuery.length === 0 || searchableValue.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [artisans, category, filterField, query]);

  const visibleArtisans = filteredArtisans.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArtisans.length;

  const handleLoadMore = () => {
    setVisibleCount((current) => current + pageSize);
  };

  return (
    <main className="min-h-screen bg-[#FFF8F5] text-slate-900">
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8B1E4F]">Discover</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">All Registered Artisans</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Browse verified artisans by name, city, or craft category.
              </p>
            </div>
            <Link href="/" className="inline-flex items-center justify-center rounded-full border border-[#8B1E4F] bg-white px-4 py-2 text-sm font-semibold text-[#8B1E4F] transition hover:bg-[#8B1E4F]/10">
              ← Back Home
            </Link>
          </div>

          <div className="mb-8 rounded-[32px] border border-[#F3E9E6] bg-white p-4 shadow-lg shadow-slate-200/50 sm:p-6">
            <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Search artisans</span>
                <input
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setVisibleCount(pageSize);
                  }}
                  placeholder="Search by name, city or category"
                  className="w-full rounded-full border border-slate-300 bg-[#FFF8F5] px-4 py-3 text-sm outline-none transition focus:border-[#8B1E4F] focus:ring-2 focus:ring-[#8B1E4F]/20"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Filter by category</span>
                <select
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value);
                    setVisibleCount(pageSize);
                  }}
                  className="w-full rounded-full border border-slate-300 bg-[#FFF8F5] px-4 py-3 text-sm outline-none transition focus:border-[#8B1E4F] focus:ring-2 focus:ring-[#8B1E4F]/20"
                >
                  {artisanCategories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {filteredArtisans.length === 0 ? (
            <div className="rounded-[32px] border border-dashed border-[#E6C8D3] bg-white p-10 text-center shadow-sm shadow-slate-200/50">
              <h2 className="text-2xl font-semibold text-slate-900">No artisans found</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Try a different keyword or filter to discover more artisans.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {visibleArtisans.map((artisan) => (
                  <ArtisanCard key={artisan.id} artisan={artisan} />
                ))}
              </div>

              {hasMore ? (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    className="rounded-full bg-[#8B1E4F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6F173D]"
                  >
                    Load More
                  </button>
                </div>
              ) : (
                filteredArtisans.length > pageSize && (
                  <p className="mt-8 text-center text-sm text-slate-500">You have reached the end of the list.</p>
                )
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default function ArtisansPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#FFF8F5]" />}>
      <ArtisansContent />
    </Suspense>
  );
}

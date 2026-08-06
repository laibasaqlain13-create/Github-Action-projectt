"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export type CategoryArtisan = { id: number; name: string; city: string; rating: number; experience: number | null; bio: string; image: string | null };

export default function ArtisanListings({ artisans }: { artisans: CategoryArtisan[] }) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("All");
  const [rating, setRating] = useState("All");
  const [experience, setExperience] = useState("All");
  const cities = useMemo(() => [...new Set(artisans.map((artisan) => artisan.city).filter(Boolean))].sort(), [artisans]);
  const filtered = useMemo(() => artisans.filter((artisan) => (!query.trim() || artisan.name.toLowerCase().includes(query.trim().toLowerCase())) && (city === "All" || artisan.city === city) && (rating === "All" || artisan.rating >= Number(rating)) && (experience === "All" || (artisan.experience ?? 0) >= Number(experience))), [artisans, city, experience, query, rating]);

  if (!artisans.length) return <p className="rounded-3xl bg-white p-8 text-center text-gray-600 shadow-md">No artisan is currently registered in this category.</p>;
  return <>
    <section className="mb-8 rounded-3xl bg-white p-5 shadow-md"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <label className="text-sm font-medium text-gray-700">Search artisan by name<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name" className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#8B1E4D]/20" /></label>
      <label className="text-sm font-medium text-gray-700">City<select value={city} onChange={(event) => setCity(event.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#8B1E4D]/20"><option>All</option>{cities.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label className="text-sm font-medium text-gray-700">Minimum rating<select value={rating} onChange={(event) => setRating(event.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#8B1E4D]/20"><option value="All">All</option><option value="5">5 stars</option><option value="4">4+ stars</option><option value="3">3+ stars</option></select></label>
      <label className="text-sm font-medium text-gray-700">Minimum experience<select value={experience} onChange={(event) => setExperience(event.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#8B1E4D]/20"><option value="All">All</option><option value="5">5+ years</option><option value="3">3+ years</option><option value="1">1+ year</option></select></label>
    </div></section>
    {filtered.length ? <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{filtered.map((artisan) => <article key={artisan.id} className="overflow-hidden rounded-3xl bg-white shadow-md transition duration-300 hover:shadow-xl"><div className="relative h-52 w-full">{artisan.image ? <Image src={artisan.image} alt={`${artisan.name} profile picture`} fill className="object-cover" /> : <div className="flex h-full items-center justify-center bg-[#FEE7E9] text-sm font-semibold text-[#7a1f52]">No profile picture</div>}</div><div className="p-5"><h2 className="text-xl font-bold text-[#7a1f52]">{artisan.name}</h2><p className="mt-2 text-sm text-gray-600">City: {artisan.city || "Not provided"}</p><p className="mt-1 text-sm text-gray-600">Rating: {artisan.rating ? `${artisan.rating.toFixed(1)} ★` : "No ratings"}</p><p className="mt-1 text-sm text-gray-600">Experience: {artisan.experience != null ? `${artisan.experience} years` : "Not provided"}</p><p className="mt-3 line-clamp-2 text-sm text-gray-600">{artisan.bio || "No bio provided."}</p><Link href={`/artisan/${artisan.id}`} className="mt-5 inline-flex rounded-full bg-[#8f2b5d] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#6f1f48]">View Profile</Link></div></article>)}</div> : <p className="rounded-3xl bg-white p-8 text-center text-gray-600 shadow-md">No artisans match these filters.</p>}
  </>;
}

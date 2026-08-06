"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ArtisanCard from "@/app/artisan/components/ArtisanCard";
import { artisanProfiles } from "@/data/artisans";
export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSearchQuery(new URLSearchParams(window.location.search).get("search")?.trim() || "");
  }, []);
  const matchingArtisans = searchQuery
    ? artisanProfiles.filter((artisan) => {
        const query = searchQuery.toLowerCase();
        return [artisan.name, artisan.category, artisan.city].some((value) => value.toLowerCase().includes(query));
      })
    : [];
  const testimonials = [
    { name: "Sara Khan", review: "Amazing products and quick responses. I love supporting artisans through HunarConnect." },
    { name: "Zainab Ali", review: "Beautiful handmade items with thoughtful details. The platform is easy to use." },
    { name: "Amina Noor", review: "Great customer service and strong local support. Highly recommend HunarConnect." },
  ];

  return (
    <main className="bg-[#FFF9F6] text-slate-900">
      {searchQuery && (
        <section id="search-results" className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
          <div className="rounded-3xl bg-white p-4 shadow-lg shadow-slate-200/50 sm:p-6">
            {matchingArtisans.length ? (
              <>
                <h2 className="text-2xl font-semibold text-slate-900">Search Results</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                  {matchingArtisans.map((artisan) => <ArtisanCard key={artisan.id} artisan={artisan} />)}
                </div>
              </>
            ) : <p className="text-sm text-slate-600">No matching artisan or category found.</p>}
          </div>
        </section>
      )}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:h-[calc(100dvh-5rem)] lg:px-8 lg:py-3">
        <div className="grid gap-8 sm:gap-10 lg:h-full lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6 lg:space-y-3">
            <span className="inline-flex max-w-full text-center text-sm font-bold uppercase tracking-[0.24em] text-[#8b1e4d]">
              Support Local Women Artisans
            </span>
            <div className="space-y-5 lg:space-y-3">
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-[#2d1f25] sm:text-5xl" style={{ fontFamily: "Playfair Display, serif" }}>
                Discover Handmade Crafts Made With <span className="text-[#8b1e4d]">Passion.</span>
              </h1>
              <div className="flex items-center gap-3 text-[#8b1e4d]/60">
                <span className="h-px w-24 bg-current" />
                <span className="text-2xl" aria-hidden="true">✿</span>
                <span className="h-px w-24 bg-current" />
              </div>
              <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg lg:text-base lg:leading-6">
                Support talented women artisans by exploring handmade products including tailoring, candles, crochet, embroidery, jewelry and handmade gifts.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center lg:gap-3">
              <a href="#categories" className="inline-flex items-center justify-center rounded-full bg-[#8B1E4F] px-6 py-3 text-sm font-semibold !text-white transition hover:bg-[#6F173D] lg:px-5 lg:py-2.5">
                Explore Products
              </a>
            </div>
            <div className="grid max-w-xl grid-cols-2 gap-3 py-1 min-[400px]:gap-4 lg:mt-6 lg:max-w-none lg:grid-cols-4 lg:gap-3 lg:px-1">
              <div className="min-w-0 rounded-2xl bg-white p-4 shadow-lg shadow-slate-200/50 sm:p-5 lg:h-[112px] lg:p-3.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8B1E4F]/10 text-sm text-[#8B1E4F]">♙</span>
                <p className="mt-2 text-2xl font-semibold text-slate-900 lg:mt-1 lg:text-xl">300+</p>
                <p className="mt-1 text-sm text-slate-500 lg:text-xs">Verified Artisans</p>
              </div>
              <div className="min-w-0 rounded-2xl bg-white p-4 shadow-lg shadow-slate-200/50 sm:p-5 lg:h-[112px] lg:p-3.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8B1E4F]/10 text-sm text-[#8B1E4F]">▣</span>
                <p className="mt-2 text-2xl font-semibold text-slate-900 lg:mt-1 lg:text-xl">1500+</p>
                <p className="mt-1 text-sm text-slate-500 lg:text-xs">Products</p>
              </div>
              <div className="min-w-0 rounded-2xl bg-white p-4 shadow-lg shadow-slate-200/50 sm:p-5 lg:h-[112px] lg:p-3.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8B1E4F]/10 text-sm text-[#8B1E4F]">★</span>
                <p className="mt-2 text-2xl font-semibold text-slate-900 lg:mt-1 lg:text-xl">4.9★</p>
                <p className="mt-1 text-sm text-slate-500 lg:text-xs">Customer Rating</p>
              </div>
              <div className="min-w-0 rounded-2xl bg-white p-4 shadow-lg shadow-slate-200/50 sm:p-5 lg:h-[112px] lg:p-3.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8B1E4F]/10 text-sm text-[#8B1E4F]">◔</span>
                <p className="mt-2 text-2xl font-semibold text-slate-900 lg:mt-1 lg:text-xl">24hr</p>
                <p className="mt-1 text-sm text-slate-500 lg:text-xs">Average Response</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-[22rem] rounded-[32px] bg-gradient-to-br from-[#FDE7E8] via-[#FFEFF0] to-[#FFF9F6] p-4 shadow-[0_18px_45px_rgba(139,30,79,0.16)] min-[400px]:p-6 sm:max-w-xl sm:rounded-[42px] sm:p-8 lg:max-w-[23rem] lg:p-5">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[36px] bg-[#F6E5E1]">
                <Image
                  src="/images/artisan pic.png"
                  alt="Empowering artisans handmade crafts"
                  fill
                  priority
                  sizes="(min-width: 1024px) 368px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="bg-[#FFF9F6] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8B1E4F]">Categories</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">Explore Categories</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">Find handmade products by category.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {[
              {
                name: "Machine Stitching",
                route: "machine-stitching",
                description: "Professional tailoring and custom garment stitching.",
                image: "/images/categories/machine-stitching.jpg",
              },
              {
                name: "Embroidery",
                route: "embroidery",
                description: "Beautiful hand and machine embroidered designs.",
                image: "/images/categories/embroidery.jpg",
              },
              {
                name: "Zardozi",
                route: "zardozi",
                description: "Traditional gold and silver thread embroidery.",
                image: "/images/categories/zardozi.jpg",
              },
              {
                name: "Applique",
                route: "applique",
                description: "Creative fabric patchwork with artistic designs.",
                image: "/images/aplique.jpg",
              },
              {
                name: "Crochet",
                route: "crochet",
                description: "Handmade crochet accessories, clothing, and décor.",
                image: "/images/categories/crochet.jpg",
              },
              {
                name: "Fabric Painting",
                route: "fabric-painting",
                description: "Unique hand-painted fabrics and textile art.",
                image: "/images/categories/fabric-painting.jpg",
              },
              {
                name: "Mirror Work",
                route: "mirror-work",
                description: "Traditional mirror embroidery for vibrant ethnic wear.",
                image: "/images/categories/mirror-work.jpg",
              },
              {
                name: "Lace Trims",
                route: "lace-trims",
                description: "Decorative lace borders for dresses and crafts.",
                image: "/images/categories/embroidery.jpg",
              },
            ].map((category) => (
              <div key={category.name} className="group rounded-[28px] bg-white p-4 shadow-lg shadow-slate-200/50 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-[32px] sm:p-6">
                <div className="mb-5 h-44 overflow-hidden rounded-xl bg-[#FEE7E9]">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={300}
                    height={200}
                    className="w-full h-44 object-cover rounded-xl transition duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{category.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
                                <Link
                  href={`/categories/${category.route}`}
                  className="mt-6 inline-flex rounded-full bg-[#8B1E4F] px-5 py-2 text-sm font-semibold !text-white transition hover:bg-[#6F173D]"
                >
                  Explore
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8B1E4F]">Featured</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">Meet Our Artisans</h2>
            </div>
            <Link href="/artisans" className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#8B1E4F] shadow-sm shadow-slate-200 transition hover:bg-[#8B1E4F] hover:text-white">
              View All →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {artisanProfiles.slice(0, 4).map((artisan) => (
              <ArtisanCard key={artisan.id} artisan={artisan} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FFF9F6] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8B1E4F]">Process</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">How HunarConnect Works</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
            {[
              { step: "Step 1", title: "Register", description: "Create your account." },
              { step: "Step 2", title: "Browse", description: "Explore artisans and products." },
              { step: "Step 3", title: "Order", description: "Place your order directly." },
              { step: "Step 4", title: "Receive", description: "Receive your handmade product and leave a review." },
            ].map((item, index) => (
              <div key={item.step} className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#8B1E4F]/10 text-lg font-semibold text-[#8B1E4F]">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8B1E4F]">Benefits</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">Why Choose HunarConnect</h2>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {[
              { title: "Verified Artisans", description: "CNIC verified artisan accounts.", icon: "✔" },
              { title: "Secure Shopping", description: "Safe ordering experience.", icon: "🔒" },
              { title: "Support Local Women", description: "Empowering small businesses.", icon: "🌸" },
            ].map((feature) => (
              <div key={feature.title} className="rounded-4xl bg-white p-6 shadow-lg shadow-slate-200/50 transition hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-[#8B1E4F]/10 text-2xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8B1E4F]">Reviews</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">What Customers Say</h2>
            </div>
            <Link href="/reviews" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-base font-semibold text-[#8B1E4F] shadow-sm shadow-slate-200 transition hover:bg-[#8B1E4F] hover:text-white">
              View All →
            </Link>
          </div>

          <div className="reviews-marquee" aria-label="Customer reviews">
            <div className="reviews-marquee-track">
              {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div key={`${testimonial.name}-${index}`} className="reviews-marquee-card rounded-4xl bg-white p-6 shadow-lg shadow-slate-200/50 transition hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-xl font-semibold text-slate-600">
                    {testimonial.name.split(" ")[0][0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{testimonial.name}</h3>
                    <p className="text-sm text-amber-500">★★★★★</p>
                  </div>
                </div>
                <p className="text-sm leading-7 text-slate-600">{testimonial.review}</p>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

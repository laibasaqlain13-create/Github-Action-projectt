import Link from "next/link";
import type { ArtisanProfile } from "@/data/artisans";

type ArtisanProfileSectionProps = {
  artisan: ArtisanProfile;
};

export default function ArtisanProfileSection({ artisan }: ArtisanProfileSectionProps) {
  const initials = artisan.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="rounded-4xl bg-[#FFF8F5] p-6 shadow-sm shadow-slate-200/50">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-[#8B1E4F] to-[#C6648A] text-lg font-semibold text-white">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">{artisan.name}</h1>
              <p className="mt-1 text-sm font-medium text-[#8B1E4D]">{artisan.category}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-2">
              <span className="font-medium text-slate-700">City</span>
              <span>{artisan.city}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-2">
              <span className="font-medium text-slate-700">Craft Category</span>
              <span>{artisan.category}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-2">
              <span className="font-medium text-slate-700">Rating</span>
              <span className="text-amber-500">{"★".repeat(Math.round(artisan.rating))}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
            <h2 className="text-xl font-semibold text-slate-900">About Artisan</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{artisan.about}</p>
          </section>

          <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
            <h2 className="text-xl font-semibold text-slate-900">Products by {artisan.name}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Explore the handmade items this artisan has uploaded.
            </p>
            <Link href={`/chat?artisanId=${artisan.id}`} className="mt-5 inline-flex rounded-full bg-[#8B1E4F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6F173D]">
              Message Artisan
            </Link>
          </section>
        </div>
      </div>
    </section>
  );
}

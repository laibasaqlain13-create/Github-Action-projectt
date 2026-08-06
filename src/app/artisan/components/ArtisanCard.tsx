import Image from "next/image";
import Link from "next/link";
import type { ArtisanProfile } from "@/data/artisans";

type ArtisanCardProps = {
  artisan: ArtisanProfile;
};

export default function ArtisanCard({ artisan }: ArtisanCardProps) {
  return (
    <div className="rounded-[32px] bg-white p-6 shadow-lg shadow-slate-200/50 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-5 h-48 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#FEE7E9] via-[#FFEDF0] to-[#FFF8F5]">
        {artisan.image ? (
          <Image
            src={artisan.image}
            alt={`${artisan.name} profile image`}
            width={540}
            height={384}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-lg font-semibold text-slate-500">
            No image yet
          </div>
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-900">{artisan.name}</h3>
        <p className="text-sm text-slate-500">{artisan.city}</p>
        <div className="flex items-center gap-2 text-sm text-amber-500">{'★'.repeat(Math.round(artisan.rating))}</div>
        <p className="text-sm leading-6 text-slate-600">{artisan.description}</p>
        <span className="inline-flex rounded-full bg-[#FDF2F8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#8B1E4F]">
          {artisan.category}
        </span>
      </div>
            <Link
        href={`/artisan/${artisan.id}`}
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#8B1E4F] px-4 py-3 text-sm font-semibold !text-white transition hover:bg-[#6F173D]"
      >
        View Shop
      </Link>
    </div>
  );
}
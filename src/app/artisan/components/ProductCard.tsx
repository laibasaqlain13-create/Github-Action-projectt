import Link from "next/link";
import type { ProductItem } from "@/data/artisans";

type ProductCardProps = {
  product: ProductItem;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-5 h-44 overflow-hidden rounded-[28px] bg-linear-to-br from-[#FEE7E9] via-[#FFEDF0] to-[#FFF8F5]" />
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-900">{product.name}</h3>
        <p className="text-sm text-slate-500">{product.category}</p>
        <p className="text-lg font-semibold text-[#8B1E4F]">Rs. {product.price}</p>
      </div>
      <Link
        href="#"
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#8B1E4F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#6F173D]"
      >
        View Details
      </Link>
    </div>
  );
}

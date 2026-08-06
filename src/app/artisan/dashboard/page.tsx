"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUnreadMessageCount } from "@/hooks/useUnreadMessageCount";
import {
  Package,
  ShoppingBag,
  Wallet,
  Clock,
  Plus,
  Edit3,
  Image,
  MessageSquare,
  Star,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";

type ProfileData = {
  fullName: string;
  email: string;
  businessName: string;
  bio: string;
  profileImage: string | null;
  verificationStatus: string;
};

type CategoryData = {
  id: number;
  categoryName: string;
};

/* ──────────────────────────────────────────
   Hardcoded data (kept exactly as before)
   ────────────────────────────────────────── */
const stats = [
  {
    title: "Total Products",
    value: "24",
    detail: "Active listings",
    icon: Package,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
    trend: "+12% this month",
    trendUp: true,
  },
  {
    title: "Total Orders",
    value: "86",
    detail: "Completed this month",
    icon: ShoppingBag,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    trend: "+18% this month",
    trendUp: true,
  },
  {
    title: "Total Revenue",
    value: "PKR 184,500",
    detail: "Across all orders",
    icon: Wallet,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
    trend: "+8% this month",
    trendUp: true,
  },
  {
    title: "Pending Orders",
    value: "7",
    detail: "Awaiting fulfillment",
    icon: Clock,
    bgColor: "bg-amber-100",
    iconColor: "text-amber-600",
    trend: "2 due today",
    trendUp: false,
  },
];

const recentOrders = [
  { name: "Ayesha Khan", product: "Embroidered Dupatta", date: "Apr 12, 2026", status: "Completed", price: "PKR 4,500", avatar: "AK" },
  { name: "Fatima Ali", product: "Crochet Table Set", date: "Apr 11, 2026", status: "Processing", price: "PKR 2,800", avatar: "FA" },
  { name: "Sana Tariq", product: "Mirror Work Cushion", date: "Apr 10, 2026", status: "Pending", price: "PKR 1,900", avatar: "ST" },
  { name: "Zara Ahmed", product: "Zardozi Jewelry Box", date: "Apr 09, 2026", status: "Completed", price: "PKR 6,200", avatar: "ZA" },
  { name: "Hira Noor", product: "Fabric Painting Set", date: "Apr 08, 2026", status: "Shipped", price: "PKR 3,100", avatar: "HN" },
];

const quickActions = [
  { title: "Add Product", description: "List a new handmade item", icon: Plus, href: "/artisan/add-product", bg: "bg-gradient-to-br from-pink-50 to-rose-100", iconBg: "bg-[#8B1E4D]" },
  { title: "Edit Profile", description: "Update your artisan info", icon: Edit3, href: "/artisan/edit-profile", bg: "bg-gradient-to-br from-sky-50 to-blue-100", iconBg: "bg-blue-600" },
  { title: "Update Portfolio", description: "Showcase your best work", icon: Image, href: "/artisan/portfolio", bg: "bg-gradient-to-br from-emerald-50 to-green-100", iconBg: "bg-emerald-600" },
  { title: "Messages", description: "View customer conversations", icon: MessageSquare, href: "/chat", bg: "bg-gradient-to-br from-amber-50 to-orange-100", iconBg: "bg-amber-600" },
];

const reviews = [
  { name: "Mariam Iqbal", rating: 5, text: "Absolutely stunning work! The embroidery is exquisite and the delivery was faster than expected. Highly recommend!", date: "2 days ago", avatar: "MI" },
  { name: "Usman Raza", rating: 4, text: "Beautiful crochet set, very detailed. Would have loved a slightly different color but overall very happy with the purchase.", date: "5 days ago", avatar: "UR" },
  { name: "Rabia Sattar", rating: 5, text: "The mirror work cushion is a masterpiece. It adds such elegance to my living room. Will definitely order again!", date: "1 week ago", avatar: "RS" },
];

const statusColor: Record<string, string> = {
  Completed: "bg-green-100 text-green-700",
  Processing: "bg-blue-100 text-blue-700",
  Pending: "bg-amber-100 text-amber-700",
  Shipped: "bg-purple-100 text-purple-700",
};

/* ──────────────────────────────────────────
   Helpers
   ────────────────────────────────────────── */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

/* ──────────────────────────────────────────
   Component
   ────────────────────────────────────────── */
export default function ArtisanDashboardPage() {
  const { authState } = useAuth();
  const unreadMessageCount = useUnreadMessageCount();

  /* Profile state */
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!authState.loggedIn || authState.role !== "artisan") return;

    const fetchData = async () => {
      try {
        const [profileRes, catsRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/artisan-categories"),
        ]);

        if (profileRes.ok) {
          const data = await profileRes.json();
          setProfile(data);
        }
        if (catsRes.ok) {
          const data = await catsRes.json();
          setCategories(data.categories ?? []);
        }
      } catch {
        /* silently fail */
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [authState.loggedIn, authState.role]);

  const displayName = profile?.fullName || authState.name || "Artisan";
  const primaryCategory = categories.length > 0 ? categories[0].categoryName : "Embroidery Artist";
  const profileImage = profile?.profileImage;
  const initials = getInitials(displayName);

  /* ── Render ─────────────────────────────── */
  return (
    <div className="space-y-8">
      {/* ============================= */}
      {/*  Hero Section                 */}
      {/* ============================= */}
      <section className="relative overflow-hidden rounded-[32px] bg-white p-8 shadow-lg shadow-slate-200/50 sm:p-10">
        {/* Decorative pink abstract blobs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-[#FFE4EC]/60 to-[#FFD6E3]/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-gradient-to-tr from-[#FFD6E3]/40 to-[#FFC8D8]/20 blur-2xl" />

        {/* Decorative floral watermark SVG */}
        <svg
          className="pointer-events-none absolute right-12 top-12 h-40 w-40 text-[#8B1E4D]/5"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="1" />
          <path d="M100 20 L105 40 L95 40 Z" fill="currentColor" />
          <path d="M100 180 L105 160 L95 160 Z" fill="currentColor" />
          <path d="M20 100 L40 105 L40 95 Z" fill="currentColor" />
          <path d="M180 100 L160 105 L160 95 Z" fill="currentColor" />
          <path d="M45 45 L60 60 L55 65 Z" fill="currentColor" />
          <path d="M155 155 L140 140 L145 135 Z" fill="currentColor" />
          <path d="M45 155 L60 140 L55 135 Z" fill="currentColor" />
          <path d="M155 45 L140 60 L145 65 Z" fill="currentColor" />
        </svg>

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Left content */}
          <div className="max-w-xl">
            {/* Greeting */}
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FDF2F8] px-4 py-1.5 text-xs font-bold tracking-wide text-[#8B1E4D]">
              <Sparkles className="h-3.5 w-3.5" />
              {getGreeting()} 👋
            </span>

            <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              Welcome back, {dataLoading ? "..." : displayName.split(" ")[0]}!
            </h1>

            <p className="mt-2 text-sm font-medium text-[#8B1E4D]/80">
              {dataLoading ? "Loading..." : primaryCategory}
            </p>

            {/* Star rating */}
            <div className="mt-2 flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-medium text-amber-600">Artisan</span>
            </div>

            <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-500 sm:text-base">
              Track your orders, manage products, and grow your handmade business from one polished place.
            </p>
          </div>

          {/* Right – profile image + availability */}
          <div className="flex shrink-0 flex-col items-center gap-4 sm:flex-row">
            {/* Circular artisan profile */}
            <div className="relative">
              {/* Pink blobs behind image */}
              <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-[#FFE4EC] via-[#FFD6E3] to-[#FFC8D8] opacity-60 blur-sm" />
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#FFD6E3] to-[#FFB6C8] opacity-40 blur-md" />

              {profileImage ? (
                <img
                  src={profileImage}
                  alt={displayName}
                  className="relative h-20 w-20 rounded-full object-cover ring-4 ring-white/80 shadow-md sm:h-24 sm:w-24"
                />
              ) : (
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#8B1E4D] to-[#C6648A] text-xl font-bold text-white shadow-md ring-4 ring-white/80 sm:h-24 sm:w-24 sm:text-2xl">
                  {initials}
                </div>
              )}
            </div>

            {/* Availability card */}
            <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50/80 px-5 py-3.5 backdrop-blur-sm">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
              </span>
              <div>
                <p className="text-sm font-bold text-green-800">Available for orders</p>
                <p className="text-xs text-green-600">Accepting new projects</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================= */}
      {/*  Statistics Cards             */}
      {/* ============================= */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-200/30"
            >
              {/* Pink glow on hover */}
              <div className="pointer-events-none absolute -inset-1 rounded-[28px] bg-gradient-to-br from-pink-100/0 to-pink-100/0 opacity-0 transition-all duration-500 group-hover:from-pink-100/40 group-hover:to-rose-100/20 group-hover:opacity-100" />

              <div className="relative z-10 flex items-start justify-between">
                <div className={`rounded-2xl p-3 ${item.bgColor} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <Icon className={`h-6 w-6 ${item.iconColor}`} />
                </div>
                <span
                  className={`flex items-center gap-1 text-xs font-medium ${
                    item.trendUp ? "text-green-600" : "text-amber-600"
                  }`}
                >
                  <TrendingUp className="h-3 w-3" />
                  {item.trend}
                </span>
              </div>
              <div className="relative z-10 mt-5">
                <p className="text-sm font-medium text-slate-500">{item.title}</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{item.value}</p>
                <p className="mt-1 text-xs text-slate-400">{item.detail}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* ============================= */}
      {/*  Quick Actions                */}
      {/* ============================= */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                aria-label={action.title === "Messages" && unreadMessageCount > 0 ? `Messages, ${unreadMessageCount} unread` : action.title}
                className={`group relative flex items-center gap-4 overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${action.bg}`}
              >
                {/* Subtle overlay on hover */}
                <div className="pointer-events-none absolute inset-0 bg-white/0 transition-all duration-300 group-hover:bg-white/20" />

                <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-xl ${action.iconBg} text-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="relative z-10 flex-1">
                  <p className="text-sm font-bold text-slate-800">{action.title}</p>
                  <p className="text-xs text-slate-500">{action.description}</p>
                </div>
                <ArrowUpRight className="relative z-10 h-4 w-4 text-slate-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                {action.title === "Messages" && unreadMessageCount > 0 && (
                  <span className="absolute right-4 top-4 z-20 inline-flex min-w-6 items-center justify-center rounded-full bg-[#8B1E4D] px-1.5 py-0.5 text-xs font-bold text-white shadow-sm">
                    {unreadMessageCount > 99 ? "99+" : unreadMessageCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* ============================= */}
      {/*  Recent Orders                */}
      {/* ============================= */}
      <section className="rounded-[32px] bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
            <p className="mt-1 text-sm text-slate-500">Latest transactions from customers</p>
          </div>
          <Link
            href="/artisan/dashboard"
            className="rounded-full bg-[#FDF2F8] px-4 py-2 text-xs font-semibold text-[#8B1E4D] transition hover:bg-[#FCE7F3]"
          >
            View All
          </Link>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="pb-3 pr-4">Customer</th>
                <th className="pb-3 pr-4">Product</th>
                <th className="hidden pb-3 pr-4 sm:table-cell">Date</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Price</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-slate-50 last:border-none transition-colors duration-200 ${
                    idx % 2 === 1 ? "bg-[#FFF8F5]/60" : "bg-white"
                  } hover:bg-[#FFF0F5]/40`}
                >
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          idx % 2 === 0
                            ? "bg-[#8B1E4D]/10 text-[#8B1E4D]"
                            : "bg-[#C6648A]/10 text-[#C6648A]"
                        }`}
                      >
                        {order.avatar}
                      </span>
                      <span className="font-medium text-slate-800">{order.name}</span>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-slate-600">{order.product}</td>
                  <td className="hidden py-4 pr-4 text-slate-500 sm:table-cell">{order.date}</td>
                  <td className="py-4 pr-4">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${statusColor[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 pr-4 font-semibold text-slate-800">{order.price}</td>
                  <td className="py-4 text-right">
                    <button
                      type="button"
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-[#FDF2F8] hover:text-[#8B1E4D]"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================= */}
      {/*  Latest Reviews               */}
      {/* ============================= */}
      <section className="rounded-[32px] bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Latest Reviews</h2>
            <p className="mt-1 text-sm text-slate-500">What customers are saying</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-slate-100 bg-[#FFF8F5] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-pink-200/20"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    idx % 2 === 0
                      ? "bg-[#8B1E4D]/10 text-[#8B1E4D]"
                      : "bg-[#C6648A]/10 text-[#C6648A]"
                  }`}
                >
                  {review.avatar}
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-800">{review.name}</p>
                  <div className="mt-0.5 flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < review.rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="ml-auto text-xs text-slate-400">{review.date}</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">&ldquo;{review.text}&rdquo;</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


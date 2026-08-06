import Link from "next/link";
import { getDashboardData } from "@/lib/dashboard";

export default async function AdminPage() {
  const data = await getDashboardData();

  const stats = [
    { label: "Total Customers", value: data.totalCustomers.toString(), accent: "bg-[#FCE8EE] text-[#8B1E4D]" },
    { label: "Total Artisans", value: data.totalArtisans.toString(), accent: "bg-[#FDE9ED] text-[#8B1E4D]" },
    { label: "Pending Approvals", value: data.pendingApprovals.toString(), accent: "bg-[#FFF1F4] text-[#8B1E4D]" },
    { label: "Total Reviews", value: data.totalReviews.toString(), accent: "bg-[#FFEEF2] text-[#8B1E4D]" },
    { label: "Total Revenue", value: `Rs. ${data.totalRevenue.toLocaleString()}`, accent: "bg-[#FEEEF1] text-[#8B1E4D]" },
  ];

  const quickActions = [
    { label: "Approve Artisans", icon: "✅", href: "/admin/approvals" },
    { label: "Manage Users", icon: "👥", href: "/admin/customers" },
    { label: "Manage Reviews", icon: "⭐", href: "/reviews" },
    { label: "View Reports", icon: "📊", href: "/admin/analytics" },
  ];

  const adminHighlights = [
    { title: "Artisans", value: data.totalArtisans, detail: "Profiles available" },
    { title: "Products", value: data.totalProducts, detail: "Items in catalog" },
    { title: "Categories", value: data.totalCategories, detail: "Service categories" },
    { title: "Pending Requests", value: data.pendingApprovals, detail: "New artisan approvals" },
    { title: "Customer Tickets", value: data.customerTickets, detail: "Open support tasks" },
    { title: "Revenue Target", value: "Rs. 80,000", detail: "Monthly goal" },
  ];

  return (
    <main className="min-h-screen bg-[#FFF8F5] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-4xl bg-white p-8 shadow-lg shadow-slate-200/50">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8B1E4D]">
                Admin Dashboard
              </p>
              <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">
                HunarConnect Admin
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                Manage artisans, customers, reviews, and platform activity from one polished admin workspace.
              </p>
            </div>
            <div className="rounded-3xl bg-[#FFF0ED] px-6 py-5 text-sm font-semibold text-[#8B1E4D] shadow-sm border border-[#F1D4DA]">
              Status: Live platform monitoring
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group rounded-4xl bg-white p-6 shadow-lg shadow-slate-200/40 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={`inline-flex rounded-2xl px-3 py-2 text-sm font-semibold ${stat.accent}`}>
                {stat.label}
              </div>
              <p className="mt-6 text-3xl font-semibold text-slate-900">{stat.value}</p>
              <p className="mt-3 text-sm text-slate-500">{stat.label} overview</p>
            </div>
          ))}
        </section>

        <section className="rounded-4xl bg-white p-8 shadow-lg shadow-slate-200/50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Quick Actions</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use these admin actions to jump to the most important management screens.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/admin/users" className="inline-flex items-center justify-center rounded-full bg-[#8B1E4D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#731942]">
                View All
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 rounded-3xl border border-[#E9D9D1] bg-[#FFF8F5] px-5 py-4 text-left text-slate-900 transition hover:border-[#8B1E4D] hover:bg-white"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F9D7E0] text-lg">
                  {action.icon}
                </span>
                <span className="text-sm font-semibold">{action.label}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.7fr_0.3fr]">
          <div className="space-y-6 rounded-4xl bg-white p-8 shadow-lg shadow-slate-200/50">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8B1E4D]">
                  Platform Snapshot
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Administrative insights</h2>
              </div>
              
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {adminHighlights.map((item) => (
                <div key={item.title} className="rounded-[28px] border border-slate-200 bg-[#FFF8F5] p-5">
                  <p className="text-sm font-semibold text-slate-600">{item.title}</p>
                  <p className="mt-4 text-2xl font-semibold text-slate-900">{item.value}</p>
                  <p className="mt-2 text-sm text-slate-500">{item.detail}</p>
                </div>
              ))}
            </div>

            <div className="rounded-4xl border border-slate-200 bg-[#FFF8F5] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8B1E4D]">
                    Pending Artisan Approvals
                  </p>
                  <h3 className="mt-3 text-3xl font-semibold text-slate-900">8</h3>
                </div>
                <div className="rounded-3xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
                  View queue
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Review new artisan profiles and verify documentation before they go live on the marketplace.
              </p>
            </div>
          </div>

          <aside className="space-y-6 rounded-4xl bg-white p-8 shadow-lg shadow-slate-200/50">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8B1E4D]">Recent Artisans</p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-900">Live on platform</h3>
            </div>

            <div className="space-y-4">
              {data.recentArtisans.map((artisan) => (
                <div key={artisan.id} className="rounded-3xl border border-slate-200 bg-[#FFF8F5] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{artisan.name}</p>
                      <p className="text-sm text-slate-500">{artisan.category} · {artisan.city}</p>
                    </div>
                    <span className="rounded-full bg-[#F9D7E0] px-3 py-1 text-sm font-semibold text-[#8B1E4D]">
                      {artisan.rating}★
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-4xl bg-[#FFF0ED] p-5 text-sm leading-6 text-slate-700">
              <p className="font-semibold text-[#8B1E4D]">Admin Notes</p>
              <p className="mt-3">
                Keep artisan profiles updated, approve verified sellers, and ensure product listings match platform quality standards.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

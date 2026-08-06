import { products, artisanProfiles } from "@/data/artisans";

export default function AdminAnalyticsPage() {
  const totalArtisans = artisanProfiles.length;
  const totalProducts = products.length;
  const totalSales = "Rs. 1,24,500";
  const monthlyGrowth = "+18%";

  return (
    <main className="min-h-screen bg-[#FFF8F5] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[32px] bg-white p-8 shadow-lg shadow-slate-200/50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8B1E4D]">Analytics</p>
              <h1 className="mt-4 text-4xl font-semibold text-slate-900">Website Performance Report</h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                Get a quick view of platform performance, customer activity, and artisan growth across HunarConnect.
              </p>
            </div>
            <div className="rounded-3xl bg-[#FFF0ED] px-6 py-5 text-sm font-semibold text-[#8B1E4D] shadow-sm border border-[#F1D4DA]">
              Updated just now
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Artisans", value: totalArtisans },
            { label: "Total Products", value: totalProducts },
            { label: "Total Sales", value: totalSales },
            { label: "Monthly Growth", value: monthlyGrowth },
          ].map((item) => (
            <div key={item.label} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8B1E4D]">{item.label}</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="rounded-[32px] bg-white p-8 shadow-lg shadow-slate-200/50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Platform Overview</h2>
              <p className="mt-2 text-sm text-slate-600">
                Trend highlights and key metrics for artisan adoption, user engagement, and revenue performance.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[28px] border border-slate-200 bg-[#FFF8F5] p-6">
              <h3 className="text-lg font-semibold text-slate-900">Active Artisan Growth</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Artisan signups continue to grow steadily each month, with the current quarter showing the strongest onboarding since launch.
              </p>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-[#FFF8F5] p-6">
              <h3 className="text-lg font-semibold text-slate-900">Customer Engagement</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Average session duration has increased, and new customer traffic is trending upwards thanks to recent promotional activity.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

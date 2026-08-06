import Link from "next/link";
import { artisanProfiles } from "@/data/artisans";

export default function AdminUsersPage() {
  return (
    <main className="min-h-screen bg-[#FFF8F5] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[32px] bg-white p-8 shadow-lg shadow-slate-200/50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8B1E4D]">
                Admin Users
              </p>
              <h1 className="mt-4 text-4xl font-semibold text-slate-900">Manage Artisan Accounts</h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                Review artisan profiles and customer accounts, approve pending artisans, and keep the platform secure.
              </p>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-full bg-[#8B1E4D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#731942]"
            >
              Back to Dashboard
            </Link>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {artisanProfiles.map((artisan) => (
            <div key={artisan.id} className="rounded-[28px] border border-slate-200 bg-[#FFF8F5] p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{artisan.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{artisan.category} · {artisan.city}</p>
                </div>
                <span className="rounded-full bg-[#F9D7E0] px-3 py-1 text-sm font-semibold text-[#8B1E4D]">
                  {artisan.rating}★
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{artisan.description}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button className="rounded-full bg-[#8B1E4D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#731942]">
                  View Profile
                </button>
                <button className="rounded-full border border-[#8B1E4D] bg-white px-4 py-2 text-sm font-semibold text-[#8B1E4D] transition hover:bg-[#8B1E4D] hover:text-white">
                  Approve
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

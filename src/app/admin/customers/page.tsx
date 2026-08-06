import Link from "next/link";

const sampleCustomers = [
  { id: 1, name: "Ayesha Khan", email: "ayesha@example.com", orders: 12 },
  { id: 2, name: "Sara Malik", email: "sara@example.com", orders: 5 },
  { id: 3, name: "Zain Ali", email: "zain@example.com", orders: 8 },
  { id: 4, name: "Amina Noor", email: "amina@example.com", orders: 3 },
];

export default function AdminCustomersPage() {
  return (
    <main className="min-h-screen bg-[#FFF8F5] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[32px] bg-white p-8 shadow-lg shadow-slate-200/50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8B1E4D]">
                Customer Management
              </p>
              <h1 className="mt-4 text-4xl font-semibold text-slate-900">Manage Customers</h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                View customer accounts, contact details, and recent order activity from this admin panel.
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

        <section className="rounded-[32px] bg-white p-6 shadow-lg shadow-slate-200/50">
          <div className="grid gap-4 sm:grid-cols-2">
            {sampleCustomers.map((customer) => (
              <div key={customer.id} className="rounded-[28px] border border-slate-200 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{customer.name}</p>
                    <p className="text-sm text-slate-500">{customer.email}</p>
                  </div>
                  <span className="rounded-full bg-[#F9D7E0] px-3 py-1 text-sm font-semibold text-[#8B1E4D]">
                    {customer.orders} orders
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button className="rounded-full bg-[#8B1E4D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#731942]">
                    View Account
                  </button>
                  <button className="rounded-full border border-[#8B1E4D] bg-white px-4 py-2 text-sm font-semibold text-[#8B1E4D] transition hover:bg-[#8B1E4D] hover:text-white">
                    Contact
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

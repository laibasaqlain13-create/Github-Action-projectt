import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#FFF8F5] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl rounded-3xl bg-white border border-[#E9D9D1] p-10 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#8B1E4D]">Create Your Account</h1>
          <p className="mt-3 text-sm text-[#6B7280]">Choose your path and join HunarConnect today.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Link
            href="/register/customer"
            className="rounded-3xl border border-[#E9D9D1] bg-[#FFF8F5] p-6 text-center transition hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="text-lg font-semibold text-[#2D1F25]">Customer</p>
            <p className="mt-3 text-sm text-[#6B7280]">Browse artisans, request services, and manage orders.</p>
          </Link>

          <Link
            href="/register/artisan"
            className="rounded-3xl border border-[#E9D9D1] bg-[#FFF8F5] p-6 text-center transition hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="text-lg font-semibold text-[#2D1F25]">Artisan</p>
            <p className="mt-3 text-sm text-[#6B7280]">Sign up to offer your craft, manage listings, and grow your business.</p>
          </Link>
        </div>

        <p className="mt-8 text-center text-sm text-[#6B7280]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#8B1E4D] hover:text-[#73153F]">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}

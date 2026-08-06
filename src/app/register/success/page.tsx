"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function RegistrationSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const role = searchParams.get("role");

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router, role]);

  return (
    <main className="min-h-screen bg-[#FFF8F5] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl rounded-3xl bg-white border border-[#E9D9D1] p-10 shadow-lg text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600">
          ✓
        </div>

        <h1 className="text-2xl font-bold text-[#2D1F25]">
          Registration Successful
        </h1>

        <p className="mt-3 text-sm text-[#6B7280]">
          Your account is ready. Redirecting you to sign in...
        </p>
      </div>
    </main>
  );
}

export default function RegistrationSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center"><p className="text-gray-600">Loading...</p></div>}>
      <RegistrationSuccessContent />
    </Suspense>
  );
}

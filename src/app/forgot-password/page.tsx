"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "Unable to process request.");
        return;
      }

      if (!data.token) {
        setError("Unable to start password reset. Please try again.");
        return;
      }

      router.push(`/reset-password?token=${encodeURIComponent(data.token)}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF8F5] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white border border-[#E9D9D1] p-10 shadow-xl">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#8B1E4D]">
            Forgot Password
          </h1>

          <p className="mt-3 text-sm text-[#6B7280]">
            Enter your registered email to continue to password reset.
          </p>
        </div>

        <form
          className="space-y-5"
          onSubmit={handleSubmit}
        >

          <div>
            <label className="block mb-2 text-sm font-medium text-[#2D1F25]">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter your registered email"
              className="w-full rounded-xl border border-[#E9D9D1] bg-white p-3 text-sm text-[#2D1F25] outline-none focus:ring-2 focus:ring-[#8B1E4D]"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#8B1E4D] py-3 text-sm font-semibold text-white transition hover:bg-[#73153F] disabled:opacity-60"
          >
            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </button>

        </form>

        <p className="mt-8 text-center text-sm text-[#6B7280]">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#8B1E4D] hover:text-[#73153F]"
          >
            Login
          </Link>
        </p>

      </div>
    </main>
  );
}

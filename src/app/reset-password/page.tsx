"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("This password reset link is invalid or incomplete.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "Unable to reset password.");
        return;
      }

      setMessage(data.message || "Password reset successfully. You can now log in.");
      setPassword("");
      setConfirmPassword("");
      router.replace("/login");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFF8F5] px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-[#E9D9D1] bg-white p-10 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-[#8B1E4D]">Reset Password</h1>
          <p className="mt-3 text-sm text-[#6B7280]">Choose a new password for your account.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#2D1F25]">Username or email</label>
            <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required placeholder="Enter your registered email" className="w-full rounded-xl border border-[#E9D9D1] bg-white p-3 text-sm text-[#2D1F25] outline-none focus:ring-2 focus:ring-[#8B1E4D]" />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#2D1F25]">New password</label>
            <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required className="w-full rounded-xl border border-[#E9D9D1] bg-white p-3 text-sm text-[#2D1F25] outline-none focus:ring-2 focus:ring-[#8B1E4D]" />
          </div>

          <div>
            <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-[#2D1F25]">Confirm new password</label>
            <input id="confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={8} required className="w-full rounded-xl border border-[#E9D9D1] bg-white p-3 text-sm text-[#2D1F25] outline-none focus:ring-2 focus:ring-[#8B1E4D]" />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}

          <button type="submit" disabled={loading || !token} className="w-full rounded-xl bg-[#8B1E4D] py-3 text-sm font-semibold text-white transition hover:bg-[#73153F] disabled:opacity-60">
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[#6B7280]">Remember your password? <Link href="/login" className="font-semibold text-[#8B1E4D] hover:text-[#73153F]">Login</Link></p>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#FFF8F5]" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

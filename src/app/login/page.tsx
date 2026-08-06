"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!role) {
      setError("Please select a role.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    setLoading(true);
    try {
      
     const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email,
    password,
  }),
});
      const data = await response.json().catch(() => ({}));
      if (!response.ok) { setError(data.error || "Unable to sign in."); return; }
      const authenticatedRole = data.user.role === "ARTISAN" ? "artisan" : "customer";
      if (authenticatedRole !== role) { setError("Please select the role registered for this account."); return; }
      login(data.user);
      router.push(authenticatedRole === "artisan" ? "/artisan/dashboard" : "/dashboard/customer");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF8F5] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md rounded-3xl bg-white border border-[#E9D9D1] p-10 shadow-xl">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#8B1E4D]">
            Welcome Back
          </h1>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* Login As */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[#2D1F25]">
              Login As
            </label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-[#E9D9D1] bg-white p-3 text-sm text-[#2D1F25] outline-none focus:ring-2 focus:ring-[#8B1E4D]"
            >
              <option value="">Select Role</option>
              <option value="customer">Customer</option>
              <option value="artisan">Artisan</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[#2D1F25]">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-xl border border-[#E9D9D1] bg-white p-3 text-sm text-[#2D1F25] outline-none focus:ring-2 focus:ring-[#8B1E4D]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[#2D1F25]">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              className="w-full rounded-xl border border-[#E9D9D1] bg-white p-3 text-sm text-[#2D1F25] outline-none focus:ring-2 focus:ring-[#8B1E4D]"
            />
          </div>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-[#8B1E4D] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#8B1E4D] py-3 font-semibold text-white transition hover:bg-[#73153F] disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-[#2D1F25]">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#8B1E4D]"
          >
            Register
          </Link>
        </div>

      </div>
    </main>
  );
}


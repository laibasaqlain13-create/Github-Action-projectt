"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomerRegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError("Please fill all required fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agree) {
      setError("You must agree to the Terms & Conditions.");
      return;
    }

    setLoading(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, phone, role: 'customer' }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data?.error || 'Failed to create account')
        setLoading(false)
        return
      }

      router.push('/register/success?role=customer')
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF8F5] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-[#E9D9D1] p-10 shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#8B1E4D]">Create Customer Account</h1>
          <p className="mt-2 text-sm text-[#6B7280]">Sign up to discover and order handmade products.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-[#2D1F25]">Full Name</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 w-full rounded-xl border border-[#E9D9D1] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#8B1E4D]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2D1F25]">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-[#E9D9D1] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#8B1E4D]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2D1F25]">Phone Number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded-xl border border-[#E9D9D1] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#8B1E4D]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2D1F25]">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-xl border border-[#E9D9D1] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#8B1E4D]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2D1F25]">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 w-full rounded-xl border border-[#E9D9D1] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#8B1E4D]" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input id="agree" type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-[#8B1E4D] focus:ring-[#8B1E4D]" />
            <label htmlFor="agree" className="text-sm text-[#2D1F25]">I agree to the <Link href="/terms" className="text-[#8B1E4D] underline">Terms & Conditions</Link>.</label>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button disabled={loading} className="w-full rounded-xl bg-[#8B1E4D] py-3 text-white font-semibold transition hover:bg-[#73153F] disabled:opacity-60">{loading ? 'Creating...' : 'Create Customer Account'}</button>
        </form>

        <p className="mt-4 text-center text-sm text-[#6B7280]">
          Already have an account? <Link href="/login" className="text-[#8B1E4D] font-medium">Login</Link>
        </p>
      </div>
    </main>
  );
}

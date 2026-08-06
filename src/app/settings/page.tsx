"use client";

import Link from "next/link";
import { useState } from "react";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const handlePasswordUpdate = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    setPasswordUpdating(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setPasswordSuccess("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(data.error || "Failed to change password.");
      }
    } catch {
      setPasswordError("Network error. Please try again.");
    } finally {
      setPasswordUpdating(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF8F5] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl rounded-3xl bg-white border border-[#E9D9D1] p-10 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#8B1E4D]">Settings</h1>
          <p className="mt-3 text-sm text-[#6B7280]">Update your account settings in one elegant place.</p>
        </div>

        <div className="rounded-3xl bg-[#FFF8F5] border border-[#E9D9D1] p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-[#2D1F25]">Change Password</h2>

          {passwordSuccess && (
            <div className="mt-4 rounded-xl bg-green-100 p-4 text-sm font-medium text-green-700">
              ✅ {passwordSuccess}
            </div>
          )}

          {passwordError && (
            <div className="mt-4 rounded-xl bg-red-100 p-4 text-sm font-medium text-red-700">
              ❌ {passwordError}
            </div>
          )}

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2D1F25]">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-xl border border-[#E9D9D1] bg-white px-3 py-3 text-sm text-[#2D1F25] outline-none focus:ring-2 focus:ring-[#8B1E4D]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2D1F25]">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-[#E9D9D1] bg-white px-3 py-3 text-sm text-[#2D1F25] outline-none focus:ring-2 focus:ring-[#8B1E4D]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2D1F25]">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-[#E9D9D1] bg-white px-3 py-3 text-sm text-[#2D1F25] outline-none focus:ring-2 focus:ring-[#8B1E4D]"
              />
            </div>

            <button
              onClick={handlePasswordUpdate}
              disabled={passwordUpdating}
              className="w-full rounded-xl bg-[#8B1E4D] py-3 text-sm font-semibold text-white transition hover:bg-[#73153F] disabled:opacity-60"
            >
              {passwordUpdating ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-[#E9D9D1] bg-[#FFF1EF] p-6">
          <h2 className="text-xl font-semibold text-[#8B1E4D]">Delete Account</h2>
          <button className="mt-4 rounded-xl bg-[#8B1E4D] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#73153F]">
            Delete
          </button>
        </div>
        <div className="mt-6">
          <Link href="/profile" className="inline-flex rounded-xl border border-[#E9D9D1] bg-white px-4 py-3 text-sm font-semibold text-[#2D1F25] transition hover:border-[#8B1E4D] hover:text-[#8B1E4D]">
            Back to Profile
          </Link>
        </div>
      </div>
    </main>
  );
}

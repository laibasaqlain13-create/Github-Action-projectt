"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { authState, isLoading: isAuthLoading, updateProfile } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    if (isAuthLoading) return;
    if (!authState.loggedIn || authState.role !== "customer") {
      router.push("/");
      return;
    }
    setName(authState.name || "");
    setEmail(authState.email || "");
  }, [authState, isAuthLoading, router]);

  const saveProfile = () => {
    updateProfile({ name: name.trim(), email: email.trim() });
    setSaved(true);
  };

  const handlePasswordUpdate = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword) {
      setPasswordError("Please fill in both password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
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
    <main className="min-h-screen bg-[#FFF8F5] px-4 py-8">
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-[#E9D9D1] bg-white p-6 shadow-xl sm:p-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-[#8B1E4D]">Profile</h1>
          <p className="mt-3 text-sm text-[#6B7280]">Manage your personal information, preferences, and account security.</p>
        </div>

        <section className="border-b border-[#E9D9D1] pb-6">
          <h2 className="text-xl font-semibold text-[#2D1F25]">Personal Information</h2>
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div><dt className="text-[#6B7280]">Name</dt><dd className="mt-1 font-semibold text-[#8B1E4D]">{authState.name || "Not provided"}</dd></div>
            <div><dt className="text-[#6B7280]">Email</dt><dd className="mt-1 break-all font-semibold text-[#8B1E4D]">{authState.email || "Not provided"}</dd></div>
          </dl>
        </section>

        <section className="border-b border-[#E9D9D1] py-6">
          <h2 className="text-xl font-semibold text-[#2D1F25]">Edit Profile</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-[#2D1F25]">Full Name<input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-[#E9D9D1] px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[#8B1E4D]" /></label>
            <label className="text-sm font-medium text-[#2D1F25]">Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-[#E9D9D1] px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[#8B1E4D]" /></label>
          </div>
          {saved && <p className="mt-3 text-sm text-green-700">Profile updated.</p>}
          <button onClick={saveProfile} className="mt-4 rounded-xl bg-[#8B1E4D] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#73153F]">Save Changes</button>
        </section>

        <section className="border-b border-[#E9D9D1] py-6">
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

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="rounded-xl border border-[#E9D9D1] px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[#8B1E4D]"
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="rounded-xl border border-[#E9D9D1] px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[#8B1E4D]"
            />
          </div>
          <button
            onClick={handlePasswordUpdate}
            disabled={passwordUpdating}
            className="mt-4 rounded-xl bg-[#8B1E4D] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#73153F] disabled:opacity-60"
          >
            {passwordUpdating ? "Updating..." : "Update Password"}
          </button>
        </section>

        <section className="border-b border-[#E9D9D1] py-6">
          <h2 className="text-xl font-semibold text-[#2D1F25]">Notification Settings</h2>
          <label className="mt-4 flex items-center gap-3 text-sm text-[#2D1F25]"><input type="checkbox" checked={notifications} onChange={(event) => setNotifications(event.target.checked)} className="h-4 w-4 accent-[#8B1E4D]" />Receive messages and review notifications</label>
        </section>

        <section className="pt-6">
          <h2 className="text-xl font-semibold text-[#2D1F25]">Privacy &amp; Security</h2>
          <label className="mt-4 flex items-center gap-3 text-sm text-[#2D1F25]"><input type="checkbox" checked={profileVisible} onChange={(event) => setProfileVisible(event.target.checked)} className="h-4 w-4 accent-[#8B1E4D]" />Allow artisans to view my profile information</label>
        </section>
      </div>
    </main>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const { authState, logout } = useAuth();

  const [search, setSearch] = useState("");
  const [filterField, setFilterField] = useState<"name" | "category" | "city">("name");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeNavigation, setActiveNavigation] = useState(
    pathname === "/about" ? "About" : "Home"
  );

  const dashboardHref = authState.role === "artisan" ? "/artisan/dashboard" : "/dashboard/customer";

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = search.trim();

    if (!query) return;

    router.push(`/artisans?search=${encodeURIComponent(query)}&filter=${filterField}`);
  };

  // ✅ Logout Function
  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    setShowLogoutModal(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#F3E9E6] bg-[#FFF9F6]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6 py-4 sm:px-8">

        {/* Left Side */}
        <div className="flex flex-shrink-0 items-center gap-3">
          <Link
            href="/"
            className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-[#F3D6E1] shadow-sm"
          >
            <Image
              src="/images/hunarconnect-logo.png"
              alt="HunarConnect logo"
              width={44}
              height={44}
              priority
              className="h-full w-full object-contain"
            />
          </Link>

          <Link
            href="/"
            className="hidden text-xl font-semibold text-slate-900 sm:block"
          >
            HunarConnect
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden flex-1 items-center justify-center gap-6 text-sm font-medium sm:flex">
          {[
            { label: "Home", href: "/" },
            { label: "Categories", href: "/#categories" },
            { label: "About", href: "/about" },
          ].map((item) => {
            const isActive = activeNavigation === item.label;

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setActiveNavigation(item.label)}
                className={`relative py-2 transition after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#8B1E4D] ${
                  isActive
                    ? "text-[#8B1E4D] after:scale-x-100"
                    : "text-slate-700 after:scale-x-0 hover:text-[#8B1E4D] hover:after:scale-x-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <a
            href="#contact"
            onClick={() => setActiveNavigation("Contact")}
            className={`relative py-2 transition after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#8B1E4D] ${
              activeNavigation === "Contact"
                ? "text-[#8B1E4D] after:scale-x-100"
                : "text-slate-700 after:scale-x-0 hover:text-[#8B1E4D] hover:after:scale-x-100"
            }`}
          >
            Contact
          </a>
        </nav>

        {/* Right Side */}
        <div className="flex flex-shrink-0 items-center gap-3">

          <form
            onSubmit={submitSearch}
            className="relative hidden w-60 md:block"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search artisan by ${filterField}`}
              className="w-full rounded-full border border-slate-300 bg-white py-2 pl-4 pr-10 text-sm outline-none focus:border-[#8B1E4D] focus:ring-2 focus:ring-[#8B1E4D]/20"
            />
            <button
              type="button"
              onClick={() => setIsFilterOpen((open) => !open)}
              aria-expanded={isFilterOpen}
              aria-haspopup="menu"
              aria-label="Choose how to filter artisans"
              title="Choose name, category, or city"
              className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#8B1E4D] transition hover:bg-[#8B1E4D]/10"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path d="M4 7h16M7 12h10M10 17h4" strokeLinecap="round" />
              </svg>
            </button>
            {isFilterOpen && (
              <div role="menu" className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-44 rounded-xl border border-[#F3E9E6] bg-white p-1.5 shadow-lg shadow-slate-200/70">
                {(["name", "category", "city"] as const).map((field) => (
                  <button
                    key={field}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setFilterField(field);
                      setIsFilterOpen(false);
                    }}
                    className={`block w-full rounded-lg px-3 py-2 text-left text-sm capitalize transition ${filterField === field ? "bg-[#8B1E4D]/10 font-semibold text-[#8B1E4D]" : "text-slate-700 hover:bg-[#FFF8F5]"}`}
                  >
                    Search by {field}
                  </button>
                ))}
              </div>
            )}
          </form>

          {!authState.loggedIn ? (
            <>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full border border-[#8B1E4D] bg-white px-4 py-2 text-sm font-medium text-[#8B1E4D] transition hover:bg-[#8B1E4D]/5"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <circle cx="12" cy="8" r="3.25" />
                  <path d="M5.5 20c.65-3.45 3.1-5.25 6.5-5.25s5.85 1.8 6.5 5.25" strokeLinecap="round" />
                </svg>
                Login
              </Link>






                            <Link
                href="/register"
                className="rounded-full bg-[#8B1E4D] px-4 py-2 text-sm font-semibold !text-white transition hover:bg-[#73153F]"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsAccountMenuOpen((open) => !open)}
                aria-expanded={isAccountMenuOpen}
                aria-haspopup="menu"
                className="inline-flex items-center gap-2 rounded-full bg-[#8B1E4D] px-4 py-2 text-sm font-semibold !text-white transition hover:bg-[#73153F]"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <circle cx="12" cy="8" r="3.25" />
                  <path d="M5.5 20c.65-3.45 3.1-5.25 6.5-5.25s5.85 1.8 6.5 5.25" strokeLinecap="round" />
                </svg>
                <span>{authState.name || "Account"}</span>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <path d="m7 10 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {isAccountMenuOpen && (
                <div role="menu" className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-40 rounded-xl border border-[#F3E9E6] bg-white p-1.5 shadow-lg shadow-slate-200/70">
                  <Link
                    href={dashboardHref}
                    role="menuitem"
                    onClick={() => setIsAccountMenuOpen(false)}
                    className="block w-full rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-[#FFF8F5]"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => setShowLogoutModal(true)}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[#8B1E4D] transition hover:bg-[#FFF8F5]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FEE7E9]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#8B1E4D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#2D1F25]">Log Out</h3>
              <p className="mt-2 text-sm text-gray-600">Are you sure you want to log out?</p>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
                className="flex-1 rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 rounded-xl bg-[#8B1E4D] py-3 text-sm font-semibold text-white transition hover:bg-[#73153F] disabled:opacity-60"
              >
                {isLoggingOut ? "Logging out..." : "Yes, Log Out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUnreadMessageCount } from "@/hooks/useUnreadMessageCount";
import ConfirmModal from "@/components/ConfirmModal";
import {
  LayoutDashboard,
  MessageSquare,
  Images,
  PlusCircle,
  UserCog,
  LogOut,
  Menu,
  X,
  Pencil,
  CheckCircle,
  Circle,
} from "lucide-react";

type ProfileData = {
  fullName: string;
  email: string;
  businessName: string;
  profileImage: string | null;
  verificationStatus: string;
};

type CategoryData = {
  id: number;
  categoryName: string;
};

const navigation = [
  { name: "Dashboard", href: "/artisan/dashboard", icon: LayoutDashboard },
  { name: "Messages", href: "/chat", icon: MessageSquare },
  { name: "Portfolio", href: "/artisan/portfolio", icon: Images },
  { name: "Add Product", href: "/artisan/add-product", icon: PlusCircle },
  { name: "Edit Profile", href: "/artisan/edit-profile", icon: UserCog },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ArtisanLayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { authState, isLoading, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const unreadMessageCount = useUnreadMessageCount();
  const isPublicArtisanProfile = /^\/artisan\/\d+$/.test(pathname);

  useEffect(() => {
    if (isPublicArtisanProfile) return;
    if (!isLoading && (!authState.loggedIn || authState.role !== "artisan")) {
      router.replace("/");
    }
  }, [authState, isLoading, isPublicArtisanProfile, router]);

  // Fetch artisan profile and categories for the sidebar card
  useEffect(() => {
    if (!authState.loggedIn || authState.role !== "artisan") return;

    const fetchProfileData = async () => {
      try {
        const [profileRes, catsRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/artisan-categories"),
        ]);

        if (profileRes.ok) {
          const data = await profileRes.json();
          setProfile(data);
        }

        if (catsRes.ok) {
          const data = await catsRes.json();
          setCategories(data.categories ?? []);
        }
      } catch {
        // Silently fail
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfileData();
  }, [authState.loggedIn, authState.role]);

  if (isPublicArtisanProfile) return <>{children}</>;

  if (isLoading || !authState.loggedIn || authState.role !== "artisan") {
    return (
      <main className="min-h-screen bg-[#FFF8F5] p-8 text-center text-slate-600">
        Loading dashboard...
      </main>
    );
  }

  const handleLogout = async () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    router.push("/");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const displayName = profile?.fullName || authState.name || "Artisan";
  const primaryCategory = categories.length > 0 ? categories[0].categoryName : "Artisan";
  const isVerified = profile?.verificationStatus === "APPROVED" || profile?.verificationStatus === "VERIFIED";
  const profileImage = profile?.profileImage;

  return (
    <div className="min-h-screen bg-[#FFF8F5] text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Mobile Header */}
        <div className="flex items-center justify-between border-b border-[#F3E5E5] bg-white px-5 py-4 lg:hidden">
          <span className="text-lg font-bold text-[#8B1E4D]">HunarConnect</span>
          <button
            type="button"
            className="rounded-full border border-[#F3E5E5] p-2 text-slate-700 transition hover:bg-[#FCE7F3]"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Sidebar */}
        <aside
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } w-full border-r border-[#F3E5E5] lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[280px] lg:flex-col lg:rounded-r-3xl lg:shadow-lg lg:shadow-black/5 ${
            isMobileMenuOpen ? "bg-white" : "bg-[#FFFDFB]"
          }`}
        >
          {/* Sidebar Header with subtle pink gradient */}
          <div className="relative overflow-hidden px-5 pb-2 pt-6 lg:px-6 lg:pt-8">
            {/* Decorative pink gradient blob */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-[#FFE4EC] to-[#FFD6E3] opacity-60 blur-2xl" />
            <div className="pointer-events-none absolute -left-8 top-10 h-20 w-20 rounded-full bg-gradient-to-br from-[#FFD6E3] to-[#FFC8D8] opacity-40 blur-xl" />

            {/* Profile Card */}
            {profileLoading ? (
              <div className="relative z-10 animate-pulse">
                <div className="mx-auto h-20 w-20 rounded-full bg-[#FCE7F3]" />
                <div className="mx-auto mt-3 h-4 w-28 rounded-full bg-[#FCE7F3]" />
                <div className="mx-auto mt-2 h-3 w-20 rounded-full bg-[#FCE7F3]" />
              </div>
            ) : (
              <div className="relative z-10">
                {/* Profile Card Container */}
                <div className="rounded-2xl bg-white/90 p-4 shadow-sm shadow-pink-200/50 backdrop-blur-sm ring-1 ring-pink-100">
                  <div className="flex flex-col items-center text-center">
                    {/* Profile Picture */}
                    <div className="relative">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt={displayName}
                          className="h-20 w-20 rounded-full object-cover ring-4 ring-pink-100"
                        />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#8B1E4D] to-[#C6648A] text-xl font-bold text-white shadow-md shadow-pink-200 ring-4 ring-pink-100">
                          {getInitials(displayName)}
                        </div>
                      )}
                      {/* Online Status Indicator */}
                      <span className="absolute bottom-0.5 right-0.5 flex h-4 w-4">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-green-500" />
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="mt-3 text-sm font-bold text-slate-900">{displayName}</h3>

                    {/* Verified Badge */}
                    {isVerified ? (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#8B1E4D]/10 px-3 py-0.5 text-[10px] font-semibold text-[#8B1E4D]">
                        <CheckCircle className="h-3 w-3" />
                        Verified Artisan
                      </span>
                    ) : (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-0.5 text-[10px] font-semibold text-amber-600">
                        <Circle className="h-3 w-3" />
                        Pending Verification
                      </span>
                    )}

                    {/* Craft Category */}
                    <p className="mt-1.5 text-xs font-medium text-slate-500">
                      {primaryCategory} {categories.length > 1 && `+${categories.length - 1} more`}
                    </p>

                    {/* Online Status Text */}
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="flex h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-[10px] font-medium text-green-600">Online</span>
                    </div>

                    {/* Edit Profile Button */}
                    <Link
                      href="/artisan/edit-profile"
                      className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#8B1E4D] to-[#A83260] px-4 py-1.5 text-[10px] font-semibold text-white shadow-sm shadow-pink-200 transition-all duration-300 hover:shadow-md hover:shadow-pink-300 hover:brightness-110"
                    >
                      <Pencil className="h-3 w-3" />
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col px-4 pb-4 lg:px-5 lg:pb-6">
            {/* Increased spacer between profile and nav */}
            <div className="h-4 lg:h-5" />

            <div className="flex-1 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ease-in-out ${
                      isActive
                        ? "bg-gradient-to-r from-[#8B1E4D] to-[#A83260] text-white shadow-lg shadow-[#8B1E4D]/20 translate-x-0.5"
                        : "text-slate-600 hover:translate-x-0.5 hover:bg-[#FCE7F3] hover:text-[#8B1E4D]"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 transition-all duration-300 ${
                        isActive ? "text-white" : "text-slate-400 group-hover:text-[#8B1E4D]"
                      }`}
                    />
                    <span>{item.name}</span>
                    {item.name === "Messages" && unreadMessageCount > 0 && (
                      <span className={`ml-auto inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-[#8B1E4D] text-white"}`}>
                        {unreadMessageCount > 99 ? "99+" : unreadMessageCount}
                      </span>
                    )}
                    {isActive && (
                      <span className={`${item.name === "Messages" && unreadMessageCount > 0 ? "ml-2" : "ml-auto"} h-2 w-2 rounded-full bg-white/60`} />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Divider & Logout */}
            <div className="mt-4 border-t border-[#F3E5E5] pt-4">
              <button
                type="button"
                onClick={handleLogout}
                className="group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-all duration-300 ease-in-out hover:translate-x-0.5 hover:bg-[#FCE7F3] hover:text-[#8B1E4D]"
              >
                <LogOut className="h-5 w-5 text-slate-400 transition-all duration-300 group-hover:text-[#8B1E4D]" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      <ConfirmModal
        isOpen={showLogoutModal}
        title="Logout"
        message="Are you sure you want to log out?"
        confirmLabel="Logout"
        cancelLabel="Cancel"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </div>
  );
}


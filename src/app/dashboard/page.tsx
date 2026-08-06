"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { authState, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isArtisan = authState?.role === "artisan";

  const handleLogout = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to log out?"
    );

    if (!confirmed) return;

    await logout();
    router.push("/");
  };

  // Customer Dashboard
  if (!isArtisan) {
    return (
      <main className="min-h-screen bg-[#FFF8F5] p-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow">
          <h1 className="text-3xl font-bold text-[#8B1E4D]">
            Customer Dashboard
          </h1>

          <p className="mt-3 text-gray-600">
            Welcome back to HunarConnect.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border p-6">
              <h2 className="text-lg font-semibold">Orders</h2>

              <p className="mt-2 text-gray-500">
                View your current and previous orders.
              </p>
            </div>

            <div className="rounded-2xl border p-6">
              <h2 className="text-lg font-semibold">Wishlist</h2>

              <p className="mt-2 text-gray-500">
                Save your favourite handmade products.
              </p>
            </div>

            <div className="rounded-2xl border p-6">
              <h2 className="text-lg font-semibold">Profile</h2>

              <p className="mt-2 text-gray-500">
                Manage your personal information.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Artisan Sidebar
  const menuItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "My Products",
      href: "/dashboard/products",
    },
    {
      title: "Orders",
      href: "/dashboard/orders",
    },
    {
      title: "Profile",
      href: "/profile",
    },
    {
      title: "Settings",
      href: "/settings",
    },
  ];

  return (
    <main className="min-h-screen bg-[#FFF8F5] p-8">
      <div className="mx-auto flex max-w-7xl gap-6">

        {/* Sidebar */}
        <aside className="w-64 rounded-3xl bg-white p-6 shadow">

          <h2 className="mb-8 text-2xl font-bold text-[#8B1E4D]">
            Artisan Dashboard
          </h2>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-xl px-4 py-3 transition ${
                  pathname === item.href
                    ? "bg-[#8B1E4D] text-white"
                    : "text-gray-700 hover:bg-[#FDF2F5]"
                }`}
              >
                {item.title}
              </Link>
            ))}

            <button
              type="button"
              onClick={handleLogout}
              className="mt-8 w-full rounded-xl border border-[#8B1E4D] py-3 text-[#8B1E4D] transition hover:bg-[#8B1E4D] hover:text-white"
            >
              Logout
            </button>
          </nav>
        </aside>

        {/* Content */}
        <section className="flex-1 rounded-3xl bg-white p-8 shadow">

          <h1 className="text-4xl font-bold text-[#8B1E4D]">
            Welcome Artisan 👋
          </h1>

          <p className="mt-3 text-gray-600">
            Manage your products and orders from one place.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl border p-6">
              <h3 className="text-xl font-semibold">
                Products
              </h3>

              <p className="mt-2 text-gray-500">
                Add and manage your handmade products.
              </p>
            </div>

            <div className="rounded-2xl border p-6">
              <h3 className="text-xl font-semibold">
                Orders
              </h3>

              <p className="mt-2 text-gray-500">
                View customer orders and update status.
              </p>
            </div>

            <div className="rounded-2xl border p-6">
              <h3 className="text-xl font-semibold">
                Analytics
              </h3>

              <p className="mt-2 text-gray-500">
                Monitor your sales and performance.
              </p>
            </div>

          </div>

        </section>

      </div>
    </main>
  );
}
"use client";

import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tag,
  Settings,
  BarChart3,
  Ticket,
  ChevronRight,
  LogOut,
  Store,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || "en";

  const adminNav = [
    { href: `/${locale}/admin`, label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: `/${locale}/admin/orders`, label: "Orders", icon: ShoppingBag, exact: false },
    { href: `/${locale}/admin/products`, label: "Products", icon: Package, exact: false },
    { href: `/${locale}/admin/categories`, label: "Categories & Brands", icon: Tag, exact: false },
    { href: `/${locale}/admin/promotions`, label: "Promotions", icon: Ticket, exact: false },
    { href: `/${locale}/admin/analytics`, label: "Analytics", icon: BarChart3, exact: false },
    { href: `/${locale}/admin/settings`, label: "Settings", icon: Settings, exact: false },
  ];

  const isActive = (item: (typeof adminNav)[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  const handleLogout = () => {
    // Clear the admin auth cookie
    document.cookie = "ADMIN_AUTH=; path=/; max-age=0";
    router.push(`/${locale}/admin-login`);
    router.refresh();
  };

  return (
    <div className="min-h-screen flex bg-[#F4F5F7]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-[#06091F] flex flex-col min-h-screen sticky top-0 h-screen">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="mt-1">
            <p className="text-[#F5D800] text-xs font-semibold uppercase tracking-widest mb-0.5">
              Admin Panel
            </p>
            <p
              className="text-white font-bold text-lg"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              GANDOUZ
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {adminNav.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  active
                    ? "bg-[#F5D800] text-[#06091F]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon
                  className={`w-4 h-4 shrink-0 ${
                    active ? "text-[#06091F]" : "text-white/40 group-hover:text-white/80"
                  }`}
                />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 text-[#06091F]/60" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            <Store className="w-4 h-4" />
            View Store
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <p className="text-white/20 text-xs px-3 pt-2">Distribution Gandouz © 2026</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

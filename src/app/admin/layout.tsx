"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Star,
  Menu,
  X,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const adminNav = [
    { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
    { href: "/admin/orders", label: "Commandes", icon: ShoppingBag, exact: false },
    { href: "/admin/products", label: "Produits", icon: Package, exact: false },
    { href: "/admin/categories", label: "Catégories & Marques", icon: Tag, exact: false },
    { href: "/admin/promotions", label: "Promotions", icon: Ticket, exact: false },
    { href: "/admin/analytics", label: "Analytiques", icon: BarChart3, exact: false },
    { href: "/admin/testimonials", label: "Témoignages", icon: Star, exact: false },
    { href: "/admin/settings", label: "Paramètres", icon: Settings, exact: false },
  ];

  const isActive = (item: (typeof adminNav)[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  const handleLogout = () => {
    document.cookie = "ADMIN_AUTH=; path=/; max-age=0";
    router.push("/admin-login");
    router.refresh();
  };

  const currentNav = adminNav.find(n => isActive(n)) || adminNav[0];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F4F5F7]">
      {/* Mobile Top Header */}
      <header className="lg:hidden bg-[#06091F] text-white px-4 py-3.5 flex items-center justify-between border-b border-white/10 sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#F5D800]"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <p className="text-[#F5D800] text-[10px] font-bold uppercase tracking-widest leading-tight">Admin</p>
            <p className="text-white font-extrabold text-base tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              GANDOUZ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/10 text-white/90 truncate max-w-[140px]">
            {currentNav.label}
          </span>
          <Link
            href="/"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-colors"
            title="Boutique"
          >
            <Store className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Mobile Drawer Backdrop & Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-xs bg-[#06091F] flex flex-col h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[#F5D800] text-xs font-bold uppercase tracking-widest mb-0.5">
                  Panneau Admin
                </p>
                <p
                  className="text-white font-extrabold text-xl"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  DISTRIBUTION GANDOUZ
                </p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {adminNav.map((item) => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all group ${
                      active
                        ? "bg-[#F5D800] text-[#06091F] shadow-sm"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <item.icon
                      className={`w-4.5 h-4.5 shrink-0 ${
                        active ? "text-[#06091F]" : "text-white/40 group-hover:text-white/80"
                      }`}
                    />
                    <span className="flex-1">{item.label}</span>
                    {active && <ChevronRight className="w-4 h-4 text-[#06091F]/70" />}
                  </Link>
                );
              })}
            </nav>

            {/* Footer actions */}
            <div className="px-3 py-4 border-t border-white/10 space-y-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
              >
                <Store className="w-4 h-4" />
                Voir la boutique
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
              <p className="text-white/30 text-[11px] px-3 pt-2">Distribution Gandouz © 2026</p>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-[#06091F] flex-col min-h-screen sticky top-0 h-screen print:hidden border-r border-white/10">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/10">
          <p className="text-[#F5D800] text-xs font-semibold uppercase tracking-widest mb-1">
            Panneau Admin
          </p>
          <p
            className="text-white font-extrabold text-2xl tracking-tight"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            GANDOUZ
          </p>
          <p className="text-white/40 text-[11px] mt-0.5">Vins, Champagnes & Spiritueux</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {adminNav.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                  active
                    ? "bg-[#F5D800] text-[#06091F] shadow-sm"
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
            href="/"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            <Store className="w-4 h-4" />
            Voir la boutique
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400/80 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
          <p className="text-white/20 text-xs px-3 pt-2">Distribution Gandouz © 2026</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}


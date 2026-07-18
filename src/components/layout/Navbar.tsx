"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingCart, Menu, X, Search, User } from "lucide-react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useCartStore } from "@/lib/store/cart";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import en from "@/dictionaries/en.json";
import fr from "@/dictionaries/fr.json";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loyaltyBalance, setLoyaltyBalance] = useState<number | null>(null);
  const totalItems = useCartStore((state) => state.totalItems());

  useEffect(() => { 
    setMounted(true);
    fetch("/api/me")
      .then(r => r.json())
      .then(data => {
        if (data?.user?.loyaltyAcc?.balance !== undefined) {
          setLoyaltyBalance(data.user.loyaltyAcc.balance);
        }
      })
      .catch(console.error);
  }, []);

  const currentLocale = pathname.startsWith("/fr") ? "fr" : "en";
  const dict = currentLocale === "fr" ? fr : en;

  const navLinks = [
    { href: `/${currentLocale}`, label: dict.nav.catalog || "Home" },
    { href: `/${currentLocale}/products`, label: "Products" }, // Custom text if needed
    { href: `/${currentLocale}/about`, label: dict.nav.about || "About" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full gandouz-gradient border-b border-white/10 shadow-xl">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${currentLocale}`} className="flex items-center gap-3 shrink-0" id="nav-logo">
          <Image
            src="/logo.png"
            alt="Distribution Gandouz"
            width={40}
            height={40}
            className="object-contain invert brightness-0"
          />
          <span
            className="text-white font-bold text-lg tracking-wide hidden sm:block"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}
          >
            GANDOUZ
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            // Strip locale to match active paths correctly
            const cleanPathname = pathname.replace(/^\/(en|fr)/, "") || "/";
            const cleanHref = link.href.replace(/^\/(en|fr)/, "") || "/";
            const isActive = cleanPathname === cleanHref || (cleanPathname.startsWith(cleanHref) && cleanHref !== "/");

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link text-sm font-medium text-white/80 hover:text-white ${
                  isActive ? "active text-white" : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {mounted && loyaltyBalance !== null && (
            <Link href={`/${currentLocale}/account`} className="hidden sm:flex items-center gap-1.5 bg-[#F5D800]/10 border border-[#F5D800]/30 px-3 py-1.5 rounded-full hover:bg-[#F5D800]/20 transition-colors">
              <span className="text-[#F5D800] text-xs font-bold">{loyaltyBalance} pts</span>
            </Link>
          )}

          <LanguageSwitcher />

          {/* Search Icon */}
          <Link
            href={`/${currentLocale}/products`}
            id="nav-search-btn"
            className="text-white/70 hover:text-[#F5D800] transition-colors p-1"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </Link>

          {/* Auth */}
          <div className="flex items-center text-white/70 hover:text-[#F5D800] transition-colors">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex items-center gap-2 p-1 text-sm font-medium">
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8 rounded-full border-2 border-white/20 hover:border-[#F5D800] transition-colors"
                  }
                }}
              />
            </SignedIn>
          </div>

          {/* Cart */}
          <Link
            href={`/${currentLocale}/cart`}
            id="nav-cart-btn"
            className="relative text-white/70 hover:text-white transition-colors p-1"
            aria-label={dict.nav.cart}
          >
            <ShoppingCart className="w-5 h-5" />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#F5D800] text-[#06091F] text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            id="nav-mobile-menu-btn"
            className="md:hidden text-white p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#1C2E5E] border-t border-white/10 px-4 pb-4 pt-2 flex flex-col gap-3">
          {mounted && loyaltyBalance !== null && (
            <Link href={`/${currentLocale}/account`} className="flex items-center gap-2 py-2 border-b border-white/10" onClick={() => setMobileOpen(false)}>
              <span className="text-[#F5D800] text-sm font-bold">Cadopoints: {loyaltyBalance} pts</span>
            </Link>
          )}
          {navLinks.map((link) => {
            const cleanPathname = pathname.replace(/^\/(en|fr)/, "") || "/";
            const cleanHref = link.href.replace(/^\/(en|fr)/, "") || "/";
            const isActive = cleanPathname === cleanHref || (cleanPathname.startsWith(cleanHref) && cleanHref !== "/");

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium py-2 border-b border-white/10 ${
                  isActive ? "text-[#F5D800]" : "text-white/80"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}

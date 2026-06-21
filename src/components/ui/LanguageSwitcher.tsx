"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  // Extract the current locale from the pathname
  const currentLocale = pathname.startsWith("/fr") ? "fr" : "en";

  const toggleLocale = () => {
    const newLocale = currentLocale === "en" ? "fr" : "en";
    
    // Replace the locale in the pathname
    let newPath = pathname;
    if (pathname.startsWith(`/${currentLocale}/`)) {
      newPath = pathname.replace(`/${currentLocale}/`, `/${newLocale}/`);
    } else if (pathname === `/${currentLocale}`) {
      newPath = `/${newLocale}`;
    } else {
      newPath = `/${newLocale}${pathname}`;
    }

    // Set cookie to remember preference
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    
    router.push(newPath);
    router.refresh(); // Refresh to trigger server components re-render with new locale
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-bold text-[#06091F] transition-colors uppercase tracking-wider"
      title="Switch Language"
    >
      <Globe className="w-3.5 h-3.5" />
      {currentLocale === "en" ? "FR" : "EN"}
    </button>
  );
}

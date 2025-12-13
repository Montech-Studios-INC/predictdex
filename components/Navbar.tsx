"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const links = [
  { href: "/markets", label: "Markets" },
  { href: "/country", label: "Countries" },
  { href: "/category/politics", label: "Categories" },
  { href: "/wallet", label: "Wallet", protected: true },
  { href: "/account", label: "Account", protected: true },
];

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const activeTheme = theme === "system" ? resolvedTheme : theme;
  const nextTheme = activeTheme === "dark" ? "light" : "dark";

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(nextTheme)}
      className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
    >
      {activeTheme === "dark" ? "Light" : "Dark"}
    </button>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const resetOverflow = () => {
      document.body.style.overflow = "";
    };

    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("beforeunload", resetOverflow);
    } else {
      resetOverflow();
    }
    
    return () => {
      resetOverflow();
      window.removeEventListener("beforeunload", resetOverflow);
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    router.push("/");
  };

  const visibleLinks = links.filter(
    (link) => !link.protected || isAuthenticated
  );

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur shadow-sm dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-12">
        <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 flex-shrink-0">
          <Image src="/africapredicts/logo-africapredicts.svg" alt="AfricaPredicts" width={40} height={40} />
          <p className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white hidden sm:block">AfricaPredicts</p>
        </Link>

        <nav className="hidden items-center gap-4 xl:gap-6 text-sm uppercase tracking-[0.15em] xl:tracking-[0.25em] lg:flex ml-8">
          {visibleLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2 py-1 ${
                  isActive
                    ? "text-orange-600 dark:text-orange-300"
                    : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                } transition-colors`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {user?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="uppercase tracking-widest text-[11px] font-semibold px-3 py-1.5 rounded-full border border-orange-400/50 bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-500/10 dark:text-orange-300 dark:hover:bg-orange-500/20 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <span className="text-xs text-neutral-500 dark:text-neutral-400 hidden md:inline">
                  {user?.email || user?.walletAddress?.slice(0, 8) + "..."}
                </span>
                <button
                  onClick={handleLogout}
                  className="uppercase tracking-widest text-[11px] font-semibold px-4 py-2 rounded-full border border-neutral-200 bg-white hover:bg-red-50 hover:border-red-300 transition-colors text-neutral-600 hover:text-red-600 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-red-500/10 dark:text-neutral-300 dark:hover:text-red-400"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="uppercase tracking-widest text-[11px] font-semibold px-4 py-2 rounded-full border border-orange-400/50 bg-orange-50 hover:bg-orange-100 transition-colors text-orange-600 dark:bg-orange-500/10 dark:text-orange-300 dark:hover:bg-orange-500/20"
              >
                Sign In
              </Link>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-neutral-600 dark:bg-neutral-300 transition-transform duration-200 ${mobileMenuOpen ? "rotate-45 translate-y-1" : ""}`} />
            <span className={`block w-5 h-0.5 bg-neutral-600 dark:bg-neutral-300 mt-1 transition-opacity duration-200 ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-neutral-600 dark:bg-neutral-300 mt-1 transition-transform duration-200 ${mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[65px] z-40 bg-white/98 dark:bg-neutral-950/98 backdrop-blur-lg overflow-y-auto">
          <div className="px-4 py-6">
            <nav className="space-y-1">
              {visibleLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-4 text-base uppercase tracking-[0.2em] border-b border-neutral-100 dark:border-neutral-800 ${
                      isActive ? "text-orange-600 bg-orange-50 dark:text-orange-300 dark:bg-orange-500/10" : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800"
                    } transition-colors`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 space-y-4">
              {isAuthenticated ? (
                <>
                  {user?.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center uppercase tracking-widest text-sm font-semibold px-4 py-4 rounded-full border border-orange-400/50 bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-500/10 dark:text-orange-300 dark:hover:bg-orange-500/20 transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">Signed in as</p>
                    <p className="mt-1 text-sm text-neutral-900 dark:text-white truncate">
                      {user?.email || user?.walletAddress || "Unknown"}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full uppercase tracking-widest text-sm font-semibold px-4 py-4 rounded-full border border-red-300 bg-red-50 hover:bg-red-100 transition-colors text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center uppercase tracking-widest text-sm font-semibold px-4 py-4 rounded-full border border-orange-400/50 bg-orange-50 hover:bg-orange-100 transition-colors text-orange-600 dark:bg-orange-500/10 dark:text-orange-300 dark:hover:bg-orange-500/20"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

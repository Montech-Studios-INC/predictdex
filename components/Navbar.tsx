"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useEffect, useState } from "react";

const links = [
  { href: "/markets", label: "Markets" },
  { href: "/country", label: "Countries" },
  { href: "/category/politics", label: "Categories" },
  { href: "/wallet", label: "Wallet", protected: true },
  { href: "/account", label: "Account", protected: true },
];

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
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
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
    <header className="sticky top-0 z-50 bg-night/95 backdrop-blur border-b border-white/5">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5 lg:px-12">
        <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
          <div className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center border border-royal/70 bg-royal/10 text-gold font-bold text-base sm:text-lg tracking-tight">
            AP
          </div>
          <div>
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-mist">Africa</p>
            <p className="text-base sm:text-lg font-semibold text-white">Predicts</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm uppercase tracking-[0.25em] lg:flex">
          {visibleLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2 py-1 ${
                  isActive ? "text-gold" : "text-mist hover:text-white"
                } transition-colors`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {user?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="uppercase tracking-widest text-[11px] font-semibold px-3 py-1.5 border border-gold/50 bg-gold/10 text-gold hover:bg-gold/20 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <span className="text-xs text-mist uppercase tracking-widest hidden md:inline">
                  {user?.email || user?.walletAddress?.slice(0, 8) + "..."}
                </span>
                <button
                  onClick={handleLogout}
                  className="uppercase tracking-widest text-[11px] font-semibold px-4 py-2 border border-white/20 bg-white/5 hover:bg-red-500/20 hover:border-red-500/50 transition-colors text-mist hover:text-white"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="uppercase tracking-widest text-[11px] font-semibold px-4 py-2 border border-royal/50 bg-royal/10 hover:bg-royal/20 transition-colors text-gold"
              >
                Sign In
              </Link>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-white transition-transform duration-200 ${mobileMenuOpen ? "rotate-45 translate-y-1" : ""}`} />
            <span className={`block w-5 h-0.5 bg-white mt-1 transition-opacity duration-200 ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-white mt-1 transition-transform duration-200 ${mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[57px] sm:top-[69px] z-40 bg-night/98 backdrop-blur-lg overflow-y-auto">
          <div className="px-4 py-6">
            <nav className="space-y-1">
              {visibleLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-4 text-base uppercase tracking-[0.2em] border-b border-white/5 ${
                      isActive ? "text-gold bg-gold/5" : "text-mist hover:text-white hover:bg-white/5"
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
                      className="block w-full text-center uppercase tracking-widest text-sm font-semibold px-4 py-4 border border-gold/50 bg-gold/10 text-gold hover:bg-gold/20 transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <div className="px-4 py-3 bg-white/5 border border-white/10">
                    <p className="text-xs text-mist uppercase tracking-widest">Signed in as</p>
                    <p className="mt-1 text-sm text-white truncate">
                      {user?.email || user?.walletAddress || "Unknown"}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full uppercase tracking-widest text-sm font-semibold px-4 py-4 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-400"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center uppercase tracking-widest text-sm font-semibold px-4 py-4 border border-royal/50 bg-royal/10 hover:bg-royal/20 transition-colors text-gold"
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

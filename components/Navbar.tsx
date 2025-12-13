"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ConnectWalletButton from "./ConnectWalletButton";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const links = [
  { href: "/markets", label: "Markets" },
  { href: "/country/nigeria", label: "Countries" },
  { href: "/category/politics", label: "Categories" },
  { href: "/wallet", label: "Wallet" },
  { href: "/account", label: "Account" },
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
      {activeTheme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur shadow-sm dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-12">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/africapredicts/logo-africapredicts.svg" alt="AfricaPredicts" width={40} height={40} />
          <p className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">AfricaPredicts</p>
        </Link>

        <nav className="hidden items-center gap-6 text-sm uppercase tracking-[0.25em] lg:flex">
          {links.map((link) => {
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
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  );
}

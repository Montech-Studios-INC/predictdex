import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastContainer from "@/components/Toast";
import { ThemeProviders } from "./theme-provider";

export const metadata: Metadata = {
  title: "AfricaPredicts — Pan-African Prediction DEX",
  description:
    "AfricaPredicts is the futuristic prediction market for politics, business, entertainment, and sports across the continent.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-night text-white font-inter">
        <ThemeProviders>
          <Providers>
            <div className="min-h-screen flex flex-col bg-african-grid bg-pattern dark:bg-night">
              <Navbar />
              <main className="flex-1 px-4 py-6 sm:px-6 sm:py-10 lg:px-16">{children}</main>
              <Footer />
            </div>
            <ToastContainer />
          </Providers>
        </ThemeProviders>
      </body>
    </html>
  );
}

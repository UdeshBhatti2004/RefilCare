import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ClientProvider from "@/ClientProvider";
import LayoutClient from "@/components/LayoutClient";
import { Plus_Jakarta_Sans, Geist } from "next/font/google";

// 1. Setup Plus Jakarta Sans for Headers
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

// 2. Setup Geist for Body/UI
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "RefillCare | Clinical Portal",
  description: "Advanced Medication Synchronization System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${geist.variable}`}>
      <body
        /** * 1. Added ${geist.className} to apply the font globally.
         * 2. Kept your bg-[#E9EEF2] for that professional clinical look.
         */
        className={`${geist.className} antialiased bg-[#E9EEF2] text-slate-900`}
      >
        <ClientProvider>
          <LayoutClient>
            {/* The main content area where your cards will 'pop' */}
            <div className="pt-20 min-h-screen">{children}</div>
          </LayoutClient>
          <Toaster position="top-right" />
        </ClientProvider>
      </body>
    </html>
  );
}

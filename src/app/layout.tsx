import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ClientProvider from "@/ClientProvider";
import LayoutClient from "@/components/LayoutClient";
import { Plus_Jakarta_Sans, Geist } from "next/font/google";
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});
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
        
        className={`${geist.className} antialiased bg-[#E9EEF2] text-slate-900`}
      >
        <ClientProvider>
          <LayoutClient>
            
            <div className="min-h-screen">{children}</div>
          </LayoutClient>
          <Toaster position="top-right" />
        </ClientProvider>
      </body>
    </html>
  );
}

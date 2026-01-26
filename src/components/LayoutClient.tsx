"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Footer from "./Footer";

const Sidebar = dynamic(() => import("./Sidebar"), { ssr: false });

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideLayout =
    pathname === "/login" || pathname === "/register";

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
      {!hideLayout && <Sidebar />}

      {/* Restructured main:
          1. flex-col and min-h-screen ensures footer stays at the bottom.
          2. Removed p-6 lg:p-10 from here so the Footer can be full-width.
      */}
      <main className="flex-1 flex flex-col min-h-screen w-full">
        <div className={`flex-1 ${!hideLayout ? "p-6 lg:p-10" : ""}`}>
          {children}
        </div>
        
        {!hideLayout && <Footer />}
      </main>
    </div>
  );
}
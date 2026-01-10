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
    <div className="flex min-h-screen bg-slate-50">
      {!hideLayout && <Sidebar />}

      <main className="flex-1 p-6 lg:p-10">
        {children}
        {!hideLayout && <Footer />}
      </main>
    </div>
  );
}

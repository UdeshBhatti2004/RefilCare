"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Pill,
  LogOut,
  Menu,
  X,
  Plus,
  Settings,
  Bell,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Medicines", href: "/medicines", icon: Pill },
];

export default function Sidebar() {
  const { status, data: session } = useSession();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* TOP BAR (ALL SCREENS) */}
      <div className="fixed top-0 left-0 right-0 h-16 lg:h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 z-40 flex items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 lg:h-11 lg:w-11 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Plus className="text-white" size={20} strokeWidth={3} />
          </div>
          <span className="font-bold text-slate-900 tracking-tight text-lg lg:text-xl">
            MedRefill
          </span>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="p-2 lg:p-3 hover:bg-slate-100 rounded-full transition-colors"
        >
          <Menu size={24} className="text-slate-600" />
        </button>
      </div>

      {/* OVERLAY */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR (DRAWER STYLE) */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="
              fixed top-0 left-0 z-50
              h-screen w-72
              bg-[#F8FAFC] border-r border-slate-100
              flex flex-col
              shadow-2xl
            "
          >
            {/* BRANDING HEADER */}
            <div className="h-20 px-8 flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-3 group">
                <div className="h-10 w-10 bg-blue-600 rounded-[14px] flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform duration-300">
                  <Plus className="text-white" size={22} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-slate-900 leading-none">
                    MedRefill
                  </span>
                  <span className="text-[10px] font-bold text-blue-600 tracking-[0.2em] uppercase mt-1">
                    Provider
                  </span>
                </div>
              </Link>

              <button
                className="text-slate-400 hover:text-slate-600"
                onClick={() => setOpen(false)}
              >
                <X size={22} />
              </button>
            </div>

            {/* NAVIGATION */}
            <div className="flex-1 px-4 py-6">
              <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">
                Main Menu
              </p>

              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`
                        relative group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                        ${
                          isActive
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                            : "text-slate-600 hover:bg-white hover:shadow-sm hover:text-blue-600 border border-transparent hover:border-slate-100"
                        }
                      `}
                    >
                      <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                      <span className="text-[15px]">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-10">
                <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">
                  Support
                </p>

                <div className="space-y-1.5 font-medium">
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-white hover:text-blue-600 rounded-xl transition-all border border-transparent hover:border-slate-100"
                  >
                    <Settings size={20} />
                    <span>Settings</span>
                  </Link>

                  <Link
                    href="/alerts"
                    className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-white hover:text-blue-600 rounded-xl transition-all border border-transparent hover:border-slate-100"
                  >
                    <Bell size={20} />
                    <span>Notifications</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="p-4 border-t border-slate-50 bg-slate-50/50">
              {status === "authenticated" && (
                <button
                  onClick={() =>
                    signOut({ redirect: true, callbackUrl: "/login" })
                  }
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 font-bold text-sm hover:bg-red-50 transition-all active:scale-95"
                >
                  <LogOut size={18} strokeWidth={2.5} />
                  Sign out
                </button>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

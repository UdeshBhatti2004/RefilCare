"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import {
  setUnreadCount,
  acknowledgeNotifications,
} from "@/redux/slices/notificationsSlices";
import { useGetNotificationsQuery } from "@/redux/api/notificationsApi";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Patients", href: "/patient", icon: Users },
  { name: "Medicines", href: "/medicine", icon: Pill },
];

export default function Sidebar() {
  const { status } = useSession();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const { unreadCount, acknowledgedCount } = useSelector(
    (state: RootState) => state.notification
  );

  const { data: notifications = [] } = useGetNotificationsQuery();

  useEffect(() => {
    if (pathname === "/notifications") {
      dispatch(acknowledgeNotifications());
    }
  }, [pathname, dispatch]);

  useEffect(() => {
    if (pathname === "/notifications") return;
    const unread = notifications.filter((n: any) => !n.isRead).length;
    if (unread !== unreadCount) {
      dispatch(setUnreadCount(unread));
    }
  }, [notifications, unreadCount, pathname, dispatch]);

  return (
    <>
      
      <div className="fixed top-0 left-0 right-0 z-40 h-16 lg:h-20 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm flex items-center justify-between px-5 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 lg:h-11 lg:w-11 bg-[#009688] rounded-xl flex items-center justify-center shadow-md shadow-teal-100">
            <Plus className="text-white" size={20} strokeWidth={3} />
          </div>
          <span className="font-black text-slate-900 tracking-tighter text-lg lg:text-xl uppercase">
            RefillCare
          </span>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="p-2.5 lg:p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors"
        >
          <Menu size={24} className="text-slate-700" />
        </button>
      </div>

      
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed top-0 left-0 z-[60] h-screen w-[18rem] sm:w-[20rem] bg-[#F8FAFC] border-r border-slate-200 flex flex-col shadow-2xl"
          >
            
            <div className="h-20 px-8 flex items-center justify-between border-b border-slate-100">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3"
              >
                <div className="h-10 w-10 bg-[#009688] rounded-[14px] flex items-center justify-center">
                  <Plus className="text-white" size={22} strokeWidth={3} />
                </div>
                <div>
                  <div className="text-lg font-black tracking-tighter uppercase leading-none">RefillCare</div>
                  <div className="text-[9px] font-black text-[#009688] tracking-[0.18em] uppercase mt-1">
                    Clinical Portal
                  </div>
                </div>
              </Link>

              <button 
                onClick={() => setOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            
            <div className="flex-1 px-4 py-6 overflow-y-auto">
              <p className="px-4 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Navigation</p>
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                        isActive
                          ? "bg-white border border-slate-200 shadow-sm text-[#009688]"
                          : "text-slate-500 hover:bg-white hover:text-slate-900"
                      }`}
                    >
                      <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                      <span className={`text-sm font-bold ${isActive ? "text-slate-900" : ""}`}>
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </nav>

              <p className="px-4 mt-10 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Preferences</p>
              <div className="space-y-1.5">
                <Link
                  href="/settings"
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                    pathname === "/settings" 
                    ? "bg-white border border-slate-200 text-[#009688]" 
                    : "text-slate-500 hover:bg-white"
                  }`}
                >
                  <Settings size={18} />
                  Settings
                </Link>

                <Link
                  href="/notifications"
                  onClick={() => {
                    dispatch(acknowledgeNotifications());
                    setOpen(false);
                  }}
                  className={`relative flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                    pathname === "/notifications" 
                    ? "bg-white border border-slate-200 text-[#009688]" 
                    : "text-slate-500 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Bell size={18} />
                    Notifications
                  </div>

                  {unreadCount > acknowledgedCount && (
                    <span className="min-w-[18px] h-[18px] px-1 text-[10px] font-black rounded-full bg-rose-600 text-white flex items-center justify-center animate-pulse">
                      {unreadCount - acknowledgedCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            
            <div className="p-4 border-t border-slate-100">
              {status === "authenticated" && (
                <button
                  onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
                  className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-slate-900 text-white rounded-[1.5rem] hover:bg-rose-600 transition-all duration-300"
                >
                  <LogOut size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Sign Out</span>
                </button>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
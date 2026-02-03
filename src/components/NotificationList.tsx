"use client";

import NotificationItem from "./NotificationItem";
import { useGetNotificationsQuery } from "@/redux/api/notificationsApi";
import { Bell, CheckCircle2, Inbox } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Notification = {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: "missed" | "upcoming";
};

export default function NotificationsList() {
  const { data: notifications = [], isLoading } = useGetNotificationsQuery();

  if (isLoading) {
    return (
      <div className="space-y-3 p-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 w-full rounded-[1.5rem] bg-slate-100 animate-pulse border border-slate-200/50"
          />
        ))}
      </div>
    );
  }

  if (!notifications.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 px-6 text-center"
      >
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
          <CheckCircle2 className="text-[#009688] opacity-20" size={32} />
        </div>
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Queue Status: Clear</h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 opacity-60">
          You’re all caught up 🎉
        </p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      
      <div className="flex items-center gap-2 mb-6 px-1 shrink-0">
        <div className="p-1.5 bg-[#009688]/10 rounded-lg text-[#009688]">
          <Bell size={14} />
        </div>
        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
          System Alerts ({notifications.length})
        </span>
        <div className="h-px flex-1 bg-slate-100" />
      </div>

      
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
        <AnimatePresence mode="popLayout">
          {notifications.map((n: Notification, idx: number) => (
            <motion.div
              key={n._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <NotificationItem notification={n} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      
      <div className="mt-4 pt-4 border-t border-slate-50 shrink-0">
        <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] text-center">
          End of notification stream
        </p>
      </div>
    </div>
  );
}
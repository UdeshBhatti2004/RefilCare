"use client";

import {
  Clock,
  AlertCircle,
  CalendarClock,
  CheckCircle,
} from "lucide-react";
import {
  useMarkNotificationReadMutation,
} from "@/redux/api/notificationsApi";

interface NotificationProps {
  notification: {
    _id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    type: "missed" | "upcoming";
  };
}

export default function NotificationItem({
  notification,
}: NotificationProps) {
  const [markRead, { isLoading }] = useMarkNotificationReadMutation();

  async function handleMarkRead() {
    if (!notification.isRead) {
      await markRead(notification._id);
    }
  }

  const isMissed = notification.type === "missed";

  return (
    <div
      className={`relative overflow-hidden border transition-all duration-300 rounded-[1.8rem] ${
        notification.isRead
          ? "bg-slate-50/50 border-slate-100 opacity-80"
          : "bg-white border-slate-200 shadow-sm"
      }`}
    >
     
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 transition-colors ${
          notification.isRead
            ? "bg-slate-200"
            : isMissed
            ? "bg-rose-500"
            : "bg-[#009688]"
        }`}
      />

      <div className="flex items-start justify-between gap-4 p-5 sm:p-6">
        <div className="flex gap-4 min-w-0 flex-1">
        
          <div
            className={`mt-0.5 p-2.5 rounded-xl shrink-0 ${
              notification.isRead
                ? "bg-slate-100 text-slate-400"
                : isMissed
                ? "bg-rose-50 text-rose-600"
                : "bg-teal-50 text-[#009688]"
            }`}
          >
            {isMissed ? (
              <AlertCircle size={20} />
            ) : (
              <CalendarClock size={20} />
            )}
          </div>

       
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3
                className={`font-black uppercase tracking-tight text-[11px] sm:text-[12px] truncate ${
                  notification.isRead
                    ? "text-slate-500"
                    : "text-slate-900"
                }`}
              >
                {notification.title}
              </h3>

              {!notification.isRead && (
                <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-pulse shrink-0" />
              )}
            </div>

            <p className="text-[11px] sm:text-[12px] font-medium text-slate-500 mt-1 leading-relaxed">
              {notification.message}
            </p>

            <div className="flex items-center justify-between mt-4">
           
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  {new Date(notification.createdAt).toLocaleString(
                    undefined,
                    {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </span>
              </div>

             
              {notification.isRead ? (
                <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-lg">
                  <CheckCircle
                    size={10}
                    className="text-slate-400"
                  />
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                    Logged
                  </span>
                </div>
              ) : (
                <button
                  onClick={handleMarkRead}
                  disabled={isLoading}
                  className="text-[9px] font-black uppercase tracking-widest text-[#009688] hover:underline disabled:opacity-50"
                >
                  {isLoading ? "Marking..." : "Mark as Read"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

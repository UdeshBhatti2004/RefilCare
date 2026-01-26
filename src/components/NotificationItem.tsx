"use client";

import { Clock, AlertCircle, CalendarClock, CheckCircle } from "lucide-react";

// Explicitly define the notification shape to match the list
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

export default function NotificationItem({ notification }: NotificationProps) {
  async function markAsRead() {
    if (notification.isRead) return;

    try {
      await fetch(`/api/notifications/${notification._id}/read`, {
        method: "PATCH",
      });
    } catch (error) {
      console.error("Failed to update status", error);
    }
  }

  const isMissed = notification.type === "missed";
  
  return (
    <div
      onClick={markAsRead}
      className={`group relative overflow-hidden border rounded-[1.8rem] p-5 cursor-pointer transition-all duration-300 active:scale-[0.98] ${
        notification.isRead
          ? "bg-slate-50/50 border-slate-100 opacity-70"
          : "bg-white border-slate-200 shadow-sm hover:border-[#009688]/40 hover:shadow-md"
      }`}
    >
      {/* Indicator Strip */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors ${
        notification.isRead 
          ? "bg-slate-200" 
          : isMissed ? "bg-rose-500" : "bg-[#009688]"
      }`} />

      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4 min-w-0">
          {/* Icon Section */}
          <div className={`mt-1 p-2 rounded-xl shrink-0 transition-colors ${
            notification.isRead 
              ? "bg-slate-100 text-slate-400" 
              : isMissed ? "bg-rose-50 text-rose-600" : "bg-teal-50 text-[#009688]"
          }`}>
            {isMissed ? <AlertCircle size={18} /> : <CalendarClock size={18} />}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={`font-black uppercase tracking-tight text-[11px] truncate ${
                notification.isRead ? "text-slate-500" : "text-slate-900"
              }`}>
                {notification.title}
              </h3>
              {!notification.isRead && (
                <span className="flex h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse shrink-0" />
              )}
            </div>

            <p className="text-[11px] font-medium text-slate-500 mt-1 leading-relaxed line-clamp-2">
              {notification.message}
            </p>

            <div className="flex items-center gap-2 mt-3 text-slate-400">
              <Clock size={10} />
              <span className="text-[9px] font-black uppercase tracking-widest">
                {new Date(notification.createdAt).toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>

        {notification.isRead && (
          <div className="shrink-0 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-lg self-start">
            <CheckCircle size={10} className="text-slate-400" />
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Read</span>
          </div>
        )}
      </div>
    </div>
  );
}
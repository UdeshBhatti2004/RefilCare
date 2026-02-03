"use client";

import { Clock, AlertCircle, CalendarClock, CheckCircle, Trash2 } from "lucide-react";

interface NotificationProps {
  notification: {
    _id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    type: "missed" | "upcoming";
  };
  onDelete?: (id: string) => void;
}

export default function NotificationItem({ notification, onDelete }: NotificationProps) {
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

  async function deleteNotification(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await fetch(`/api/notifications/${notification._id}`, {
        method: "DELETE",
      });
      if (onDelete) onDelete(notification._id);
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  }

  const isMissed = notification.type === "missed";

  return (
    <div
      onClick={markAsRead}
      className={`group relative overflow-hidden border transition-all duration-300 active:scale-[0.99] rounded-[1.8rem] ${
        notification.isRead
          ? "bg-slate-50/50 border-slate-100 opacity-80"
          : "bg-white border-slate-200 shadow-sm hover:border-[#009688]/40 hover:shadow-md"
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
            className={`mt-0.5 p-2.5 rounded-xl shrink-0 transition-colors ${
              notification.isRead
                ? "bg-slate-100 text-slate-400"
                : isMissed
                ? "bg-rose-50 text-rose-600"
                : "bg-teal-50 text-[#009688]"
            }`}
          >
            {isMissed ? <AlertCircle size={20} /> : <CalendarClock size={20} />}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3
                className={`font-black uppercase tracking-tight text-[11px] sm:text-[12px] truncate ${
                  notification.isRead ? "text-slate-500" : "text-slate-900"
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

            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  {new Date(notification.createdAt).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {notification.isRead && (
                <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-lg">
                  <CheckCircle size={10} className="text-slate-400" />
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                    Logged
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={deleteNotification}
          className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
          title="Clear Notification"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
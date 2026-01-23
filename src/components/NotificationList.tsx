"use client";

import { useEffect, useState } from "react";
import NotificationItem from "./NotificationItem";

type Notification = {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: "missed" | "upcoming";
};

export default function NotificationsList() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAndClear() {
      try {
        const res = await fetch("/api/notifications");
        const text = await res.text();
        const data: Notification[] = text ? JSON.parse(text) : [];

        setItems(data);

        // 🔔 AUTO-CLEAR: mark unread as read
        const unread = data.filter((n) => !n.isRead);

        if (unread.length > 0) {
          await Promise.all(
            unread.map((n) =>
              fetch(`/api/notifications/${n._id}/read`, {
                method: "PATCH",
              })
            )
          );

          // Update UI immediately
          setItems((prev) =>
            prev.map((n) => ({ ...n, isRead: true }))
          );
        }
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    loadAndClear();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 rounded-md bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <p className="text-sm text-muted-foreground">
        You’re all caught up 🎉
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((n) => (
        <NotificationItem key={n._id} notification={n} />
      ))}
    </div>
  );
}

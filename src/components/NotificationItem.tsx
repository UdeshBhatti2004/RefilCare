"use client";

type Props = {
  notification: {
    _id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    type: "missed" | "upcoming";
  };
};

export default function NotificationItem({ notification }: Props) {
  async function markAsRead() {
    if (notification.isRead) return;

    await fetch(`/api/notifications/${notification._id}/read`, {
      method: "PATCH",
    });
  }

  return (
    <div
      onClick={markAsRead}
      className={`border rounded-md p-4 cursor-pointer transition ${
        notification.isRead
          ? "bg-muted/40"
          : "bg-background border-primary/40"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{notification.title}</h3>
        {!notification.isRead && (
          <span className="h-2 w-2 rounded-full bg-primary" />
        )}
      </div>

      <p className="text-sm text-muted-foreground mt-1">
        {notification.message}
      </p>

      <p className="text-xs text-muted-foreground mt-2">
        {new Date(notification.createdAt).toLocaleString()}
      </p>
    </div>
  );
}

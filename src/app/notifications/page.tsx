import NotificationsList from "@/components/NotificationList";

export default function NotificationsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
      <NotificationsList />
    </div>
  );
}

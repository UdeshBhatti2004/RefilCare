"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { CalendarCheck, Clock, AlertTriangle } from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [todayCount, setTodayCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [missedCount, setMissedCount] = useState(0);
  const [activity, setActivity] = useState<any[]>([]);
  const [cronLoading, setCronLoading] = useState(false);

  useEffect(() => {
    if (!session) return;

    api.get("/dashboard/summary")
      .then((res) => {
        setTodayCount(res.data.today);
        setUpcomingCount(res.data.upcoming);
        setMissedCount(res.data.missed);
      })
      .catch(() => {});

    api.get("/dashboard/activity")
      .then((res) => setActivity(res.data))
      .catch(() => {});
  }, [session]);

  async function runCron() {
    try {
      setCronLoading(true);

      const res = await fetch("/api/cron/mark-missed");
      const data = await res.json();

      alert(
  `Cron executed successfully ✅\n\n` +
  `🩺 Medicines marked missed: ${data.medicinesMarkedMissed}\n` +
  `🔔 Notifications created: ${data.notificationsCreated}`
);


      // reload dashboard data
      const summary = await api.get("/dashboard/summary");
      setTodayCount(summary.data.today);
      setUpcomingCount(summary.data.upcoming);
      setMissedCount(summary.data.missed);

    } catch {
      alert("Cron execution failed");
    } finally {
      setCronLoading(false);
    }
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 bg-slate-50 min-h-screen">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Overview of refills and reminders
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* Today */}
        <div
          onClick={() => router.push("/medicine?filter=today")}
          className="cursor-pointer bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Today’s Refills
              </p>
              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                {todayCount}
              </h2>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <CalendarCheck className="text-blue-600" size={22} />
            </div>
          </div>
        </div>

        {/* Upcoming */}
        <div
          onClick={() => router.push("/medicine?filter=upcoming")}
          className="cursor-pointer bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Upcoming Refills
              </p>
              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                {upcomingCount}
              </h2>
            </div>
            <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Clock className="text-indigo-600" size={22} />
            </div>
          </div>
        </div>

        {/* Missed */}
        <div
          onClick={() => router.push("/medicine?filter=missed")}
          className="cursor-pointer bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Missed Refills
              </p>
              <h2 className="text-3xl font-bold text-red-600 mt-2">
                {missedCount}
              </h2>
            </div>
            <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="text-red-600" size={22} />
            </div>
          </div>
        </div>

      </div>

      {/* 🔧 DEV ONLY: Cron Trigger */}
      {process.env.NODE_ENV === "development" && (
        <div className="bg-white border border-dashed border-red-200 rounded-2xl p-6">
          <h3 className="font-semibold text-red-600 mb-2">
            Developer Tools
          </h3>
          <button
            onClick={runCron}
            disabled={cronLoading}
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50"
          >
            {cronLoading ? "Running Cron..." : "Run Missed Refill Cron"}
          </button>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Recent Refill Activity
        </h3>

        {activity.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-6">
            No recent refill activity
          </p>
        ) : (
          <ul className="space-y-4">
            {activity.map((log) => (
              <li
                key={log._id}
                className="flex items-start justify-between border-b last:border-none pb-4"
              >
                <div>
                  <p className="text-slate-900 font-medium">
                    {log.patientId?.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {log.medicineId?.medicineName}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-slate-600">
                    {new Date(log.refillDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-slate-400">
                    {log.tabletsGiven} tablets
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}

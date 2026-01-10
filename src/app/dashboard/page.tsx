"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import {
  CalendarCheck,
  Clock,
  AlertTriangle,
} from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  console.log(session)

  const [todayCount, setTodayCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [missedCount, setMissedCount] = useState(0);

  useEffect(() => {
    if (!session?.user?.pharmacyId) return;

    const payload = {
      pharmacyId: session.user.pharmacyId,
    };
    console.log(payload)

    api.post("/dashboard/today", payload)
      .then((res) => setTodayCount(res.data.length))
      .catch(() => {});

    api.post("/dashboard/upcoming", payload)
      .then((res) => setUpcomingCount(res.data.length))
      .catch(() => {});

    api.post("/dashboard/missed", payload)
      .then((res) => setMissedCount(res.data.length))
      .catch(() => {});
  }, [session]);

  return (
    <div className="p-6 lg:p-10 space-y-8 bg-slate-50 min-h-screen">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Overview of refills and reminders
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Today */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
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
          <p className="text-sm text-slate-500 mt-4">
            Patients scheduled for refill today
          </p>
        </div>

        {/* Upcoming */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
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
          <p className="text-sm text-slate-500 mt-4">
            Scheduled in the next few days
          </p>
        </div>

        {/* Missed */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
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
          <p className="text-sm text-slate-500 mt-4">
            Patients who missed refill dates
          </p>
        </div>

      </div>

      {/* Placeholder section */}
      <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-400">
        Refill timeline / recent activity will appear here
      </div>

    </div>
  );
}

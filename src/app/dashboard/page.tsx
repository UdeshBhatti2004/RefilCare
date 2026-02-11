"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import {
  CalendarCheck,
  Clock,
  AlertTriangle,
  Activity,
  ChevronRight,
  ShieldCheck,
  Pill,
} from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [todayCount, setTodayCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [missedCount, setMissedCount] = useState(0);
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
    if (!session) return;

    api
      .get("/dashboard/summary")
      .then((res) => {
        setTodayCount(res.data.today);
        setUpcomingCount(res.data.upcoming);
        setMissedCount(res.data.missed);
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
      });

    api
      .get("/dashboard/activity")
      .then((res) => {
        setActivity(res.data);
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
      });
  }, [session]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 lg:py-12 font-sans text-slate-900">
      <div className="max-w-[1400px] mx-auto space-y-8 sm:space-y-10">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-[#009688] rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                System Live
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter uppercase">
              Clinical Dashboard
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
              Real-time medication refill synchronization
            </p>
          </motion.div>

          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-sm w-fit">
            <ShieldCheck size={16} className="text-[#009688]" />
            <span className="text-[10px] sm:text-[11px] font-black text-slate-600 uppercase tracking-tight">
              Verified Practitioner
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              label: "Today's Refills",
              count: todayCount,
              icon: CalendarCheck,
              color: "text-blue-600",
              bg: "bg-blue-50",
              border: "hover:border-blue-300",
              route: "today",
            },
            {
              label: "Upcoming Queue",
              count: upcomingCount,
              icon: Clock,
              color: "text-indigo-600",
              bg: "bg-indigo-50",
              border: "hover:border-indigo-300",
              route: "upcoming",
            },
            {
              label: "Missed Cycles",
              count: missedCount,
              icon: AlertTriangle,
              color: "text-rose-600",
              bg: "bg-rose-50",
              border: "hover:border-rose-300",
              route: "missed",
            },
          ].map((card, idx) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => router.push(`/medicine?filter=${card.route}`)}
              className={`group cursor-pointer bg-white border border-slate-200 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 ${card.border}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    {card.label}
                  </p>
                  <h2
                    className={`text-3xl sm:text-4xl font-black tracking-tighter ${
                      card.color === "text-rose-600"
                        ? "text-rose-600"
                        : "text-slate-900"
                    }`}
                  >
                    {card.count}
                  </h2>
                </div>
                <div
                  className={`h-12 w-12 sm:h-14 sm:w-14 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center transition-transform group-hover:scale-110`}
                >
                  <card.icon
                    size={22}
                    className="sm:w-[26px] sm:h-[26px]"
                    strokeWidth={2.5}
                  />
                </div>
              </div>
              <div className="mt-4 sm:mt-6 flex items-center gap-1 text-[#009688] font-bold text-[9px] sm:text-[10px] uppercase tracking-tighter">
                View Registry <ChevronRight size={12} />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white border border-slate-200 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="p-2 bg-slate-50 rounded-xl">
              <Activity
                size={18}
                className="sm:w-[20px] sm:h-[20px] text-[#009688]"
              />
            </div>
            <h3 className="text-[10px] sm:text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
              Recent Refill Activity
            </h3>
          </div>

          {activity.length === 0 ? (
            <div className="py-16 sm:py-20 flex flex-col items-center opacity-20 text-center">
              <Pill size={40} className="sm:w-[48px] sm:h-[48px] mb-2" />
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                No Active Logs
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activity.map((log) => (
                <div
                  key={log._id}
                  className="p-4 sm:p-4 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 text-sm shrink-0">
                      {log.patientId?.name?.charAt(0)}
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                        {log.patientId?.name}
                      </p>
                      <p className="text-[11px] font-bold text-[#009688] uppercase mt-1">
                        {log.medicineId?.medicineName}
                      </p>

                      <div className="mt-3 flex items-center justify-between sm:justify-end sm:gap-6">
                        <p className="text-[11px] font-black text-slate-900">
                          {new Date(log.refillDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">
                          {log.tabletsGiven} Units Issued
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

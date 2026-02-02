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
  Terminal,
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
  const [cronLoading, setCronLoading] = useState(false);

  useEffect(() => {
  if (!session) {
    console.log("⏳ Waiting for session...");
    return;
  }

  console.log("✅ Session found:", session);
  console.log("1️⃣ Fetching dashboard summary...");
  
  api
    .get("/dashboard/summary")
    .then((res) => {
      console.log("2️⃣ Summary response:", res.data);
      setTodayCount(res.data.today);
      setUpcomingCount(res.data.upcoming);
      setMissedCount(res.data.missed);
    })
    .catch((err) => {
      console.error("❌ Summary error:", err.response?.data || err.message);
    });

  console.log("3️⃣ Fetching dashboard activity...");
  api
    .get("/dashboard/activity")
    .then((res) => {
      console.log("4️⃣ Activity response:", res.data);
      setActivity(res.data);
    })
    .catch((err) => {
      console.error("❌ Activity error:", err.response?.data || err.message);
    });
}, [session]); // ✅ Re-run when session changes

  async function runCron() {
    try {
      setCronLoading(true);

      const todayRes = await fetch("/api/cron/today-refils", {
        method: "GET",
        headers: {
          "x-cron-key": "dev-cron-key",
        },
      });

      if (!todayRes.ok) {
        throw new Error("Today refill cron failed");
      }

      const todayData = await todayRes.json();

      const missedRes = await fetch("/api/cron/mark-missed", {
        method: "GET",
        headers: {
          "x-cron-key": "dev-cron-key",
        },
      });

      if (!missedRes.ok) {
        throw new Error("Missed refill cron failed");
      }

      const missedData = await missedRes.json();

      alert(
        "Cron executed successfully.\n\n" +
        "Check logs and Telegram for actual results."
      );
    } catch (error) {
      console.error(error);
      alert("Cron execution failed");
    } finally {
      setCronLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-8 lg:p-12 font-sans text-slate-900">
      <div className="max-w-[1400px] mx-auto space-y-10">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
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
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
              Clinical Dashboard
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Real-time medication refill synchronization
            </p>
          </motion.div>

          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <ShieldCheck size={16} className="text-[#009688]" />
            <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">
              Verified Practitioner
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              className={`group cursor-pointer bg-white border border-slate-200 rounded-[2.5rem] p-8 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 ${card.border}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    {card.label}
                  </p>
                  <h2
                    className={`text-4xl font-black tracking-tighter ${card.color === "text-rose-600" ? "text-rose-600" : "text-slate-900"}`}
                  >
                    {card.count}
                  </h2>
                </div>
                <div
                  className={`h-14 w-14 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center transition-transform group-hover:scale-110`}
                >
                  <card.icon size={26} strokeWidth={2.5} />
                </div>
              </div>
              <div className="mt-6 flex items-center gap-1 text-[#009688] font-bold text-[10px] uppercase tracking-tighter">
                View Registry <ChevronRight size={12} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
         
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:col-span-8 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-slate-50 rounded-xl">
                <Activity size={20} className="text-[#009688]" />
              </div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
                Recent Refill Activity
              </h3>
            </div>

            {activity.length === 0 ? (
              <div className="py-20 flex flex-col items-center opacity-20">
                <Pill size={48} className="mb-2" />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  No Active Logs
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activity.map((log) => (
                  <div
                    key={log._id}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs">
                        {log.patientId?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                          {log.patientId?.name}
                        </p>
                        <p className="text-[10px] font-bold text-[#009688] uppercase">
                          {log.medicineId?.medicineName}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-[11px] font-black text-slate-900">
                        {new Date(log.refillDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                        {log.tabletsGiven} Units Issued
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          
          <div className="lg:col-span-4 space-y-6">
            {process.env.NODE_ENV === "development" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border-2 border-dashed border-rose-100 rounded-[2.5rem] p-8"
              >
                <div className="flex items-center gap-2 mb-4 text-rose-600">
                  <Terminal size={18} />
                  <h3 className="text-[10px] font-black uppercase tracking-widest">
                    Developer Engine
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 mb-6 leading-relaxed">
                  Manual override to trigger background jobs for missed refill
                  calculations.
                </p>
                <button
                  onClick={runCron}
                  disabled={cronLoading}
                  className="w-full py-4 rounded-2xl bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all disabled:opacity-50 shadow-lg shadow-rose-100"
                >
                  {cronLoading ? "Processing..." : "Trigger Cron Job"}
                </button>
              </motion.div>
            )}

            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#009688] mb-2">
                  Clinical Note
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "Ensure all patient records are updated before the weekly
                  audit cycle begins every Friday."
                </p>
              </div>
              <Activity
                className="absolute -bottom-4 -right-4 text-white/5"
                size={120}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
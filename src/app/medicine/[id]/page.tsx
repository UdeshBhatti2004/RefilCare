"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Pill,
  User,
  Calendar,
  Activity,
  ChevronLeft,
  RefreshCw,
  Clock,
  ShieldCheck,
} from "lucide-react";

type Medicine = {
  _id: string;
  medicineName: string;
  condition: string;
  dosagePerDay: number;
  tabletsGiven: number;
  startDate: string;
  refillDate: string;
  status: string;
  patientId: { name: string };
};

export default function MedicineDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/medicines/${id}`)
      .then((res) => setMedicine(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <RefreshCw className="w-6 h-6 text-[#009688] animate-spin" />
    </div>
  );

  if (!medicine) return <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Record Not Found</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-10">
      
      {/* TOP BAR */}
      <div className=" border-b border-slate-200 sticky top-0 z-20 w-full">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-[11px] font-black text-slate-500 hover:text-[#009688] transition-colors tracking-widest"
          >
            <ChevronLeft size={16} /> BACK TO LEDGER
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full">
               <ShieldCheck size={12} className="text-[#009688]" />
               <span className="text-[10px] font-black text-slate-500 uppercase">Read-Only Archive</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-8 mt-6">
        {/* lg:items-stretch ensures both columns have the same height */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-stretch"
        >
          
          {/* LEFT COLUMN: PRIMARY DATA */}
          <div className="lg:col-span-8 flex">
            <div className="w-full bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tighter">
                      {medicine.medicineName}
                    </h1>
                    <p className="text-[12px] font-bold text-[#009688] uppercase tracking-[0.3em] mt-2">
                      Clinical Indication: {medicine.condition}
                    </p>
                  </div>
                  <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                    medicine.status === "active" 
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                    : "bg-rose-50 text-rose-600 border-rose-100"
                  }`}>
                    {medicine.status}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <User size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Patient</span>
                    </div>
                    <p className="text-base font-bold text-slate-800">{medicine.patientId.name}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <Activity size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Daily Dosage</span>
                    </div>
                    <p className="text-base font-bold text-slate-800">{medicine.dosagePerDay} Units / Day</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <Pill size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Stock Issued</span>
                    </div>
                    <p className="text-base font-bold text-slate-800">{medicine.tabletsGiven} Units</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-6 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-300 tracking-widest uppercase">System Verified Ledger</span>
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white" />
                  <div className="w-6 h-6 rounded-full bg-teal-100 border-2 border-white" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: TIMELINE (Now matches left height) */}
          <div className="lg:col-span-4 flex">
            <div className="w-full bg-slate-900 text-white border border-slate-800 rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-10">
                  <div className="w-2 h-2 rounded-full bg-[#009688]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#009688]">Schedule Tracking</span>
                </div>

                <div className="space-y-10">
                  <div className="relative pl-6 border-l border-slate-700">
                    <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-slate-700" />
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Start Date</p>
                    <p className="text-sm font-bold">{new Date(medicine.startDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>

                  <div className="relative pl-6 border-l border-[#009688]">
                    <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-[#009688]" />
                    <p className="text-[9px] font-black text-[#009688] uppercase tracking-widest mb-1">Estimated Refill</p>
                    <p className="text-sm font-bold text-white">{new Date(medicine.refillDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 mt-8">
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                  Notice: This record is finalized. To adjust dosage or refill dates, please issue a new clinical prescription entry.
                </p>
              </div>

              {/* Background Art */}
              <div className="absolute -bottom-6 -right-6 opacity-10 pointer-events-none">
                <Activity size={180} />
              </div>
            </div>
          </div>

        </motion.div>
      </main>
    </div>
  );
}
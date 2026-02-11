"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Pill,
  User,
  Activity,
  ChevronLeft,
  RefreshCw,
  ShieldCheck,
  Calendar,
  AlertCircle,
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

  if (!medicine) return (
    <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
      Record Not Found
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex flex-col py-6 sm:py-10 lg:py-20">
      <div className="w-full backdrop-blur-md sticky top-0 z-30 border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-[10px] sm:text-[11px] font-black text-slate-500 hover:text-[#009688] transition-colors tracking-widest"
          >
            <ChevronLeft size={16} /> BACK
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
            <ShieldCheck size={12} className="text-[#009688]" />
            <span className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-tighter">
              Archived Protocol
            </span>
          </div>
        </div>
      </div>

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-0 sm:px-8 py-0 sm:py-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="grid grid-cols-1 lg:grid-cols-12 gap-0 sm:gap-10"
        >
          <div className="lg:col-span-8">
            <div className="bg-white border-b sm:border border-slate-200 rounded-none sm:rounded-[3rem] p-6 sm:p-12 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 sm:p-4 rounded-2xl bg-[#009688]/10 text-[#009688]">
                    <Pill size={28} className="sm:w-8 sm:h-8" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-3xl font-black text-slate-900 uppercase tracking-tighter">
                      {medicine.medicineName}
                    </h1>
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      Clinical Indication: {medicine.condition}
                    </p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border self-start sm:self-center ${
                  medicine.status === "active" 
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                  : "bg-rose-50 text-rose-600 border-rose-100"
                }`}>
                  {medicine.status}
                </div>
              </div>

              <div className="space-y-12">
                <section className="space-y-6">
                  <p className="text-[10px] font-black text-[#009688] uppercase tracking-[0.2em] flex items-center gap-2 border-b border-teal-50 pb-2">
                    <User size={14} /> 01. Patient Identification
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase ml-1">Assigned Patient</p>
                      <p className="text-lg font-bold text-slate-800 bg-slate-50 px-5 py-4 rounded-xl border border-slate-100 italic">
                        {medicine.patientId.name}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <p className="text-[10px] font-black text-[#009688] uppercase tracking-[0.2em] flex items-center gap-2 border-b border-teal-50 pb-2">
                    <Activity size={14} /> 02. Pharmacological Details
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-slate-400 uppercase ml-1">Daily Dosage</p>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-bold">
                        {medicine.dosagePerDay} Units
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-slate-400 uppercase ml-1">Tablets Issued</p>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-bold">
                        {medicine.tabletsGiven} Units
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-slate-400 uppercase ml-1">Registry Status</p>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-bold uppercase">
                        {medicine.status}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 px-4 sm:px-0 py-8 sm:py-0">
            <div className="bg-slate-900 text-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-10 flex flex-col h-full relative overflow-hidden shadow-2xl">
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-10">
                  <Calendar size={16} className="text-[#009688]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#009688]">
                    Cycle Timeline
                  </span>
                </div>

                <div className="flex-1 space-y-10">
                  <div className="space-y-8">
                    <div className="relative pl-8 border-l border-slate-700">
                      <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-slate-700 ring-4 ring-slate-900" />
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Commencement</p>
                      <p className="text-xl font-bold tracking-tight">
                        {new Date(medicine.startDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>

                    <div className="relative pl-8 border-l border-[#009688]">
                      <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-[#009688] ring-4 ring-[#009688]/20" />
                      <p className="text-[10px] font-black text-[#009688] uppercase tracking-widest mb-2">Projected Refill</p>
                      <p className="text-xl font-bold text-white tracking-tight">
                        {new Date(medicine.refillDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-5 bg-teal-950/40 rounded-2xl border border-teal-900/50">
                    <AlertCircle size={18} className="text-[#009688] shrink-0" />
                    <p className="text-[10px] text-teal-100/70 leading-relaxed font-medium">
                      Record Lock Active. This protocol is finalized in the clinical ledger and cannot be modified.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => router.back()}
                  className="mt-10 w-full bg-slate-800 hover:bg-slate-700 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  Return to Medicine
                </button>
              </div>

              <div className="absolute -bottom-16 -right-16 opacity-[0.03] pointer-events-none">
                <Activity size={320} />
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
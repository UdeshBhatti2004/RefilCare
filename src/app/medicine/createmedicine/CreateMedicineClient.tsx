"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pill,
  User,
  Activity,
  ClipboardList,
  ArrowRight,
  ChevronLeft,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

type Patient = {
  _id: string;
  name: string;
};

type Condition = "BP" | "Diabetes" | "Thyroid" | "Other";

export default function NewMedicinePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientIdFromUrl = searchParams.get("patientId");

  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientId, setPatientId] = useState(patientIdFromUrl || "");
  const [medicineName, setMedicineName] = useState("");
  const [condition, setCondition] = useState<Condition | "">("");
  const [otherCondition, setOtherCondition] = useState("");
  const [dosagePerDay, setDosagePerDay] = useState("");
  const [tabletsGiven, setTabletsGiven] = useState("");
  const [startDate, setStartDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("/api/patients").then((res) => {
      setPatients(Array.isArray(res.data) ? res.data : []);
    });
  }, []);

  const handleSubmit = async () => {
    if (!patientId || !medicineName || !condition || !dosagePerDay || !tabletsGiven || !startDate) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/medicines", {
        patientId,
        medicineName: condition === "Other" ? `${medicineName} (${otherCondition})` : medicineName,
        condition,
        dosagePerDay: Number(dosagePerDay),
        tabletsGiven: Number(tabletsGiven),
        startDate,
      });

      toast.success("Medicine protocol established");
      router.push("/dashboard");
    } catch {
      toast.error("Failed to commit record");
    } finally {
      setLoading(false);
    }
  };

  const estimatedDays = dosagePerDay && tabletsGiven 
    ? Math.floor(Number(tabletsGiven) / Number(dosagePerDay)) 
    : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex flex-col py-6 sm:py-10 lg:py-20">
      <div className="w-full  backdrop-blur-md sticky top-0 z-30 border-b border-slate-200">
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
              Clinical Entry
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
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 sm:p-4 rounded-2xl bg-[#009688]/10 text-[#009688]">
                  <Pill size={28} className="sm:w-8 sm:h-8" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-3xl font-black text-slate-900 uppercase tracking-tighter">
                    Medication Protocol
                  </h1>
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    Authorized Prescription Entry
                  </p>
                </div>
              </div>

              <div className="space-y-12">
                <section className="space-y-6">
                  <p className="text-[10px] font-black text-[#009688] uppercase tracking-[0.2em] flex items-center gap-2 border-b border-teal-50 pb-2">
                    <User size={14} /> 01. Patient & Medicine
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    <div className="md:col-span-2">
                      <select
                        value={patientId}
                        onChange={(e) => setPatientId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-[#009688] transition-colors appearance-none"
                      >
                        <option value="">Select Patient Registry...</option>
                        {patients.map((p) => (
                          <option key={p._id} value={p._id}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    <input
                      type="text"
                      placeholder="MEDICINE NAME"
                      value={medicineName}
                      onChange={(e) => setMedicineName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-[#009688] transition-colors"
                    />

                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as Condition)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-[#009688] transition-colors appearance-none"
                    >
                      <option value="">DIAGNOSIS CATEGORY</option>
                      <option value="BP">Blood Pressure</option>
                      <option value="Diabetes">Diabetes</option>
                      <option value="Thyroid">Thyroid</option>
                      <option value="Other">Other Condition</option>
                    </select>

                    <AnimatePresence>
                      {condition === "Other" && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="md:col-span-2 overflow-hidden"
                        >
                          <input
                            type="text"
                            placeholder="SPECIFY CONDITION"
                            value={otherCondition}
                            onChange={(e) => setOtherCondition(e.target.value)}
                            className="w-full bg-teal-50/30 border border-teal-100 rounded-xl sm:rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-[#009688]"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </section>

                <section className="space-y-6">
                  <p className="text-[10px] font-black text-[#009688] uppercase tracking-[0.2em] flex items-center gap-2 border-b border-teal-50 pb-2">
                    <ClipboardList size={14} /> 02. Dosage & Inventory
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Daily Dosage</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={dosagePerDay}
                        onChange={(e) => setDosagePerDay(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-bold outline-none focus:border-[#009688]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Tablets Issued</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={tabletsGiven}
                        onChange={(e) => setTabletsGiven(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-bold outline-none focus:border-[#009688]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-bold outline-none focus:border-[#009688] uppercase"
                      />
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
                  <Activity size={16} className="text-[#009688]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#009688]">
                    Live Computation
                  </span>
                </div>

                <div className="flex-1 space-y-8">
                  <div className="bg-white/5 rounded-[2.5rem] p-10 border border-white/10 text-center backdrop-blur-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      Supply Duration
                    </p>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-7xl sm:text-8xl font-black tracking-tighter">
                        {estimatedDays || "00"}
                      </span>
                      <span className="text-sm font-black text-[#009688] uppercase">Days</span>
                    </div>
                  </div>

                  <div className="flex gap-4 p-5 bg-teal-950/40 rounded-2xl border border-teal-900/50">
                    <AlertCircle size={18} className="text-[#009688] shrink-0" />
                    <p className="text-[10px] text-teal-100/70 leading-relaxed font-medium">
                      Protocols are calculated based on supply duration. 
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="mt-10 w-full bg-[#009688] hover:bg-teal-500 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98] shadow-lg shadow-teal-900/20"
                >
                  {loading ? (
                    <RefreshCw className="animate-spin" size={18} />
                  ) : (
                    <>Commit Record <ArrowRight size={18} /></>
                  )}
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
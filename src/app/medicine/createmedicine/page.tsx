"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Pill,
  User,
  Activity,
  ClipboardList,
  ArrowRight,
  ChevronLeft,
  RefreshCw,
  ShieldCheck,
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
      setPatients(res.data);
    });
  }, []);

  const handleSubmit = async () => {
    if (
      !patientId ||
      !medicineName ||
      !condition ||
      !dosagePerDay ||
      !tabletsGiven ||
      !startDate
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/medicines", {
        patientId,
        medicineName:
          condition === "Other"
            ? `${medicineName} (${otherCondition})`
            : medicineName,
        condition,
        dosagePerDay: Number(dosagePerDay),
        tabletsGiven: Number(tabletsGiven),
        startDate,
      });

      toast.success("Medicine created successfully");
      router.push("/dashboard");
    } catch {
      toast.error("Failed to create medicine");
    } finally {
      setLoading(false);
    }
  };

  const estimatedDays =
    dosagePerDay && tabletsGiven
      ? Math.floor(Number(tabletsGiven) / Number(dosagePerDay))
      : 0;

  return (
    <div className="h-screen bg-[#F8FAFC] font-sans text-slate-900 flex flex-col overflow-hidden">
      {/* TOP NAVIGATION */}
      <div className="w-full shrink-0">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[11px] font-black text-slate-500 hover:text-[#009688] transition-colors tracking-widest"
          >
            <ChevronLeft size={16} /> BACK
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
            <ShieldCheck size={12} className="text-[#009688]" />
            <span className="text-[10px] font-black text-slate-500 uppercase">
              Clinical Entry Mode
            </span>
          </div>
        </div>
      </div>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-8 pb-6 w-full overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-stretch"
        >
          {/* LEFT: FORM */}
          <div className="lg:col-span-8 flex flex-col h-full overflow-hidden">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 sm:p-10 flex flex-col h-full shadow-sm">
              <div className="flex items-center gap-4 mb-10 shrink-0">
                <div className="p-3 rounded-2xl bg-[#009688]/10 text-[#009688]">
                  <Pill size={28} />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                    Add New Medicine
                  </h1>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Digital Medical Authentication
                  </p>
                </div>
              </div>

              <div className="space-y-10 flex-1 overflow-y-auto pr-2">
                {/* Patient */}
                <div className="space-y-6">
                  <p className="text-[10px] font-black text-[#009688] uppercase tracking-[0.2em] flex items-center gap-2">
                    <User size={14} /> 01. Patient Identification
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <select
                        value={patientId}
                        onChange={(e) => setPatientId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none"
                      >
                        <option value="">Search Patient Registry...</option>
                        {patients.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <input
                      type="text"
                      placeholder="MEDICINE NAME"
                      value={medicineName}
                      onChange={(e) => setMedicineName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none"
                    />

                    <select
                      value={condition}
                      onChange={(e) =>
                        setCondition(e.target.value as Condition)
                      }
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none"
                    >
                      <option value="">DIAGNOSIS CATEGORY</option>
                      <option value="BP">Blood Pressure</option>
                      <option value="Diabetes">Diabetes</option>
                      <option value="Thyroid">Thyroid</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Dosage */}
                <div className="space-y-6">
                  <p className="text-[10px] font-black text-[#009688] uppercase tracking-[0.2em] flex items-center gap-2">
                    <ClipboardList size={14} /> 02. Pharmacological Details
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Daily Units */}
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Dosage per day"
                      value={dosagePerDay}
                      onChange={(e) => {
                        if (/^\d*$/.test(e.target.value)) {
                          setDosagePerDay(e.target.value);
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none"
                    />

                    {/* Total Quantity */}
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Tablets Given"
                      pattern="[0-9]*"
                      value={tabletsGiven}
                      onChange={(e) => {
                        if (/^\d*$/.test(e.target.value)) {
                          setTabletsGiven(e.target.value);
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none"
                    />

                    {/* Start Date */}
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none text-slate-500 uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: PROJECTION (UNCHANGED) */}
          <div className="lg:col-span-4 flex flex-col h-full gap-6 overflow-hidden">
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden h-full shadow-2xl">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-8">
                  <Activity size={16} className="text-[#009688]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#009688]">
                    Calculation Logic
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/5 rounded-[2rem] p-8 border border-white/10 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      Prescription Span
                    </p>
                    <p className="text-7xl font-black text-white tracking-tighter">
                      {estimatedDays || "00"}
                    </p>
                    <p className="text-[10px] font-bold text-[#009688] uppercase mt-4">
                      Calculated Days
                    </p>
                  </div>

                  <div className="p-5 bg-teal-950/30 rounded-2xl border border-teal-900/50">
                    <p className="text-[10px] text-teal-100/60 leading-relaxed font-medium">
                      Automated refill protocols will activate upon record
                      commitment. Ensure data accuracy before finalization.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="relative z-10 mt-6 w-full bg-[#009688] hover:bg-teal-500 text-white py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 shrink-0"
              >
                {loading ? (
                  <RefreshCw className="animate-spin" size={16} />
                ) : (
                  <>
                    Create Medicine <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="absolute -bottom-20 -right-20 opacity-10 pointer-events-none">
                <Activity size={300} />
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

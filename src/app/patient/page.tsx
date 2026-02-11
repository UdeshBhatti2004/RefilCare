"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  UserPlus,
  Search,
  User,
  Phone,
  Trash2, 
} from "lucide-react";
import toast from "react-hot-toast"; 

type Patient = {
  _id: string;
  name: string;
  phone: string;
};

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/patients")
      .then((res) => res.json())
      .then((data) => {
        setPatients(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setPatients([]);
        setLoading(false);
      });
  }, []);

  const filteredPatients = useMemo(() => {
    return patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.phone.includes(searchQuery)
    );
  }, [searchQuery, patients]);

  async function handleDeletePatient(id: string) {
    if (typeof window === "undefined") return;
    const confirmed = window.confirm(
      "Delete this patient?\n\nAll related medicines will also be removed from active records."
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/patients/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Delete failed");
      }

      setPatients((prev) => prev.filter((p) => p._id !== id));
      toast.success("Patient deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete patient");
    }
  }

  if (!mounted || loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white px-4">
        <div className="w-12 h-12 border-4 border-[#009688] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-black animate-pulse uppercase tracking-widest text-[10px]">
          Initializing Directory
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-10 lg:py-20">
      <div className="border-b border-slate-200 sticky top-0 z-30 bg-[#F8FAFC]/80 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 lg:py-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#009688] rounded-full animate-pulse" />
                <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  Clinical Records
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter uppercase">
                Patient Directory
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="relative w-full sm:w-80 group">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#009688]"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white sm:bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[#009688]/10 focus:border-[#009688] outline-none transition-all"
                />
              </div>

              <Link
                href="/patient/create"
                className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-lg hover:bg-slate-800 transition-colors"
              >
                <Plus size={18} strokeWidth={3} />
                <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap">
                  Register Patient
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-10">
        <div className="flex items-center justify-between mb-6 lg:mb-10">
          <span className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white border border-slate-200 px-3 py-1.5 sm:px-4 rounded-full">
            {filteredPatients.length} Verified Profiles
          </span>
          <div className="h-px bg-slate-200 flex-1 mx-4 sm:mx-8 hidden md:block" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPatients.map((patient) => (
              <motion.div
                key={patient._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group bg-white border border-slate-200 rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-8 hover:border-[#009688] hover:shadow-2xl transition-all relative overflow-hidden"
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4 sm:gap-5 min-w-0 flex-1">
                    <div className="h-12 w-12 sm:h-16 sm:w-16 shrink-0 rounded-xl sm:rounded-[1.5rem] bg-slate-50 border flex items-center justify-center text-lg sm:text-xl font-black text-slate-400 group-hover:bg-[#009688] group-hover:text-white transition-colors">
                      {patient.name.charAt(0)}
                    </div>
                    <div className="min-w-0 pr-4">
                      <h3 className="font-black uppercase truncate text-sm sm:text-base">
                        {patient.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                        <Phone size={12} className="shrink-0" />
                        <span className="text-[10px] sm:text-xs font-bold truncate">
                          {patient.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center shrink-0">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeletePatient(patient._id);
                      }}
                      className="p-2.5 sm:p-3 bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl sm:rounded-2xl transition-all active:scale-90"
                      title="Delete patient"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-slate-50 flex items-center justify-between relative z-10">
                  <span className="text-[8px] sm:text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
                    Ref: {patient._id.slice(-6).toUpperCase()}
                  </span>
                  <Link
                    href={`/patient/${patient._id}`}
                    className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#009688] px-4 py-2.5 sm:px-6 bg-[#009688]/5 rounded-xl hover:bg-[#009688] hover:text-white transition-all"
                  >
                    Open Profile
                  </Link>
                </div>

                <User
                  size={100}
                  className="absolute -bottom-6 -right-6 text-slate-50/40 pointer-events-none"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredPatients.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 sm:py-32 bg-white border border-dashed border-slate-200 rounded-[2rem] sm:rounded-[3rem] mt-4 px-4 text-center"
          >
            <div className="h-16 w-16 sm:h-20 sm:w-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <UserPlus size={28} className="text-slate-300" />
            </div>
            <h2 className="text-base sm:text-lg font-black uppercase">
              No Clinical Records Found
            </h2>
            <p className="text-slate-400 text-[10px] sm:text-xs font-bold mt-1 uppercase tracking-widest">
              Verify search parameters or register a new patient
            </p>
            <Link
              href="/patient/create"
              className="mt-8 text-[10px] font-black uppercase tracking-widest bg-[#009688] text-white px-8 py-4 rounded-2xl shadow-lg"
            >
              New Registration
            </Link>
          </motion.div>
        )}
      </div>

      <Link
        href="/patient/create"
        className="fixed bottom-6 right-6 h-14 w-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl z-50 active:scale-95 transition-transform"
      >
        <Plus size={24} strokeWidth={3} />
      </Link>
    </div>
  );
}
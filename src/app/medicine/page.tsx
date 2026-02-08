"use client";

import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pill,
  User,
  Calendar,
  ArrowRight,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

type Medicine = {
  _id: string;
  medicineName: string;
  condition: string;
  status: "active" | "missed" | "stopped";
  refillDate: string;
  patientId: { _id: string; name: string };
};

function utcDay(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

export default function MedicinesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter"); 
  
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);

        const res = await axios.get("/api/medicines", { withCredentials: true });

        
       
        const patientIds = [...new Set(res.data.map((m: any) => m.patientId))];

        
       

        const patientsRes = await axios.post("/api/patients/batch", 
          { patientIds }, 
          { withCredentials: true }
        );

        
        const patientMap = Object.fromEntries(
          patientsRes.data.map((p: any) => [p._id, p.name])
        );
        
        
        const medicinesWithNames = res.data.map((m: any) => ({
          ...m,
          patientId: {
            _id: m.patientId,
            name: patientMap[m.patientId] || "Unknown"
          }
        }));
        

        setMedicines(medicinesWithNames);
      } catch (err) {
        console.error(" Failed to fetch medicines:", err);
        toast.error("Failed to load medicines");
        setMedicines([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  
  const filteredData = useMemo(() => {
    let result = medicines;

    
    if (filter) {
      const today = utcDay(new Date());
      
      result = medicines.filter((m) => {
        const refillDate = utcDay(new Date(m.refillDate));

        if (filter === "today") {
          return refillDate.getTime() === today.getTime();
        } else if (filter === "upcoming") {
          return refillDate.getTime() > today.getTime();
        } else if (filter === "missed") {
          return refillDate.getTime() < today.getTime();
        }

        return true;
      });
    }

    
    result = result.filter(
      (m) =>
        m.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.patientId?.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

    return result;
  }, [medicines, searchTerm, filter]); 

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filter]); 

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this medicine record?");
    if (!confirmed) return;

    try {
      await axios.delete(`/api/medicines/${id}`, {
        withCredentials: true,
      });

      setMedicines((prev) => prev.filter((m) => m._id !== id));
      toast.success("Medicine deleted");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete medicine");
    }
  }

  async function handleStatusAction(medicine: Medicine) {
    try {
      let action: "stop" | "resume";

      if (medicine.status === "stopped") {
        action = "resume";
      } else {
        const confirmStop = window.confirm(
          "Stop this medicine? It will no longer receive refill reminders."
        );
        if (!confirmStop) return;
        action = "stop";
      }

      const res = await axios.patch(
        `/api/medicines/${medicine._id}`,
        { action },
        { withCredentials: true }
      );

      setMedicines((prev) =>
        prev.map((m) =>
          m._id === medicine._id ? res.data : m
        )
      );

      toast.success(
        action === "stop" ? "Medicine stopped" : "Medicine resumed"
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Action failed");
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] font-sans text-slate-900 pb-12">
      <div className="sticky top-20 z-30 bg-[#f8fafc]/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#009688] p-2 rounded-xl text-white shadow-md">
                <Pill size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-800">
                  Medicines
                  {filter && (
                    <span className="ml-2 text-sm text-teal-600 capitalize">
                      ({filter})
                    </span>
                  )}
                </h1>
                <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">
                  {filteredData.length} total entries
                </p>
              </div>
            </div>

            <div className="relative w-full max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search patient or medicine..."
                value={searchTerm}
                className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-teal-500/20 outline-none"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Link
              href="/medicine/createmedicine"
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-xl font-bold hover:bg-[#009688] transition-all text-xs"
            >
              <Plus size={16} /> NEW RECORD
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 mt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <RefreshCw className="w-8 h-8 text-teal-500 animate-spin mb-4" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Syncing Database
            </span>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-60">
            <Pill size={48} className="mb-4 text-slate-400" />
            <p className="text-sm font-bold text-slate-600">
              No medicines found
              {filter && <span> for "{filter}"</span>}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Add a medicine to start tracking refills
            </p>

            <Link
              href="/medicine/createmedicine"
              className="mt-6 text-xs font-bold text-teal-600 hover:underline"
            >
              + Add first medicine
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {currentData.map((m) => {
                  const isDue = new Date(m.refillDate) <= new Date();

                  return (
                    <motion.div
                      key={m._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-teal-500/50 hover:shadow-xl transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between mb-3">
                          <div
                            className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                              m.status === "active"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-rose-50 text-rose-600"
                            }`}
                          >
                            {m.status}
                          </div>

                          <button
                            onClick={() => handleDelete(m._id)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 text-slate-300 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <h3 className="font-bold truncate">
                          {m.medicineName}
                        </h3>

                        <span className="inline-block bg-slate-100 text-slate-500 rounded text-[10px] px-2 py-0.5 mb-4">
                          {m.condition}
                        </span>

                        <div className="space-y-2 text-xs text-slate-600">
                          <div className="flex items-center gap-2">
                            <User size={14} />
                            {m.patientId?.name}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            {new Date(m.refillDate).toDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => {
                            if (!isDue) handleStatusAction(m);
                          }}
                          className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                            isDue
                              ? "bg-amber-500 text-white shadow-lg shadow-amber-100"
                              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {isDue ? "Log Refill" : "Details"}
                        </button>

                        <Link
                          href={`/medicine/${m._id}`}
                          className="w-9 h-9 flex items-center justify-center bg-teal-50 text-teal-600 rounded-lg hover:bg-[#009688] hover:text-white transition-all"
                        >
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((p) => Math.max(1, p - 1))
                  }
                >
                  <ChevronLeft />
                </button>
                <span className="text-xs">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(totalPages, p + 1)
                    )
                  }
                >
                  <ChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
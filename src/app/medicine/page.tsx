"use client";

import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Pill, User, Calendar, ArrowRight, Plus, Trash2, RefreshCw, Search, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

type Medicine = {
  _id: string;
  medicineName: string;
  condition: string;
  status: "active" | "missed" | "stopped";
  refillDate: string;
  patientId: { _id: string; name: string; };
};

export default function MedicinesPage() {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; 

  useEffect(() => {
    setLoading(true);
    let url = "/api/medicines";
    if (filter) url += `?filter=${filter}`;
    axios.get(url, { withCredentials: true })
      .then((res) => setMedicines(res.data))
      .finally(() => setLoading(false));
  }, [filter]);

  const filteredData = useMemo(() => {
    return medicines.filter(m => 
      m.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.patientId?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [medicines, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] font-sans text-slate-900 pb-12">
      
      {/* COMPACT STICKY HEADER */}
      <div className="sticky top-20 z-30 bg-[#f8fafc]/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="bg-[#009688] p-2 rounded-xl text-white shadow-md">
                <Pill size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-800">Medicines</h1>
                <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">{filteredData.length} total entries</p>
              </div>
            </div>

            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="Search patient or medicine..."
                value={searchTerm}
                className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Link
              href="/medicine/createmedicine"
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-xl font-bold hover:bg-[#009688] transition-all text-xs tracking-wide"
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
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Syncing Database</span>
          </div>
        ) : (
          <>
            {/* COMPACT GRID: 4 columns on large screens */}
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
                      className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-teal-500/50 hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                            m.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${m.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            {m.status}
                          </div>
                          <button className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 text-slate-300 transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <h3 className="font-bold text-slate-800 text-base leading-tight truncate mb-0.5">
                          {m.medicineName}
                        </h3>
                        <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-medium uppercase mb-4">
                          {m.condition}
                        </span>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-slate-600">
                            <User size={14} className="text-slate-400" />
                            <span className="text-xs font-medium truncate">{m.patientId?.name || "Unassigned"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Calendar size={14} className={isDue ? "text-amber-500" : "text-slate-400"} />
                            <span className={`text-xs font-medium ${isDue ? "text-amber-700 font-bold" : ""}`}>
                              {new Date(m.refillDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-50 flex items-center gap-2">
                        <button 
                          className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                            isDue ? 'bg-amber-500 text-white shadow-lg shadow-amber-100' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {isDue ? 'Log Refill' : 'Details'}
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

            {/* MINIMALIST PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center gap-4">
                <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-2xl shadow-sm">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 hover:bg-slate-50 disabled:opacity-20 text-slate-600 transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <div className="flex items-center px-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                          currentPage === pageNum ? "bg-[#009688] text-white shadow-md shadow-teal-100" : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 hover:bg-slate-50 disabled:opacity-20 text-slate-600 transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  Page {currentPage} of {totalPages}
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
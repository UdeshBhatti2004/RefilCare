"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, UserPlus, Search, User, Phone, ArrowUpRight } from "lucide-react"

type Patient = {
  _id: string
  name: string
  phone: string
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetch("/api/patients")
      .then((res) => res.json())
      .then((data) => {
        setPatients(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery)
    )
  }, [searchQuery, patients])

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-[#009688] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-black animate-pulse uppercase tracking-widest text-[10px]">
          Initializing Directory
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
    
      <div className=" border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-6 py-6 lg:py-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#009688] rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Clinical Records</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Patient Directory</h1>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              
              <div className="relative w-full sm:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#009688] transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[#009688]/10 focus:border-[#009688] transition-all outline-none"
                />
              </div>

              
              <Link href="/patient/create" className="hidden sm:flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-3.5 rounded-2xl transition-all active:scale-95 shadow-lg shadow-slate-200">
                <Plus size={18} strokeWidth={3} />
                <span className="text-[11px] font-black uppercase tracking-widest">Register Patient</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto p-6 lg:p-10">
        
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white border border-slate-200 px-4 py-1.5 rounded-full">
              {filteredPatients.length} Verified Profiles
            </span>
          </div>
          <div className="h-px bg-slate-200 flex-1 mx-8 hidden xl:block" />
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPatients.map((patient) => (
              <motion.div
                layout
                key={patient._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group bg-white border border-slate-200 rounded-[2.5rem] p-8 hover:border-[#009688] hover:shadow-2xl hover:shadow-[#009688]/5 transition-all duration-500 relative overflow-hidden"
              >
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center gap-5">
                    <div className="h-16 w-16 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-xl font-black text-slate-400 group-hover:bg-[#009688] group-hover:text-white transition-all duration-500">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 uppercase tracking-tight group-hover:text-[#009688] transition-colors truncate max-w-[150px]">
                        {patient.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                        <Phone size={12} />
                        <span className="text-xs font-bold">{patient.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-300 group-hover:text-[#009688] transition-colors">
                    <ArrowUpRight size={20} />
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-between relative z-10">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
                    Ref: {patient._id.slice(-6).toUpperCase()}
                  </span>
                  <Link
                    href={`/patient/${patient._id}`}
                    className="text-[10px] font-black uppercase tracking-widest text-[#009688] px-4 py-2 bg-[#009688]/5 rounded-xl hover:bg-[#009688] hover:text-white transition-all"
                  >
                    View File
                  </Link>
                </div>
                
                
                <User size={100} className="absolute -bottom-6 -right-6 text-slate-50/50 pointer-events-none group-hover:text-[#009688]/5 transition-colors" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        
        {filteredPatients.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 bg-white border border-dashed border-slate-200 rounded-[3rem] mt-4">
             <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <UserPlus size={32} className="text-slate-300" />
             </div>
             <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">No Clinical Records Found</h2>
             <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">Verify search parameters or register a new patient</p>
             <Link href="/patient/create" className="mt-8 text-[10px] font-black uppercase tracking-widest bg-[#009688] text-white px-8 py-4 rounded-2xl shadow-lg shadow-[#009688]/20">
                New Registration
             </Link>
          </motion.div>
        )}
      </div>

      
      <Link 
        href="/patient/create"
        className="sm:hidden fixed bottom-8 right-8 h-16 w-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl z-50 active:scale-90 transition-transform"
      >
        <Plus size={28} strokeWidth={3} />
      </Link>
    </div>
  )
}
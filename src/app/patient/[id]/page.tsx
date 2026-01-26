"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ChevronLeft, 
  Plus, 
  Pill, 
  ShieldCheck, 
  ClipboardList, 
  Phone, 
  Activity,
  ChevronRight
} from "lucide-react"

type Patient = {
  _id: string
  name: string
  phone: string
}

type Medicine = {
  _id: string
  medicineName: string
  refillDate: string
  status: string
}

export default function PatientDetailPage() {
  const params = useParams()
  const id = typeof params.id === "string" ? params.id : ""
  
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [medicines, setMedicines] = useState<Medicine[]>([])
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6 // Adjusted for single-screen fit

  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      try {
        const [pRes, mRes] = await Promise.all([
  fetch(`/api/patients/${id}`),
  fetch(`/api/patients/${id}/medicines`)
        ])
        if (!pRes.ok) throw new Error()
        setPatient(await pRes.json())
        setMedicines(await mRes.json())
      } catch {
        setPatient(null)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  // Pagination Logic
  const totalPages = Math.ceil(medicines.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentMedicines = medicines.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
      <div className="w-10 h-10 border-4 border-[#009688] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!patient) return <div className="h-screen flex items-center justify-center font-black text-slate-400 uppercase tracking-widest text-sm">Record Not Found</div>

  return (
    <div className="h-screen w-full bg-[#F8FAFC] flex flex-col overflow-hidden font-sans text-slate-900">
      
      {/* NAVIGATION */}
      <nav className="shrink-0 w-full">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
          <Link href="/patient" className="flex items-center gap-2 text-[11px] font-black text-slate-500 hover:text-[#009688] transition-colors tracking-widest uppercase">
            <ChevronLeft size={16} /> Patients Registry
          </Link>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
             <ShieldCheck size={12} className="text-[#009688]" />
             <span className="text-[10px] font-black text-slate-500 uppercase">Secure Clinical Archive</span>
          </div>
        </div>
      </nav>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-8 pb-6 w-full overflow-hidden flex flex-col lg:flex-row gap-6">
        
        {/* PROFILE SIDEBAR */}
        <aside className="w-full lg:w-80 xl:w-96 flex flex-col shrink-0">
          <motion.div 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }}
            className="bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col h-full shadow-sm"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-[#009688] to-emerald-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-teal-100 mb-5 shrink-0 uppercase">
                {patient.name.charAt(0)}
              </div>
              <h1 className="text-xl font-black text-slate-900 leading-tight tracking-tighter uppercase">{patient.name}</h1>
              <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-teal-50 text-[#009688] rounded-full">
                <Phone size={10} />
                <span className="font-black text-[9px] tracking-widest">{patient.phone}</span>
              </div>
            </div>

            <div className="mt-8 space-y-5 flex-1">
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-slate-400 text-[8px] font-black uppercase tracking-widest">UID Reference</span>
                  <span className="font-mono text-[#009688] text-[9px] font-bold">#{id.slice(-6).toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-slate-400 text-[8px] font-black uppercase tracking-widest">Record Count</span>
                  <span className="text-slate-900 font-black text-[10px]">{medicines.length} Units</span>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <Activity size={12} className="text-[#009688]" />
                  <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Clinical Insight</span>
                </div>
                <p className="text-[10px] text-slate-500 italic leading-snug">All medication schedules are cross-referenced with local inventory cycles.</p>
              </div>
            </div>

            <Link
              href={`/medicine/createmedicine?patientId=${id}`}
              className="mt-6 w-full py-4 bg-[#009688] hover:bg-teal-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-teal-900/10"
            >
              <Plus size={14} /> New Entry
            </Link>
          </motion.div>
        </aside>

        {/* PAGINATED RECORDS SECTION */}
        <section className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] h-full flex flex-col shadow-sm">
            
            <div className="p-8 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#009688]/10 text-[#009688]">
                  <ClipboardList size={18} />
                </div>
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em]">Medication Ledger</h2>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                   <button 
                    disabled={currentPage === 1}
                    onClick={() => paginate(currentPage - 1)}
                    className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
                   >
                    <ChevronLeft size={14} />
                   </button>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                    Page {currentPage} <span className="mx-1 text-slate-200">/</span> {totalPages}
                   </span>
                   <button 
                    disabled={currentPage === totalPages}
                    onClick={() => paginate(currentPage + 1)}
                    className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
                   >
                    <ChevronRight size={14} />
                   </button>
                </div>
              )}
            </div>

            {/* LIST AREA - No Scrollbar */}
            <div className="flex-1 px-8 py-4 overflow-hidden">
              {medicines.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 auto-rows-min">
                  <AnimatePresence mode="popLayout">
                    {currentMedicines.map((med, idx) => (
                      <motion.div
                        key={med._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.02 }}
                        className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center justify-between group hover:border-[#009688]/30 hover:bg-white transition-all duration-300 shadow-sm"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-white text-[#009688] flex items-center justify-center border border-slate-100 shadow-sm group-hover:bg-[#009688] group-hover:text-white transition-colors shrink-0">
                            <Pill size={18} />
                          </div>
                          <div className="truncate">
                            <h3 className="font-black text-slate-800 truncate uppercase tracking-tight text-[11px]">
                              {med.medicineName}
                            </h3>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                              Refill: {new Date(med.refillDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${
                          med.status.toLowerCase() === 'active' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                          {med.status}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-30">
                  <Pill size={40} className="mb-2" />
                  <p className="text-[10px] font-black uppercase">No Active Data</p>
                </div>
              )}
            </div>

            <div className="p-6 text-center border-t border-slate-50">
               <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Total of {medicines.length} clinical entries found</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
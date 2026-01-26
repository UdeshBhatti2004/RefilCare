"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  UserPlus,
  User,
  Phone,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default function NewPatientPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🇮🇳 Indian phone validation
  const isValidIndianPhone = (value: string) =>
    /^[6-9]\d{9}$/.test(value);

  const handlePhoneChange = (value: string) => {
    // allow digits only
    if (!/^\d*$/.test(value)) return;

    setPhone(value);

    if (!value) {
      setPhoneError("");
    } else if (!isValidIndianPhone(value)) {
      setPhoneError("Enter a valid 10-digit Indian mobile number");
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = async () => {
    if (!isValidIndianPhone(phone)) {
      setPhoneError("Enter a valid 10-digit Indian mobile number");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/patients", {
        name,
        phone,
      });
      router.push("/patient");
    } catch (error) {
      console.error(error);
      alert("Failed to create patient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#F8FAFC] overflow-hidden">
      {/* HEADER */}
      <div className="w-full border-b border-slate-200 px-6 py-4 lg:px-10 flex-shrink-0">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-[1400px] mx-auto w-full flex items-center justify-between"
        >
          <Link
            href="/patient"
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#009688] transition-colors"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Directory
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#009688] rounded-full animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Registration Terminal
            </span>
          </div>
        </motion.div>
      </div>

      {/* MAIN */}
      <main className="flex-1 w-full flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg bg-white border border-slate-200 rounded-[2rem] p-6 lg:p-10 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#009688]/20" />

          {/* HEADER */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="h-12 w-12 bg-[#009688]/10 rounded-xl flex items-center justify-center mb-3">
              <UserPlus size={22} className="text-[#009688]" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase">
              New Registration
            </h1>
            <p className="text-slate-400 text-[10px] font-bold mt-0.5 uppercase tracking-tight">
              Initialize encrypted patient profile
            </p>
          </div>

          {/* FORM */}
          <div className="space-y-4">
            {/* NAME */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Full Name
              </label>
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Ramesh Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-[#009688]/5 focus:border-[#009688] outline-none"
                />
              </div>
            </div>

            {/* PHONE */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Primary Phone
              </label>
              <div className="relative group">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={16}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) =>
                    handlePhoneChange(e.target.value)
                  }
                  className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-xl text-sm font-bold outline-none transition-all ${
                    phoneError
                      ? "border-red-400 focus:ring-red-100"
                      : "border-slate-200 focus:ring-[#009688]/5 focus:border-[#009688]"
                  }`}
                />
              </div>

              {phoneError && (
                <p className="text-[10px] text-red-500 font-semibold ml-1">
                  {phoneError}
                </p>
              )}
            </div>

            {/* SUBMIT */}
            <button
              onClick={handleSubmit}
              disabled={
                loading ||
                !name ||
                !isValidIndianPhone(phone)
              }
              className="w-full mt-2 bg-slate-900 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                "Finalize Profile"
              )}
            </button>
          </div>

          {/* FOOTER */}
          <div className="mt-6 flex items-center justify-center gap-2 pt-5 border-t border-slate-50">
            <ShieldCheck size={12} className="text-[#009688]" />
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Authorized Entry
            </span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

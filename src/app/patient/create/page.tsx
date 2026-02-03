"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  User,
  Phone,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Send,
} from "lucide-react";
import Link from "next/link";

export default function NewPatientPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdPatient, setCreatedPatient] = useState<any>(null);
  const [telegramLink, setTelegramLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isValidIndianPhone = (value: string) => /^[6-9]\d{9}$/.test(value);

  const handlePhoneChange = (value: string) => {
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
      const response = await axios.post("/api/patients", { name, phone });
      setCreatedPatient(response.data.patient);
      setTelegramLink(response.data.telegramLink);
    } catch (error) {
      console.error(error);
      alert("Failed to create patient");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(telegramLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted) return null;

  if (createdPatient && telegramLink) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-[#F8FAFC]">
        <div className="w-full border-b border-slate-200 px-6 py-4 lg:px-10 shrink-0 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between">
            <Link
              href="/patient"
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#009688] transition-colors"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Directory
            </Link>
          </div>
        </div>

        <main className="flex-1 w-full flex items-start sm:items-center justify-center p-4 sm:p-6 lg:p-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-white border border-slate-200 rounded-[2rem] p-6 lg:p-10 shadow-xl shadow-slate-200/50"
          >
            <div className="flex flex-col items-center text-center mb-8">
              <div className="h-16 w-16 bg-[#009688] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-teal-100">
                <CheckCircle2 size={32} className="text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter uppercase">
                Patient Registered
              </h1>
              <p className="text-slate-400 text-[10px] sm:text-xs font-bold mt-1 uppercase tracking-tight">
                {createdPatient.name} • {createdPatient.phone}
              </p>
            </div>

            <div className="bg-[#009688]/5 border-2 border-[#009688]/10 rounded-[1.5rem] p-5 sm:p-8 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Send size={16} className="text-[#009688]" />
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                  Telegram Reminders
                </h3>
              </div>

              <p className="text-xs text-slate-600 font-semibold mb-6 leading-relaxed">
                To enable automated reminders, share this secure activation link.
                The patient must tap <b className="text-[#009688]">START</b> once redirected.
              </p>

              <div className="bg-white rounded-xl p-4 border border-slate-200 mb-6 group transition-all hover:border-[#009688]/30">
                <code className="text-[10px] sm:text-xs font-mono text-[#009688] break-all block">
                  {telegramLink}
                </code>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-[0.98]"
                >
                  <Copy size={14} />
                  {copied ? "Copied to Clipboard" : "Copy Secure Link"}
                </button>

                <Link
                  href={telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#009688] text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#00796B] transition-all active:scale-[0.98] shadow-md shadow-teal-900/10"
                >
                  <Send size={14} />
                  Open Telegram
                </Link>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 border-t border-slate-100 pt-6">
              <Link
                href="/patient"
                className="flex-1 bg-slate-50 text-slate-500 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all text-center border border-slate-100"
              >
                Return to Directory
              </Link>
              <Link
                href="/patient/create"
                onClick={() => setCreatedPatient(null)}
                className="flex-1 bg-white text-[#009688] py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 border-[#009688]/20 hover:bg-teal-50 transition-all text-center"
              >
                Register Another
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#F8FAFC]">
      <div className="w-full border-b border-slate-200 px-6 py-4 lg:px-10 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-[1400px] mx-auto w-full flex items-center justify-between"
        >
          <Link
            href="/patient"
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#009688] transition-colors"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
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

      <main className="flex-1 w-full flex items-start sm:items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-10 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#009688] to-emerald-400" />

          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-14 w-14 bg-[#009688]/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UserPlus size={24} className="text-[#009688]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter uppercase">
              New Registration
            </h1>
            <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-tight">
              Initialize secure patient profile
            </p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Full Name
              </label>
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#009688] transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Patient Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[#009688]/5 focus:border-[#009688] outline-none transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Primary Phone
              </label>
              <div className="relative group">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#009688] transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl text-sm font-bold outline-none transition-all placeholder:text-slate-300 ${
                    phoneError
                      ? "border-red-400 focus:ring-red-100"
                      : "border-slate-200 focus:ring-[#009688]/5 focus:border-[#009688]"
                  }`}
                />
              </div>
              {phoneError && (
                <p className="text-[10px] text-red-500 font-bold ml-1 animate-in fade-in slide-in-from-top-1">
                  {phoneError}
                </p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !name || !isValidIndianPhone(phone)}
              className="w-full mt-4 bg-slate-900 text-white py-4.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-slate-200"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing Terminal...
                </span>
              ) : (
                "Finalize Profile"
              )}
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 pt-6 border-t border-slate-50">
            <ShieldCheck size={14} className="text-[#009688]" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Secure Clinical Entry
            </span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
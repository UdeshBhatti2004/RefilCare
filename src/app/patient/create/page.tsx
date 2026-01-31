"use client";

import axios from "axios";
import { useState } from "react";
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

  // New states for Telegram link
  const [createdPatient, setCreatedPatient] = useState<any>(null);
  const [telegramLink, setTelegramLink] = useState("");
  const [copied, setCopied] = useState(false);

  // 🇮🇳 Indian phone validation
  const isValidIndianPhone = (value: string) => /^[6-9]\d{9}$/.test(value);

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
      const response = await axios.post("/api/patients", {
        name,
        phone,
      });

      // Store the created patient and Telegram link
      setCreatedPatient(response.data.patient);
      setTelegramLink(response.data.telegramLink);
    } catch (error) {
      console.error(error);
      alert("Failed to create patient");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(telegramLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Show success screen after patient is created
  if (createdPatient && telegramLink) {
    return (
      <div className="h-screen w-full flex flex-col bg-[#F8FAFC] overflow-hidden">
        {/* HEADER */}
        <div className="w-full border-b border-slate-200 px-6 py-4 lg:px-10 flex-shrink-0">
          <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between">
            <Link
              href="/patient"
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#009688] transition-colors"
            >
              <ArrowLeft
                size={14}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Back to Directory
            </Link>
          </div>
        </div>

        {/* SUCCESS SCREEN */}
        <main className="flex-1 w-full flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-white border border-slate-200 rounded-[2rem] p-6 lg:p-10 shadow-lg relative overflow-hidden"
          >
            {/* Success Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="h-16 w-16 bg-[#009688] rounded-2xl flex items-center justify-center mb-4">
                <CheckCircle2 size={32} className="text-white" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
                Patient Registered
              </h1>
              <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-tight">
                {createdPatient.name} • {createdPatient.phone}
              </p>
            </div>

            {/* Telegram Link Section */}
            <div className="bg-[#009688]/5 border-2 border-[#009688]/20 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Send size={16} className="text-[#009688]" />
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                  Enable Telegram Reminders
                </h3>
              </div>

              <p className="text-xs text-slate-600 font-semibold mb-4">
                To enable Telegram refill reminders, please ensure the patient
                has Telegram installed and is logged in. Share this link with
                the patient and ask them to tap <b>START</b> once in Telegram.
              </p>

              {/* Link Display */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 mb-4">
                <code className="text-xs font-mono text-[#009688] break-all">
                  {telegramLink}
                </code>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-[0.98]"
                >
                  <Copy size={14} />
                  {copied ? "Copied!" : "Copy Link"}
                </button>

                <Link
                  href={telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#009688] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#00796B] transition-all active:scale-[0.98]"
                >
                  <Send size={14} />
                  Open Telegram
                </Link>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-slate-50 rounded-xl p-5 mb-6">
              <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">
                Next Steps:
              </h4>
              <ol className="space-y-2 text-xs text-slate-600 font-semibold">
                <li className="flex gap-2">
                  <span className="text-[#009688] font-black">1.</span>
                  Ensure {createdPatient.name} has a Telegram account and is
                  logged in
                </li>
                <li className="flex gap-2">
                  <span className="text-[#009688] font-black">2.</span>
                  Share the activation link with the patient
                </li>
                <li className="flex gap-2">
                  <span className="text-[#009688] font-black">3.</span>
                  Patient opens the link and taps <b>START</b> in Telegram
                </li>
                <li className="flex gap-2">
                  <span className="text-[#009688] font-black">4.</span>
                  Refill reminders will be sent automatically
                </li>
              </ol>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3">
              <Link
                href="/patient"
                className="flex-1 bg-slate-100 text-slate-900 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all text-center"
              >
                View All Patients
              </Link>
              <Link
                href="/patient/create"
                className="flex-1 bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all text-center"
              >
                Add Another
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // Original form (before creation)
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
                  onChange={(e) => handlePhoneChange(e.target.value)}
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
              disabled={loading || !name || !isValidIndianPhone(phone)}
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

"use client";

import { motion, Variants } from "framer-motion";
import { Activity, ShieldCheck, HeartPulse, Shield, Plus } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    },
  };

  return (
    /* The combination of w-screen and negative margins (vw) 
       forces the footer to break out of any parent containers.
    */
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-white border-t border-slate-100 overflow-hidden"
    >
      {/* Edge-to-Edge Animated Accent Line */}
      <motion.div 
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#009688] to-transparent origin-center"
      />

      {/* Increased padding for the ultra-wide look */}
      <div className="w-full px-8 lg:px-20 py-12">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
          
          {/* Brand Identity */}
          <motion.div variants={itemVariants} className="flex flex-col gap-3 min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-[#009688] rounded-xl flex items-center justify-center">
                <Plus className="text-white" size={22} strokeWidth={3} />
              </div>
              <div>
                <span className="text-xl font-black uppercase tracking-tighter text-slate-900 block leading-none">
                  RefillCare
                </span>
                <span className="text-[10px] font-black text-[#009688] tracking-[0.3em] uppercase">
                  Clinical Portal
                </span>
              </div>
            </div>
          </motion.div>

          {/* Central Quote (Wide spacing) */}
          <motion.div variants={itemVariants} className="flex-1 flex justify-center lg:max-w-3xl">
            <div className="relative px-10 text-center">
              <span className="absolute -top-6 left-0 text-7xl text-[#009688]/10 font-serif leading-none">“</span>
              <p className="text-base md:text-lg font-bold text-slate-600 italic leading-relaxed tracking-tight">
                Empowering healthcare providers through precision synchronization, 
                ensuring that every patient receives the right care, at the right time, 
                without interruption.
              </p>
              <span className="absolute -bottom-12 right-0 text-7xl text-[#009688]/10 font-serif leading-none">”</span>
            </div>
          </motion.div>

          {/* Trust Pillars */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-end gap-10 w-full lg:w-auto">
            {[
              { icon: ShieldCheck, label: "Security", sub: "AES-256 Encrypted" },
              { icon: Activity, label: "Uptime", sub: "99.9% Reliable" },
              { icon: Shield, label: "Compliance", sub: "HIPAA Certified" }
            ].map((pillar, idx) => (
              <div key={idx} className="flex flex-col items-end gap-1">
                <pillar.icon className="text-[#009688] mb-1" size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{pillar.label}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">{pillar.sub}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Full Width Divider */}
        <motion.div 
          variants={itemVariants}
          className="mt-16 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8"
        >
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
               {[1,2,3,4].map((i) => (
                 <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
                    <div className="h-full w-full bg-gradient-to-br from-[#009688]/10 to-[#009688]/30" />
                 </div>
               ))}
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Standardized across 500+ Healthcare Facilities
            </span>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
                Network Status: Operational
              </span>
            </div>
            <div className="h-5 w-px bg-slate-200 hidden md:block" />
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              © {currentYear} RefillCare
            </span>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
"use client";

import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Mail,
  Lock,
  Building2,
  Sparkles,
  ShieldCheck,
  Bell,
  ChevronRight,
  Plus,
  Eye,
  EyeOff,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      await axios.post("/api/pharmacy/register", { name, email, password });
      toast.success("Account created successfully");
      router.push("/dashboard");
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast.error("Account already exists. Please login.");
      } else {
        toast.error("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden bg-white selection:bg-blue-100 selection:text-blue-900">
      
      <motion.div
        initial={false}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex flex-col justify-center px-20 bg-linear-to-br from-[#eef6ff] via-[#f7fbff] to-white"
      >
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-11 w-11 bg-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Plus className="text-white" size={22} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              RefilCare
            </span>
          </div>

          <h1 className="text-4xl font-semibold text-slate-900 leading-snug mb-5">
            Smarter refill care,
            <br />
            <span className="text-blue-600">better patient health.</span>
          </h1>

          <p className="text-slate-600 text-lg max-w-sm leading-relaxed">
            Automate medicine refills, reduce missed doses, and improve patient
            adherence.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Bell className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="font-semibold text-slate-800">
                Automatic reminders
              </p>
              <p className="text-sm text-slate-500">
                Patients never miss refills
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Sparkles className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="font-semibold text-slate-800">
                Smart refill tracking
              </p>
              <p className="text-sm text-slate-500">
                Monitor medicines effortlessly
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <ShieldCheck className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="font-semibold text-slate-800">
                Secure & reliable
              </p>
              <p className="text-sm text-slate-500">
                Privacy-first architecture
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      
      <main className="flex items-center justify-center h-full p-6 md:p-12">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Create Provider Account
          </h2>
          <p className="text-slate-500 mt-2 mb-8">
            Sign up to manage your pharmacy with RefilCare.
          </p>

          
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all active:scale-[0.98] mb-8 shadow-sm"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
              alt="Google"
            />
            <span className="text-sm font-semibold text-slate-700">
              Continue with Google
            </span>
          </button>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                type="text"
                placeholder="Pharmacy Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3.5 outline-none"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                type="email"
                placeholder="Business Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3.5 outline-none"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-12 py-3.5 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-sm shadow-blue-600/10 hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? "Please wait..." : <>Create Account <ChevronRight size={18} /></>}
            </motion.button>
          </form>

          <p className="text-center text-slate-500 mt-8 text-sm font-medium">
            Member already?{" "}
            <Link href="/login" className="text-blue-600 font-bold hover:text-blue-700">
              Log in here
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

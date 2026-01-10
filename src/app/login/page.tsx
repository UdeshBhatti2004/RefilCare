"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  Plus,
  Bell,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const toastId = toast.loading("Logging in...");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    toast.dismiss(toastId);
    setLoading(false);

    if (res?.error) {
      toast.error("Invalid email or password");
      return;
    }

    toast.success("Logged in successfully");
    router.push("/dashboard");
  };

  
  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden bg-white">
      {/* LEFT SIDE */}
      <motion.div
        initial={false}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex flex-col justify-center px-20
                   bg-linear-to-br from-[#eef6ff] via-[#f7fbff] to-white"
      >
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-11 w-11 bg-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Plus className="text-white" size={22} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              RefilCare
            </span>
          </div>

          <h1 className="text-4xl font-semibold text-slate-900 leading-snug mb-5">
            Welcome back,
            <br />
            <span className="text-blue-600">continue caring.</span>
          </h1>

          <p className="text-slate-600 text-lg max-w-sm leading-relaxed">
            Continue managing your pharmacy operations with confidence.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Bell className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="font-semibold text-slate-800">
                Active workflows
              </p>
              <p className="text-sm text-slate-500">
                Your schedules stay in sync
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Sparkles className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="font-semibold text-slate-800">
                Your workspace
              </p>
              <p className="text-sm text-slate-500">
                Patients & medicines at a glance
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <ShieldCheck className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="font-semibold text-slate-800">
                Secure access
              </p>
              <p className="text-sm text-slate-500">
                Your data stays protected
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      
      <main className="flex items-center justify-center h-full p-6 md:p-12">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Log in to your account
          </h2>
          <p className="text-slate-500 mt-2 mb-8">
            Access your RefilCare dashboard.
          </p>

          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 py-3
                       border border-slate-200 rounded-2xl
                       hover:bg-slate-50 transition-all
                       active:scale-[0.98] mb-8 shadow-sm"
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

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={18}
              />
              <input
                type="email"
                placeholder="Business Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl
                           pl-11 pr-4 py-3.5 outline-none"
              />
            </div>

            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                 value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl
                           pl-11 pr-12 py-3.5 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl
                         font-bold shadow-sm shadow-blue-600/10
                         hover:bg-blue-700 transition-all
                         disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? "Signing in..." : <>Log In <ChevronRight size={18} /></>}
            </motion.button>
          </form>

          <p className="text-center text-slate-500 mt-8 text-sm font-medium">
            New to RefilCare?{" "}
            <Link
              href="/register"
              className="text-blue-600 font-bold hover:text-blue-700"
            >
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

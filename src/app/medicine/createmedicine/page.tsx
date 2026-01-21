"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Pill,
  User,
  Calendar,
  Activity,
  Hash,
  ClipboardList,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import toast from "react-hot-toast";

type Patient = {
  _id: string;
  name: string;
};

type Condition = "BP" | "Diabetes" | "Thyroid" | "Other";

export default function NewMedicinePage() {
  const router = useRouter();

  // ✅ ONLY ADDITION (patientId from URL)
  const searchParams = useSearchParams();
  const patientIdFromUrl = searchParams.get("patientId");

  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientId, setPatientId] = useState(patientIdFromUrl || "");

  const [medicineName, setMedicineName] = useState("");
  const [condition, setCondition] = useState<Condition | "">("");
  const [otherCondition, setOtherCondition] = useState("");

  const [dosagePerDay, setDosagePerDay] = useState("");
  const [tabletsGiven, setTabletsGiven] = useState("");
  const [startDate, setStartDate] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("/api/patients").then((res) => {
      setPatients(res.data);
    });
  }, []);

  const handleSubmit = async () => {
    if (
      !patientId ||
      !medicineName ||
      !condition ||
      !dosagePerDay ||
      !tabletsGiven ||
      !startDate
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (condition === "Other" && !otherCondition.trim()) {
      toast.error("Please specify the condition");
      return;
    }

    try {
      setLoading(true);

      await axios.post("/api/medicines", {
        patientId,
        medicineName:
          condition === "Other"
            ? `${medicineName} (${otherCondition})`
            : medicineName,
        condition,
        dosagePerDay: Number(dosagePerDay),
        tabletsGiven: Number(tabletsGiven),
        startDate,
      });

      toast.success("Medicine created successfully");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to create medicine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-10 lg:pt-10 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 mt-10"
      >
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition"
        >
          <ChevronLeft size={16} />
          Back
        </button>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <Pill size={26} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">
              Create Medicine
            </h1>
          </div>
          <p className="text-slate-500">
            Add medicine details and automatically calculate refill schedules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-start">
          {/* LEFT SECTION */}
          <div className="xl:col-span-2 space-y-8">
            {/* Patient & Medicine */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase text-slate-700 mb-6">
                <User size={16} className="text-blue-500" />
                Patient & Medicine
              </h2>

              <div className="space-y-5">
                {/* Patient */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Patient
                  </label>
                  <select
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="">Select patient</option>
                    {patients.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Medicine Name */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Medicine Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Metformin"
                      value={medicineName}
                      onChange={(e) => setMedicineName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  {/* Condition */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Condition
                    </label>
                    <select
                      value={condition}
                      onChange={(e) => {
                        setCondition(e.target.value as Condition);
                        if (e.target.value !== "Other") setOtherCondition("");
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="">Select condition</option>
                      <option value="BP">Blood Pressure</option>
                      <option value="Diabetes">Diabetes</option>
                      <option value="Thyroid">Thyroid</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {condition === "Other" && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <label className="block text-sm font-semibold mb-2">
                      Specify Condition
                    </label>
                    <input
                      type="text"
                      placeholder="Enter condition name"
                      value={otherCondition}
                      onChange={(e) => setOtherCondition(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Dosage */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase text-slate-700 mb-6">
                <ClipboardList size={16} className="text-blue-500" />
                Dosage & Schedule
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Dosage / Day
                  </label>
                  <input
                    type="text"
                    value={dosagePerDay}
                    onChange={(e) => setDosagePerDay(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Tablets Given
                  </label>
                  <input
                    type="text"
                    value={tabletsGiven}
                    onChange={(e) => setTabletsGiven(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR — REFILL PREVIEW (UNCHANGED) */}
          <div className="space-y-6 xl:sticky xl:top-24">
            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-lg font-bold mb-4">Refill Preview</h3>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-xs uppercase text-blue-100 mb-1">
                  Estimated Duration
                </p>
                <p className="text-2xl font-bold">
                  {dosagePerDay && tabletsGiven
                    ? Math.floor(
                        Number(tabletsGiven) / Number(dosagePerDay)
                      )
                    : "--"}{" "}
                  days
                </p>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Creating..." : "Create Medicine"}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

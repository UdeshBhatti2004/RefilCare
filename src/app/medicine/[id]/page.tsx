"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Pill,
  User,
  Calendar,
  Activity,
  ChevronLeft,
} from "lucide-react";

type Medicine = {
  _id: string;
  medicineName: string;
  condition: string;
  dosagePerDay: number;
  tabletsGiven: number;
  startDate: string;
  refillDate: string;
  status: string;
  patientId: {
    name: string;
  };
};

export default function MedicineDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/medicines/${id}`)
      .then((res) => setMedicine(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading medicine...
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Medicine not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 sm:px-6 lg:px-10 xl:px-16 py-10">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 mb-8"
      >
        <ChevronLeft size={18} />
        Back to Medicines
      </button>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 max-w-3xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {medicine.medicineName}
            </h1>
            <p className="text-slate-500">{medicine.condition}</p>
          </div>

          <span
            className={`text-xs font-bold px-4 py-1 rounded-full
              ${
                medicine.status === "active"
                  ? "bg-green-100 text-green-700"
                  : medicine.status === "stopped"
                  ? "bg-red-100 text-red-600"
                  : "bg-slate-200 text-slate-600"
              }
            `}
          >
            {medicine.status}
          </span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-slate-700">
          <div className="flex items-center gap-3">
            <User size={18} className="text-blue-500" />
            <span>{medicine.patientId.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <Activity size={18} className="text-blue-500" />
            {medicine.dosagePerDay} per day
          </div>

          <div className="flex items-center gap-3">
            <Pill size={18} className="text-blue-500" />
            {medicine.tabletsGiven} tablets
          </div>

          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-blue-500" />
            Start:{" "}
            {new Date(medicine.startDate).toLocaleDateString()}
          </div>

          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-blue-500" />
            Refill by:{" "}
            {new Date(medicine.refillDate).toLocaleDateString()}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

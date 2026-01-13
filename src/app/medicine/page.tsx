"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Pill,
  User,
  Calendar,
  ArrowRight,
  Plus,
} from "lucide-react";

type Medicine = {
  _id: string;
  medicineName: string;
  condition: string;
  status: "active" | "refilled" | "stopped";
  refillDate: string;
  patientId: {
    name: string;
  };
};

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/medicines")
      .then((res) => setMedicines(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 sm:px-6 lg:px-10 xl:px-16 py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Medicines
          </h1>
          <p className="text-slate-500 mt-1">
            Manage all active and past medicines
          </p>
        </div>

        <Link
          href="/medicine/createmedicine"
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl font-semibold shadow hover:bg-slate-800 transition"
        >
          <Plus size={18} />
          Add Medicine
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-slate-500">Loading medicines...</p>
      )}

      {/* Empty State */}
      {!loading && medicines.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
          <Pill size={40} className="mx-auto text-slate-400 mb-4" />
          <h3 className="font-semibold text-slate-800">
            No medicines added yet
          </h3>
          <p className="text-slate-500 mt-1">
            Start by adding your first medicine
          </p>
        </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {medicines.map((m) => (
          <motion.div
            key={m._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {m.medicineName}
                </h3>
                <p className="text-sm text-slate-500">
                  {m.condition}
                </p>
              </div>

              <span
                className={`text-xs font-bold px-3 py-1 rounded-full
                  ${
                    m.status === "active"
                      ? "bg-green-100 text-green-700"
                      : m.status === "stopped"
                      ? "bg-red-100 text-red-600"
                      : "bg-slate-200 text-slate-600"
                  }
                `}
              >
                {m.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <User size={14} />
                {m.patientId?.name}
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={14} />
                Refill by{" "}
                {new Date(m.refillDate).toLocaleDateString()}
              </div>
            </div>

            <Link
              href={`/medicine/${m._id}`}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:gap-3 transition-all"
            >
              View Details
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

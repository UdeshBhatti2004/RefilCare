"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Pill, User, Calendar, ArrowRight, Plus } from "lucide-react";
import toast from "react-hot-toast";

type Medicine = {
  _id: string;
  medicineName: string;
  condition: string;
  status: "active" | "missed" | "stopped";
  refillDate: string;
  patientId: {
    name: string;
  };
};

export default function MedicinesPage() {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter"); // today | upcoming | missed

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    let url = "/api/medicines";
    if (filter) {
      url += `?filter=${filter}`;
    }

    axios
      .get(url, { withCredentials: true })
      .then((res) => setMedicines(res.data))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 sm:px-6 lg:px-10 xl:px-16 py-16">

    
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Medicines
          </h1>
          <p className="text-slate-500 mt-1">
            {filter
              ? `Showing ${filter} medicines`
              : "Manage all active and past medicines"}
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

      
      {loading && (
        <p className="text-slate-500">
          Loading medicines...
        </p>
      )}

     
      {!loading && medicines.length === 0 && (
        <p className="text-slate-400">
          No medicines found
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {medicines.map((m) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const refillDate = new Date(m.refillDate);
          refillDate.setHours(0, 0, 0, 0);

          const isDue =
            m.status !== "stopped" &&
            refillDate.getTime() <= today.getTime();

          return (
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

                <div className="flex flex-col items-end">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full
                      ${
                        m.status === "active"
                          ? "bg-green-100 text-green-700"
                          : m.status === "missed"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-600"
                      }
                    `}
                  >
                    {m.status}
                  </span>

                  <div className="flex gap-2 mt-2">
                    {/* Refill */}
                    {isDue && m.status !== "stopped" && (
                      <button
                        onClick={async () => {
                          try {
                            await axios.patch(
                              `/api/medicines/${m._id}/status`,
                              { action: "refill" },
                            );

                            setMedicines((prev) =>
                              prev.map((med) =>
                                med._id === m._id
                                  ? { ...med, status: "active" }
                                  : med,
                              ),
                            );

                            toast.success("Medicine refilled");
                          } catch {
                            toast.error("Failed to refill medicine");
                          }
                        }}
                        className="text-xs px-3 py-1 border rounded text-blue-600 hover:bg-blue-50"
                      >
                        Refill
                      </button>
                    )}

                    {/* Resume */}
                    {m.status === "stopped" && (
                      <button
                        onClick={async () => {
                          try {
                            await axios.patch(
                              `/api/medicines/${m._id}/status`,
                              { action: "resume" },
                            );

                            setMedicines((prev) =>
                              prev.map((med) =>
                                med._id === m._id
                                  ? { ...med, status: "active" }
                                  : med,
                              ),
                            );

                            toast.success("Medicine restarted");
                          } catch (err: any) {
                            toast.error(
                              err?.response?.data?.message ||
                                "Failed to restart medicine",
                            );
                          }
                        }}
                        className="text-xs px-3 py-1 border rounded text-green-600 hover:bg-green-50"
                      >
                        Resume
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      onClick={async () => {
                        const ok = confirm(
                          "Delete this medicine? This cannot be undone.",
                        );
                        if (!ok) return;

                        try {
                          await axios.delete(
                            `/api/medicines/${m._id}`,
                          );

                          setMedicines((prev) =>
                            prev.filter(
                              (med) => med._id !== m._id,
                            ),
                          );

                          toast.success("Medicine deleted");
                        } catch (err: any) {
                          toast.error(
                            err?.response?.data?.message ||
                              "Cannot delete medicine",
                          );
                        }
                      }}
                      className="text-xs px-3 py-1 border rounded text-slate-500 hover:bg-slate-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
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
          );
        })}
      </div>
    </div>
  );
}

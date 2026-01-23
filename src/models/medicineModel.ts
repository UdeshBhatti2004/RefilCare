import mongoose from "mongoose";
import "@/models/patientModel";

export interface MedicineT {
  pharmacyId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;

  medicineName: string;
  condition: "BP" | "Diabetes" | "Thyroid" | "Other";

  dosagePerDay: number;
  tabletsGiven: number;

  startDate: Date;
  refillDate: Date;

  status: "active" | "refilled" | "stopped";

  createdAt?: Date;
  updatedAt?: Date;
}

const MedicineSchema = new mongoose.Schema<MedicineT>(
  {
    pharmacyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pharmacy",
      required: true,
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    medicineName: {
      type: String,
      required: true,
      trim: true,
    },

    condition: {
      type: String,
      enum: ["BP", "Diabetes", "Thyroid", "Other"],
      required: true,
    },

    dosagePerDay: {
      type: Number,
      required: true,
      min: 0.1,
    },

    tabletsGiven: {
      type: Number,
      required: true,
      min: 0,
    },

    startDate: {
      type: Date,
      required: true,
    },

    refillDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "missed", "refilled", "stopped"],
      default: "active",
    },
  },
  { timestamps: true },
);

const Medicine =
  mongoose.models.Medicine ||
  mongoose.model<MedicineT>("Medicine", MedicineSchema);

export default Medicine;

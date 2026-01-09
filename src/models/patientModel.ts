import mongoose from "mongoose";

export interface PatientT {
  pharmacyId: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const PatientSchema = new mongoose.Schema<PatientT>(
  {
    pharmacyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pharmacy",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Patient =
  mongoose.models.Patient ||
  mongoose.model<PatientT>("Patient", PatientSchema);

export default Patient;

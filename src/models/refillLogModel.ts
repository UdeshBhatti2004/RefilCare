import mongoose from "mongoose";

export interface RefillLogT {
  pharmacyId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  medicineId: mongoose.Types.ObjectId;

  refillDate: Date;
  tabletsGiven: number;

  createdAt?: Date;
}

const RefillLogSchema = new mongoose.Schema<RefillLogT>(
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

    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },

    refillDate: {
      type: Date,
      required: true,
    },

    tabletsGiven: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const RefillLog =
  mongoose.models.RefillLog ||
  mongoose.model<RefillLogT>("RefillLog", RefillLogSchema);

export default RefillLog;

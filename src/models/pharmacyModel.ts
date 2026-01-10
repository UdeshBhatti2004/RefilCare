import mongoose from "mongoose";

export interface PharmacyT {
  name: string;
  email: string;
  password: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const PharmacySchema = new mongoose.Schema<PharmacyT>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Pharmacy =
  mongoose.models.Pharmacy ||
  mongoose.model<PharmacyT>("Pharmacy", PharmacySchema);

export default Pharmacy;

import mongoose from "mongoose";

export interface PatientT {
  pharmacyId: mongoose.Types.ObjectId;
  name: string;
  phone: string; // stored as 91XXXXXXXXXX
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
      trim: true,
      match: [/^[1-9][0-9]{9,14}$/, "Invalid WhatsApp phone number"],
    },
  },
  { timestamps: true },
);

/**
 * 🔥 Auto-normalize phone number
 * Converts:
 *  - +91 7990496002
 *  - 7990496002
 * Into:
 *  - 917990496002
 */
PatientSchema.pre("save", async function () {
  if (!this.isModified("phone")) return;

  let phone = this.phone.replace(/\D/g, ""); // remove spaces, +, -

  // If 10-digit Indian number → prefix 91
  if (phone.length === 10) {
    phone = `91${phone}`;
  }

  this.phone = phone;
});

const Patient =
  mongoose.models.Patient || mongoose.model<PatientT>("Patient", PatientSchema);

export default Patient;

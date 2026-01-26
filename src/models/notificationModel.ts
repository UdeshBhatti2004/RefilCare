import mongoose, { Schema, Document } from "mongoose";

export interface NotificationT extends Document {
  pharmacyId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  medicineId: mongoose.Types.ObjectId;

  type: "upcoming" | "missed";
  message: string;

  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<NotificationT>(
  {
    pharmacyId: {
      type: Schema.Types.ObjectId,
      ref: "Pharmacy",
      required: true,
    },

    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    medicineId: {
      type: Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },

    type: {
      type: String,
      enum: ["upcoming", "missed", "today"],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Notification ||
  mongoose.model<NotificationT>("Notification", NotificationSchema);

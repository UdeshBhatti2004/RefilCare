import mongoose from "mongoose";
import connectDb from "./db";


import PatientSchema from "@/models/patientModel";
import MedicineSchema from "@/models/medicineModel";
import PharmacySchema from "@/models/pharmacyModel";
import RefillLogSchema from "@/models/refillLogModel";
import NotificationModel from "@/models/notificationModel";


export async function getModels() {
  await connectDb();
  
  return {
    Patient: mongoose.models.Patient || PatientSchema,
    Medicine: mongoose.models.Medicine || MedicineSchema,
    Pharmacy: mongoose.models.Pharmacy || PharmacySchema,
    RefillLog: mongoose.models.RefillLog || RefillLogSchema,
    Notification: mongoose.models.Notification || NotificationModel,
  };
}
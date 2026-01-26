import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Medicine from "@/models/medicineModel";
import Notification from "@/models/notificationModel";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import Patient from "@/models/patientModel";

function utcDay(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

export async function POST(req: NextRequest) {
  const key = req.headers.get("x-cron-key");

  if (
    process.env.NODE_ENV !== "development" &&
    key !== process.env.CRON_SECRET
  ) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDb();

  const today = utcDay(new Date());

  // 1️⃣ Find medicines that should be marked missed
  const medicinesToMiss = await Medicine.find({
    status: "active",
    refillDate: { $lt: today },
  });

  let missedCount = 0;
  let notificationCount = 0;

  for (const med of medicinesToMiss) {
    // 1️⃣ Mark medicine as missed
    med.status = "missed";
    await med.save();
    missedCount++;

    // 2️⃣ Check if notification already exists
    const exists = await Notification.findOne({
      pharmacyId: med.pharmacyId,
      medicineId: med._id,
      type: "missed",
    });

    if (exists) continue;

    // 3️⃣ Create notification
    await Notification.create({
      pharmacyId: med.pharmacyId,
      patientId: med.patientId,
      medicineId: med._id,
      type: "missed",
      message: `Missed refill for ${med.medicineName}`,
      read: false,
    });

    notificationCount++;

    // 4️⃣ Send WhatsApp message (🔥 NEW)
    const patient = await Patient.findById(med.patientId);
    if (!patient?.phone) continue;

    await sendWhatsAppMessage(
      patient.phone,
      `⚠️ RefillCare Alert

Hi ${patient.name},

Your medicine *${med.medicineName}* refill was missed.

Please visit the pharmacy to continue your treatment.

— RefillCare`,
    );
  }

  return NextResponse.json({
    message: "Missed cron executed",
    medicinesMarkedMissed: missedCount,
    notificationsCreated: notificationCount,
  });
}

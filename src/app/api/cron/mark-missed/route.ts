import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Medicine from "@/models/medicineModel";
import Notification from "@/models/notificationModel";
import Patient from "@/models/patientModel";
import { sendTelegramMessage } from "@/lib/telegram";

export async function GET(req: NextRequest) {
  // 🔐 Protect cron
  if (process.env.NODE_ENV !== "development") {
    const key = req.headers.get("x-cron-key");
    if (key !== process.env.CRON_SECRET) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  }

  await connectDb();

  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find medicines that are PAST refill date and still active
  const missedMedicines = await Medicine.find({
    status: "active",
    refillDate: { $lt: today },
  });

  console.log(`⚠️ Found ${missedMedicines.length} missed refills`);

  let marked = 0;
  let notified = 0;
  const results: any[] = [];

  for (const med of missedMedicines) {
    try {
      // Mark as missed
      med.status = "missed";
      await med.save();
      marked++;

      // Check if notification already exists
      const existingNotif = await Notification.findOne({
        pharmacyId: med.pharmacyId,
        medicineId: med._id,
        type: "missed",
      });

      if (existingNotif) {
        results.push({
          medicine: med.medicineName,
          status: "✅ Marked missed (notification exists)",
        });
        continue;
      }

      // Create missed notification
      await Notification.create({
        pharmacyId: med.pharmacyId,
        patientId: med.patientId,
        medicineId: med._id,
        type: "missed",
        message: `Missed refill for ${med.medicineName}`,
        read: false,
      });

      // Get patient and send Telegram reminder
      const patient = await Patient.findById(med.patientId);

      if (patient?.telegramChatId) {
        const daysLate = Math.floor(
          (now.getTime() - new Date(med.refillDate).getTime()) / (1000 * 60 * 60 * 24)
        );

        const message = `⚠️ <b>Missed Refill Alert</b>\n\nHello ${patient.name},\n\nYou missed the refill for "<b>${med.medicineName}</b>".\n\n📅 Due date was: ${new Date(med.refillDate).toLocaleDateString()}\n⏰ Days overdue: ${daysLate}\n\nPlease visit the pharmacy as soon as possible.\n\n📋 Condition: ${med.condition}`;

        await sendTelegramMessage(patient.telegramChatId, message);
        notified++;

        results.push({
          medicine: med.medicineName,
          patient: patient.name,
          daysLate,
          status: "✅ Marked missed & Telegram sent",
        });
      } else {
        results.push({
          medicine: med.medicineName,
          status: "✅ Marked missed (patient not on Telegram)",
        });
      }
    } catch (error: any) {
      results.push({
        medicine: med.medicineName,
        status: "❌ Error",
        error: error.message,
      });
      console.error(`Error processing missed refill for ${med.medicineName}:`, error);
    }
  }

  console.log(`📊 Summary: ${marked} marked, ${notified} Telegram sent`);

  return NextResponse.json({
    success: true,
    message: "Missed refills cron executed",
    medicinesMarked: marked,
    telegramSent: notified,
    totalMissed: missedMedicines.length,
    timestamp: new Date().toISOString(),
    results,
  });
}
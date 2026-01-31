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

  // Get today's date range (local timezone)
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  // Find medicines due TODAY
  const medicinesDueToday = await Medicine.find({
    status: "active",
    refillDate: {
      $gte: start,
      $lte: end,
    },
  });

  console.log(`📅 Found ${medicinesDueToday.length} medicines due today`);

  let sent = 0;
  let skipped = 0;
  const results: any[] = [];

  for (const med of medicinesDueToday) {
    try {
      // Check if notification sent in last hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentNotification = await Notification.findOne({
        pharmacyId: med.pharmacyId,
        medicineId: med._id,
        type: "upcoming",
        createdAt: { $gte: oneHourAgo },
      });

      if (recentNotification) {
        skipped++;
        results.push({
          medicine: med.medicineName,
          status: "⏭️ Skipped - already sent in last hour",
        });
        continue;
      }

      // Get patient
      const patient = await Patient.findById(med.patientId);
      
      if (!patient) {
        results.push({
          medicine: med.medicineName,
          status: "⚠️ Patient not found",
        });
        continue;
      }

      // Check if patient linked to Telegram
      if (!patient.telegramChatId) {
        results.push({
          medicine: med.medicineName,
          patient: patient.name,
          status: "⚠️ Patient not linked to Telegram",
        });
        continue;
      }

      // Send Telegram message
      const message = `🔔 <b>Medicine Refill Reminder</b>\n\nHello ${patient.name},\n\nYour medicine "<b>${med.medicineName}</b>" is due for refill today.\n\nPlease visit the pharmacy.\n\n📋 Condition: ${med.condition}\n💊 Dosage: ${med.dosagePerDay}/day`;
      
      await sendTelegramMessage(patient.telegramChatId, message);

      // Create notification in database
      await Notification.create({
        pharmacyId: med.pharmacyId,
        patientId: med.patientId,
        medicineId: med._id,
        type: "upcoming",
        message: `Refill due today for ${med.medicineName}`,
        read: false,
      });
      
      sent++;
      results.push({
        medicine: med.medicineName,
        patient: patient.name,
        status: "✅ Telegram message sent",
      });
      
    } catch (error: any) {
      results.push({
        medicine: med.medicineName,
        status: "❌ Error",
        error: error.message,
      });
      console.error(`Error sending reminder for ${med.medicineName}:`, error);
    }
  }

  console.log(`📊 Summary: ${sent} sent, ${skipped} skipped`);

  return NextResponse.json({
    success: true,
    message: "Today refill cron executed",
    messagesSent: sent,
    messagesSkipped: skipped,
    totalDueToday: medicinesDueToday.length,
    timestamp: new Date().toISOString(),
    results,
  });
}
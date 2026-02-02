import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Medicine from "@/models/medicineModel";
import Patient from "@/models/patientModel";
import { sendTelegramMessage } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  // 🔐 ALWAYS protect cron
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDb();

  // 📅 Get today's date range (keep as-is for now)
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  // 🔍 Find medicines due TODAY (exclude deleted)
  const medicinesDueToday = await Medicine.find({
    status: "active",
    deleted: { $ne: true },
    refillDate: {
      $gte: start,
      $lte: end,
    },
  });

  console.log(`📅 Found ${medicinesDueToday.length} medicines due today`);

  let sent = 0;
  let skipped = 0;

  for (const med of medicinesDueToday) {
    try {
      // 🛑 Prevent duplicate reminder on same day
      if (
        med.lastReminderSentAt &&
        med.lastReminderSentAt.toDateString() ===
          new Date().toDateString()
      ) {
        skipped++;
        continue;
      }

      const patient = await Patient.findById(med.patientId);
      if (!patient || !patient.telegramChatId) continue;

      const message = `💊 <b>Medicine Refill Reminder</b>

Hello ${patient.name},

Your medicine "<b>${med.medicineName}</b>" is due for refill today.

Please contact your pharmacy.

Thank you.`;

      await sendTelegramMessage(patient.telegramChatId, message);

      await Medicine.findByIdAndUpdate(med._id, {
        lastReminderSentAt: new Date(),
      });

      sent++;
    } catch (error) {
      console.error(
        `❌ Error sending reminder for ${med.medicineName}:`,
        error
      );
    }
  }

  console.log(`📊 Summary: ${sent} sent, ${skipped} skipped`);

  return NextResponse.json({
    ok: true,
    messagesSent: sent,
    messagesSkipped: skipped,
    timestamp: new Date().toISOString(),
  });
}

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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 🔍 Find MISSED medicines (exclude deleted)
  const missedMedicines = await Medicine.find({
    status: "active",
    deleted: { $ne: true },
    refillDate: { $lt: today },
  });

  console.log(`⚠️ Found ${missedMedicines.length} missed refills`);

  let notified = 0;

  for (const med of missedMedicines) {
    try {
      // 🔄 Mark as missed
      med.status = "missed";
      await med.save();

      const patient = await Patient.findById(med.patientId);
      if (!patient?.telegramChatId) continue;

      const message = `⚠️ <b>Missed Refill Alert</b>

Hello ${patient.name},

You missed the refill for "<b>${med.medicineName}</b>".

Please contact your pharmacy as soon as possible.`;

      await sendTelegramMessage(patient.telegramChatId, message);

      notified++;
    } catch (error) {
      console.error(
        `❌ Error processing missed refill for ${med.medicineName}:`,
        error
      );
    }
  }

  console.log(`📊 Missed refill notifications sent: ${notified}`);

  return NextResponse.json({
    ok: true,
    totalMissed: missedMedicines.length,
    telegramSent: notified,
    timestamp: new Date().toISOString(),
  });
}

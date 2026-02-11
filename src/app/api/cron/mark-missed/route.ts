import { NextRequest, NextResponse } from "next/server";
import { getModels } from "@/lib/model";
import { sendTelegramMessage } from "@/lib/telegram";

export async function GET(req: NextRequest) {
  console.log("[CRON] mark-missed triggered");
  const secret = req.headers.get("x-cron-secret");
  const userAgent = req.headers.get("user-agent");

  const isVercelCron = userAgent?.includes("vercel-cron");

  if (!isVercelCron && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { Medicine, Patient } = await getModels();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const missedMedicines = await Medicine.find({
    status: "active",
    deleted: { $ne: true },
    refillDate: { $lt: today },
  });

  let notified = 0;

  for (const med of missedMedicines) {
    try {
      med.status = "missed";
      await med.save();

      const patient = await Patient.findById(med.patientId);
      if (!patient?.telegramChatId) continue;

      const message = `⚠️ <b>Refill Reminder</b>

Hello ${patient.name},

This is a reminder regarding your medicine "<b>${med.medicineName}</b>", which was scheduled for refill.

If this has already been taken care of, you may ignore this message.

Otherwise, please contact us for further assistance.

Take care.`;


      await sendTelegramMessage(patient.telegramChatId, message);

      notified++;
    } catch (error) {
      console.error(
        `Error processing missed refill for ${med.medicineName}:`,
        error,
      );
    }
  }

  return NextResponse.json({
    ok: true,
    totalMissed: missedMedicines.length,
    telegramSent: notified,
    timestamp: new Date().toISOString(),
  });
}

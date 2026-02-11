import { NextRequest, NextResponse } from "next/server";
import { getModels } from "@/lib/model";
import { sendTelegramMessage } from "@/lib/telegram";

export async function GET(req: NextRequest) {
  console.log("[CRON] today-refils triggered");
  const secret = req.headers.get("x-cron-secret");
  const userAgent = req.headers.get("user-agent");

  const isVercelCron = userAgent?.includes("vercel-cron");

  if (!isVercelCron && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { Medicine, Patient } = await getModels();

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const medicinesDueToday = await Medicine.find({
    status: "active",
    deleted: { $ne: true },
    refillDate: {
      $gte: start,
      $lte: end,
    },
  });

  let sent = 0;
  let skipped = 0;

  for (const med of medicinesDueToday) {
    try {
      if (
        med.lastReminderSentAt &&
        med.lastReminderSentAt.toDateString() === new Date().toDateString()
      ) {
        skipped++;
        continue;
      }

      const patient = await Patient.findById(med.patientId);
      if (!patient || !patient.telegramChatId) continue;

      const message = `💊 <b>Medication Reminder</b>

Hello ${patient.name},

This is a friendly reminder that "<b>${med.medicineName}</b>" is due for refill today.

If you’ve already taken care of this, please disregard this message.

If not, we’re here to assist you whenever convenient.

Wishing you good health.`;

      await sendTelegramMessage(patient.telegramChatId, message);

      await Medicine.findByIdAndUpdate(med._id, {
        lastReminderSentAt: new Date(),
      });

      sent++;
    } catch (error) {
      console.error(` Error sending reminder for ${med.medicineName}:`, error);
    }
  }

  return NextResponse.json({
    ok: true,
    messagesSent: sent,
    messagesSkipped: skipped,
    timestamp: new Date().toISOString(),
  });
}

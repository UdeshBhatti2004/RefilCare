import { NextRequest, NextResponse } from "next/server";
import { getModels } from "@/lib/model";
import { sendTelegramMessage } from "@/lib/telegram";

export async function GET(req: NextRequest) {
  console.log("[CRON] upcoming-refils triggered");

  const secret = req.headers.get("x-cron-secret");
  const userAgent = req.headers.get("user-agent");

  const isVercelCron = userAgent?.includes("vercel-cron");

  if (!isVercelCron && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { Medicine, Patient, Notification } = await getModels();

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const twoDayStart = new Date(start);
  twoDayStart.setDate(start.getDate() + 2);

  const twoDayEnd = new Date(end);
  twoDayEnd.setDate(end.getDate() + 2);

  const medicinesUpcoming = await Medicine.find({
    status: "active",
    deleted: { $ne: true },
    refillDate: {
      $gte: twoDayStart,
      $lte: twoDayEnd,
    },
  });

  let sent = 0;
  let skipped = 0;

  for (const med of medicinesUpcoming) {
    try {
      if (
        med.lastUpcomingReminderSentAt &&
        med.lastUpcomingReminderSentAt.toDateString() ===
          new Date().toDateString()
      ) {
        skipped++;
        continue;
      }

      const patient = await Patient.findById(med.patientId);
      if (!patient || !patient.telegramChatId) continue;

      const message = `💊 <b>Upcoming Refill Reminder</b>

Hello ${patient.name},

This is a gentle reminder that "<b>${med.medicineName}</b>" will require a refill in two days.

We recommend arranging this in advance to ensure uninterrupted treatment.

If already planned, please disregard this message.

Wishing you continued good health.`;

      await sendTelegramMessage(patient.telegramChatId, message);

      await Notification.create({
        pharmacyId: med.pharmacyId,
        patientId: med.patientId,
        medicineId: med._id,
        title: "Upcoming Refill",
        message: `${med.medicineName} refill due in two days`,
        type: "upcoming",
        isRead: false,
      });

      await Medicine.findByIdAndUpdate(med._id, {
        lastUpcomingReminderSentAt: new Date(),
      });

      sent++;
    } catch (error) {
      console.error(
        `Error sending upcoming reminder for ${med.medicineName}:`,
        error
      );
    }
  }

  return NextResponse.json({
    ok: true,
    messagesSent: sent,
    messagesSkipped: skipped,
    timestamp: new Date().toISOString(),
  });
}

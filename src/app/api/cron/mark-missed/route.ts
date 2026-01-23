import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Medicine from "@/models/medicineModel";
import Notification from "@/models/notificationModel";


function utcDay(date: Date) {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    )
  );
}

export async function GET(req: NextRequest) {
  // ✅ DEV bypass (remove before production)
  if (process.env.NODE_ENV !== "development") {
    const key = req.headers.get("x-cron-key");
    if (key !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
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
    // 2️⃣ Mark medicine as missed
    med.status = "missed";
    await med.save();
    missedCount++;

    // 3️⃣ Check if missed notification already exists
    const exists = await Notification.findOne({
      pharmacyId: med.pharmacyId,
      medicineId: med._id,
      type: "missed",
    });

    if (!exists) {
      await Notification.create({
        pharmacyId: med.pharmacyId,
        patientId: med.patientId,
        medicineId: med._id,
        type: "missed",
        message: `Missed refill for ${med.medicineName}`,
        read: false,
      });

      notificationCount++;
    }
  }

  return NextResponse.json({
    message: "Missed cron executed",
    medicinesMarkedMissed: missedCount,
    notificationsCreated: notificationCount,
  });
}

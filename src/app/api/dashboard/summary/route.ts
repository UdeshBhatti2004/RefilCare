import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Medicine from "@/models/medicineModel";
import connectDb from "@/lib/db";


/// Normalize any date to UTC midnight (00:00:00 UTC) This avoids IST / local timezone drift completely
 


function utcDay(date: Date) {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    )
  );
}

export async function GET() {
  await connectDb();

  const session = await getServerSession(authOptions);
  if (!session?.user?.pharmacyId) {
    return NextResponse.json({
      today: 0,
      upcoming: 0,
      missed: 0,
    });
  }

  const today = utcDay(new Date());

  /// Fetch ALL medicines (no status filter)
  const medicines = await Medicine.find({
    pharmacyId: session.user.pharmacyId,
  }).lean();

  let todayCount = 0;
  let upcomingCount = 0;
  let missedCount = 0;

  medicines.forEach((m) => {
    const refillDate = utcDay(new Date(m.refillDate));

    if (refillDate.getTime() === today.getTime()) {
      todayCount++;
    } else if (refillDate.getTime() > today.getTime()) {
      upcomingCount++;
    } else {
      missedCount++;
    }
  });

  return NextResponse.json({
    today: todayCount,
    upcoming: upcomingCount,
    missed: missedCount,
  });
}

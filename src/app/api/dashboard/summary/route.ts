import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getModels } from "@/lib/model";

function utcDay(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

export async function GET() {
  try {
    const { Medicine } = await getModels();
    const session = await getServerSession(authOptions);
    if (!session?.user?.pharmacyId) {
      return NextResponse.json({
        today: 0,
        upcoming: 0,
        missed: 0,
      });
    }

    const today = utcDay(new Date());

    const medicines = await Medicine.find({
      pharmacyId: session.user.pharmacyId,
      deleted: { $ne: true },
    })
      .select("refillDate status")
      .limit(1000)
      .lean();

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
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      today: 0,
      upcoming: 0,
      missed: 0,
    });
  }
}

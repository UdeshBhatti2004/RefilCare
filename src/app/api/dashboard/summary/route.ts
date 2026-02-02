import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Medicine from "@/models/medicineModel";
import connectDb from "@/lib/db";

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
  try {
    console.log("1️⃣ Connecting to database...");
    await connectDb();
    console.log("2️⃣ Database connected");

    const session = await getServerSession(authOptions);
    if (!session?.user?.pharmacyId) {
      console.log("3️⃣ No session/pharmacyId");
      return NextResponse.json({
        today: 0,
        upcoming: 0,
        missed: 0,
      });
    }

    console.log("4️⃣ PharmacyId:", session.user.pharmacyId);
    const today = utcDay(new Date());

    console.log("5️⃣ Fetching medicines...");
    
    // Fetch with optimizations
    const medicines = await Medicine.find({
      pharmacyId: session.user.pharmacyId,
      deleted: { $ne: true }
    })
      .select("refillDate status") // Only get needed fields
      .limit(1000) // Max 1000 medicines
      .lean(); // Plain objects, faster

    console.log("6️⃣ Found", medicines.length, "medicines");

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

    console.log("7️⃣ Counts - Today:", todayCount, "Upcoming:", upcomingCount, "Missed:", missedCount);

    return NextResponse.json({
      today: todayCount,
      upcoming: upcomingCount,
      missed: missedCount,
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json({
      today: 0,
      upcoming: 0,
      missed: 0,
    });
  }
}
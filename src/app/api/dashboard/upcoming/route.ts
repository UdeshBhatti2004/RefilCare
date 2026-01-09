import connectDb from "@/lib/db";
import Medicine from "@/models/medicineModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { pharmacyId } = await req.json();

    if (!pharmacyId) {
      return NextResponse.json(
        { message: "pharmacyId is not found" },
        { status: 400 }
      );
    }

    const toadayEnd = new Date();
    toadayEnd.setHours(23, 59, 59, 999);

    const next3days = new Date();
    next3days.setDate(next3days.getDate() + 3);
    next3days.setHours(23, 59, 59, 999);

    const medicines = await Medicine.find({
      pharmacyId,
      status: "active",
      refillDate: {
        $gt: toadayEnd, // after today
        $lte: next3days, // within 3 days
      },
    });


      return NextResponse.json(
      medicines.map((m) => m.toObject()),
      { status: 200 }
    );

  } catch (error) {
    console.error("Upcoming dashboard error", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

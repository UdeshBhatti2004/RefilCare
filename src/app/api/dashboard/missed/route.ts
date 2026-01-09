import connectDb from "@/lib/db";
import Medicine from "@/models/medicineModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { pharmacyId } = await req.json();

    if (!pharmacyId) {
      return NextResponse.json(
        { message: "PharmacyId is not found" },
        { status: 400 }
      );
    }

    const startofToday = new Date();
    startofToday.setHours(0, 0, 0, 0);

    // Medicines whose refill date is before today

    const medicines = await Medicine.find({
      pharmacyId,
      status: "active",
      refillDate: { $lt: startofToday },
    });

    return NextResponse.json(
        medicines.map((m)=>m.toObject()),
        {status:200}
    )

  } catch (error) {
      console.error("Missed dashboard error", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

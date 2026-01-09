import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Medicine from "@/models/medicineModel";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { pharmacyId } = await req.json();

    if (!pharmacyId) {
      return NextResponse.json(
        { message: "pharmacyId is required" },
        { status: 400 }
      );
    }

    // Get today's date as YYYY-MM-DD (UTC-safe)
    const today = new Date().toISOString().split("T")[0];

    const medicines = await Medicine.find({
      pharmacyId,
      status: "active",
      $expr: {
        $eq: [
          { $dateToString: { format: "%Y-%m-%d", date: "$refillDate" } },
          today,
        ],
      },
    });

    return NextResponse.json(
      medicines.map((m) => m.toObject()),
      { status: 200 }
    );
  } catch (error) {
    console.error("Today dashboard error", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

import connectDb from "@/lib/db";
import Medicine from "@/models/medicineModel";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    /// pharmacy from session
    const token = await getToken({ req });

    if (!token?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const pharmacyId = token.id;

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const next3days = new Date();
    next3days.setDate(next3days.getDate() + 3);
    next3days.setHours(23, 59, 59, 999);

    const medicines = await Medicine.find({
      pharmacyId,
      status: "active",
      refillDate: {
        $gt: todayEnd,
        $lte: next3days,
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

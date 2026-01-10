import connectDb from "@/lib/db";
import Medicine from "@/models/medicineModel";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    /// getting pharmacy from logged-in session
    const token = await getToken({ req });

    if (!token?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const pharmacyId = token.id; 

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const medicines = await Medicine.find({
      pharmacyId,
      status: "active",
      refillDate: { $lt: startOfToday },
    });

    return NextResponse.json(
      medicines.map((m) => m.toObject()),
      { status: 200 }
    );
  } catch (error) {
    console.error("Missed dashboard error", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

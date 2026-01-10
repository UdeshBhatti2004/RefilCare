import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Medicine from "@/models/medicineModel";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    /// getting pharmacy from session
    const token = await getToken({ req });

    if (!token?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const pharmacyId = token.id; 

    /// Get today's date as YYYY-MM-DD
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

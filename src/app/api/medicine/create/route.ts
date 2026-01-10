// NOTE:
// We do NOT take refillDate and status from the request.
// - refillDate is calculated here on the backend
// - status is set by the system (default: "active")
// This keeps the data correct and avoids wrong values from the client.

import connectDb from "@/lib/db";
import Medicine from "@/models/medicineModel";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    /// getting logged-in pharmacy from session
    const token = await getToken({ req });

    if (!token?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const pharmacyId = token.id; 

    const {
      patientId,
      medicineName,
      condition,
      dosagePerDay,
      tabletsGiven,
      startDate,
    } = await req.json();

    if (
      !patientId ||
      !medicineName ||
      !condition ||
      !dosagePerDay ||
      !tabletsGiven ||
      !startDate
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // core logic
    const totalDays = tabletsGiven / dosagePerDay;
    const refillDate = new Date(startDate);
    refillDate.setDate(refillDate.getDate() + Math.ceil(totalDays));

    const medicine = await Medicine.create({
      pharmacyId, // ✅ correct
      patientId,
      medicineName,
      condition,
      dosagePerDay,
      tabletsGiven,
      startDate,
      refillDate,
    });

    return NextResponse.json(
      {
        message: "Medicine created successfully",
        medicine: medicine.toObject(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in creating medicine", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

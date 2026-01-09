// NOTE:
// We do NOT take refillDate and status from the request.
// - refillDate is calculated here on the backend
// - status is set by the system (default: "active")
// This keeps the data correct and avoids wrong values from the client.

import connectDb from "@/lib/db";
import Medicine from "@/models/medicineModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const {
      pharmacyId,
      patientId,
      medicineName,
      condition,
      dosagePerDay,
      tabletsGiven,
      startDate,
    } = await req.json();

    if (
      !pharmacyId ||
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
      pharmacyId,
      patientId,
      medicineName,
      condition,
      dosagePerDay,
      tabletsGiven,
      startDate,
      refillDate,
      // status will default to "active" from schema
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

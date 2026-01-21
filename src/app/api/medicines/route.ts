import connectDb from "@/lib/db";
import Medicine from "@/models/medicineModel";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const token = await getToken({ req });

    if (!token?.pharmacyId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

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

    // refill date calculation
    const days = Math.floor(tabletsGiven / dosagePerDay);
    const refillDate = new Date(startDate);
    refillDate.setDate(refillDate.getDate() + days);

    const medicine = await Medicine.create({
      pharmacyId: token.pharmacyId,
      patientId,
      medicineName,
      condition,
      dosagePerDay,
      tabletsGiven,
      startDate,
      refillDate,
      status: "active",
    });

    return NextResponse.json(medicine.toObject(), { status: 201 });
  } catch (error) {
    console.error("Error creating medicine", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const token = await getToken({ req });
    if (!token?.pharmacyId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1️⃣ normalize legacy refilled → active
    await Medicine.updateMany(
      { pharmacyId: token.pharmacyId, status: "refilled" },
      { $set: { status: "active" } }
    );

    // 2️⃣ auto-mark missed
    await Medicine.updateMany(
      {
        pharmacyId: token.pharmacyId,
        status: "active",
        refillDate: { $lt: today },
      },
      { $set: { status: "missed" } }
    );

    // 3️⃣ return medicines
    const medicines = await Medicine.find({
      pharmacyId: token.pharmacyId,
    }).sort({ createdAt: -1 });

    return NextResponse.json(medicines);
  } catch (error) {
    console.error("GET medicines error", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}



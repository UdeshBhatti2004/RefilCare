import connectDb from "@/lib/db";
import Medicine from "@/models/medicineModel";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

function utcDay(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

export async function GET(req: NextRequest) {
  try {

    await connectDb();



    const token = await getToken({ req });
    
    if (!token?.pharmacyId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const pharmacyId = token.pharmacyId;


        const medicines = await Medicine.find({
      pharmacyId: pharmacyId,
      deleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .select("_id medicineName condition status refillDate patientId createdAt");
    



    return NextResponse.json(medicines);
  } catch (error) {
    console.error(" ERROR:", error);
    return NextResponse.json(
      { message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const token = await getToken({ req });
    if (!token?.pharmacyId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      patientId,
      medicineName,
      condition,
      dosagePerDay,
      tabletsGiven,
      startDate,
    } = body;

    if (
      !patientId ||
      !medicineName ||
      !condition ||
      !dosagePerDay ||
      !tabletsGiven ||
      !startDate
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const refillDate = new Date(startDate);
    const daysSupply = Math.floor(tabletsGiven / dosagePerDay);
    refillDate.setDate(refillDate.getDate() + daysSupply);

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

    return NextResponse.json(medicine, { status: 201 });
  } catch (error) {
    console.error("Error creating medicine:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
import connectDb from "@/lib/db";
import Medicine from "@/models/medicineModel";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";


function utcDay(date: Date) {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    )
  );
}

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const token = await getToken({ req });
    if (!token?.pharmacyId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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

    const days = Math.floor(tabletsGiven / dosagePerDay);

    const refillDate = new Date(startDate);
    refillDate.setUTCDate(refillDate.getUTCDate() + days);

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
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const token = await getToken({ req });
    if (!token?.pharmacyId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter");

    const today = utcDay(new Date());

    let medicines = await Medicine.find({
      pharmacyId: token.pharmacyId,
    }).sort({ createdAt: -1 });

    if (filter) {
      medicines = medicines.filter((m) => {
        const refillDate = utcDay(new Date(m.refillDate));

        if (filter === "today") {
          return refillDate.getTime() === today.getTime();
        }

        if (filter === "upcoming") {
          return refillDate.getTime() > today.getTime();
        }

        if (filter === "missed") {
          return refillDate.getTime() < today.getTime();
        }

        return true;
      });
    }

    return NextResponse.json(medicines);
  } catch (error) {
    console.error("GET medicines error", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

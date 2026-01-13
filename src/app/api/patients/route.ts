import connectDb from "@/lib/db";
import Patient from "@/models/patientModel";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const token = await getToken({ req });
    if (!token?.pharmacyId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const patients = await Patient.find({
      pharmacyId: token.pharmacyId,
    }).sort({ createdAt: -1 });

    return NextResponse.json(patients.map(p => p.toObject()));
  } catch (error) {
    console.error("GET patients error", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const token = await getToken({ req });
    if (!token?.pharmacyId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, phone } = await req.json();
    if (!name || !phone) {
      return NextResponse.json({ message: "All fields required" }, { status: 400 });
    }

    const patient = await Patient.create({
      pharmacyId: token.pharmacyId,
      name,
      phone,
    });

    return NextResponse.json(patient.toObject(), { status: 201 });
  } catch (error) {
    console.error("POST patient error", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

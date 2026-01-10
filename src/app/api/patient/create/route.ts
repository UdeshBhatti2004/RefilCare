import connectDb from "@/lib/db";
import Patient from "@/models/patientModel";
import { NextRequest, NextResponse } from "next/server";
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

    const { name, phone } = await req.json();

    if (!name || !phone) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const patient = await Patient.create({
      pharmacyId, 
      name,
      phone,
    });

    return NextResponse.json(
      patient.toObject(),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in creating patient", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

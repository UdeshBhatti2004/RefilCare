import connectDb from "@/lib/db";
import Patient from "@/models/patientModel";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  try {

    await connectDb();

    const token = await getToken({ req });
    if (!token?.pharmacyId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { patientIds } = body;

        const patients = await Patient.find({
      _id: { $in: patientIds },
      pharmacyId: token.pharmacyId, 
    }).select("_id name");


    return NextResponse.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
import connectDb from "@/lib/db";
import Patient from "@/models/patientModel";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  try {
    console.log("1️⃣ Getting patient batch...");
    await connectDb();

    const token = await getToken({ req });
    if (!token?.pharmacyId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { patientIds } = body;

    console.log("2️⃣ Looking for", patientIds.length, "patients");

    // Get all patients with these IDs (only from this pharmacy)
    const patients = await Patient.find({
      _id: { $in: patientIds },
      pharmacyId: token.pharmacyId, // Make sure they belong to this pharmacy
    }).select("_id name");

    console.log("3️⃣ Found", patients.length, "patients");
    return NextResponse.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
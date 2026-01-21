import connectDb from "@/lib/db"
import Patient from "@/models/patientModel"
import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb()

    const token = await getToken({ req })
    if (!token?.pharmacyId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    // ✅ FIX: await params
    const { id } = await context.params

    const patient = await Patient.findOne({
      _id: id,
      pharmacyId: token.pharmacyId,
    })

    if (!patient) {
      return NextResponse.json(
        { message: "Patient not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(patient.toObject())
  } catch (error) {
    console.error("GET patient by id error", error)
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    )
  }
}

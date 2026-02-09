import { getModels } from "@/lib/model";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { Patient } = await getModels();
    
    const token = await getToken({ req });
    if (!token?.pharmacyId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const patient = await Patient.findOne({
      _id: id,
      pharmacyId: token.pharmacyId,
    });

    if (!patient) {
      return NextResponse.json(
        { message: "Patient not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(patient.toObject());
  } catch (error) {
    console.error("GET patient by id error", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { Patient, Medicine } = await getModels();

    const token = await getToken({ req });

    if (!token?.pharmacyId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const patient = await Patient.findById(id);

    if (!patient) {
      return NextResponse.json(
        { message: "Patient not found" },
        { status: 404 },
      );
    }
    if (patient.pharmacyId.toString() !== token.pharmacyId.toString()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    if (patient.deleted) {
      return NextResponse.json(
        { message: "Patient already deleted" },
        { status: 400 },
      );
    }

    patient.deleted = true;
    patient.deletedAt = new Date();
    await patient.save();

    const medicinesResult = await Medicine.updateMany(
      {
        patientId: id,
        deleted: { $ne: true },
      },
      {
        deleted: true,
        deletedAt: new Date(),
      },
    );

    return NextResponse.json({
      message: "Patient deleted successfully",
      medicinesDeleted: medicinesResult.modifiedCount,
    });
  } catch (error) {
    console.error("Delete patient error:", error);
    return NextResponse.json(
      { message: "Server error", error: String(error) },
      { status: 500 },
    );
  }
}
import connectDb from "@/lib/db";
import Medicine from "@/models/medicineModel";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();

    const token = await getToken({ req });
    if (!token?.pharmacyId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const medicine = await Medicine.findOne({
      _id: params.id,
      pharmacyId: token.pharmacyId,
    }).populate("patientId", "name");

    if (!medicine) {
      return NextResponse.json(
        { message: "Medicine not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(medicine);
  } catch (error) {
    console.error("Error fetching medicine", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();

    const token = await getToken({ req });
    if (!token?.pharmacyId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

  const {
  medicineName,
  dosagePerDay,
  tabletsGiven,
  startDate,
  status,
} = await req.json();

const updateData: any = {};

if (medicineName) updateData.medicineName = medicineName;
if (dosagePerDay) updateData.dosagePerDay = dosagePerDay;
if (tabletsGiven) updateData.tabletsGiven = tabletsGiven;
if (startDate) updateData.startDate = startDate;
if (status) updateData.status = status;

const medicine = await Medicine.findOneAndUpdate(
  { _id: params.id, pharmacyId: token.pharmacyId },
  updateData,
  { new: true }
);


    if (!medicine) {
      return NextResponse.json(
        { message: "Medicine not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(medicine);
  } catch (error) {
    console.error("Error updating medicine", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

import connectDb from "@/lib/db";
import Medicine from "@/models/medicineModel";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

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

    const { status } = await req.json();

    if (!["active", "refilled", "stopped"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status" },
        { status: 400 }
      );
    }

    const medicine = await Medicine.findOneAndUpdate(
      { _id: params.id, pharmacyId: token.pharmacyId },
      { status },
      { new: true }
    );

    return NextResponse.json(medicine);
  } catch (error) {
    console.error("Error updating status", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

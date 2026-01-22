import connectDb from "@/lib/db";
import Medicine from "@/models/medicineModel";
import Patient from "@/models/patientModel"; 
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";
import RefillLog from "@/models/refillLogModel";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();

    const token = await getToken({ req });
    if (!token?.pharmacyId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid medicine id" },
        { status: 400 }
      );
    }

    const medicine = await Medicine.findOne({
      _id: id,
      pharmacyId: token.pharmacyId,
    }).populate("patientId", "name"); 
    console.log(medicine)

    if (!medicine) {
      return NextResponse.json(
        { message: "Medicine not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(medicine);
  } catch (error) {
    console.error("Error fetching medicine:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();

    const token = await getToken({ req });
    if (!token?.pharmacyId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    ///  Check medicine exists
    const medicine = await Medicine.findOne({
      _id: id,
      pharmacyId: token.pharmacyId,
    });

    if (!medicine) {
      return NextResponse.json(
        { message: "Medicine not found" },
        { status: 404 }
      );
    }

    /// Check refill history
    const hasRefills = await RefillLog.exists({
      medicineId: medicine._id,
    });

    if (hasRefills) {
      return NextResponse.json(
        {
          message:
            "Cannot delete medicine with refill history. Stop it instead.",
        },
        { status: 400 }
      );
    }

    await Medicine.deleteOne({ _id: medicine._id });

    return NextResponse.json({
      message: "Medicine deleted successfully",
    });
  } catch (error) {
    console.error("DELETE medicine error", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

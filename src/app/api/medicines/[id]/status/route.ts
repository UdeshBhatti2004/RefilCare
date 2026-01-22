import connectDb from "@/lib/db";
import Medicine from "@/models/medicineModel";
import RefillLog from "@/models/refillLogModel";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function PATCH(
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
    const { action } = await req.json(); 
    // action: "refill" | "stop" | "resume"

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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (action === "refill") {
      if (medicine.status === "stopped") {
        return NextResponse.json(
          { message: "Cannot refill a stopped medicine" },
          { status: 400 }
        );
      }

      const days = Math.floor(
        medicine.tabletsGiven / medicine.dosagePerDay
      );

      const newRefillDate = new Date(today);
      newRefillDate.setDate(today.getDate() + days);

      await RefillLog.create({
        pharmacyId: token.pharmacyId,
        patientId: medicine.patientId,
        medicineId: medicine._id,
        refillDate: new Date(),
        tabletsGiven: medicine.tabletsGiven,
      });

      medicine.refillDate = newRefillDate;
      medicine.status = "active";
      await medicine.save();

      return NextResponse.json(medicine);
    }

   
    if (action === "stop") {
      medicine.status = "stopped";
      await medicine.save();
      return NextResponse.json(medicine);
    }

    
    if (action === "resume") {
      if (medicine.status !== "stopped") {
        return NextResponse.json(
          { message: "Only stopped medicines can be resumed" },
          { status: 400 }
        );
      }

      const days = Math.floor(
        medicine.tabletsGiven / medicine.dosagePerDay
      );

      const newRefillDate = new Date(today);
      newRefillDate.setDate(today.getDate() + days);

      medicine.refillDate = newRefillDate;
      medicine.status = "active";
      await medicine.save();

      return NextResponse.json(medicine);
    }

    return NextResponse.json(
      { message: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("PATCH medicine error", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

import connectDb from "@/lib/db";
import Medicine from "@/models/medicineModel";
import RefillLog from "@/models/refillLogModel";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDb();

  const token = await getToken({ req });
  if (!token?.pharmacyId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const { action } = await req.json(); // "refill" | "stop"

  const medicine = await Medicine.findOne({
    _id: id,
    pharmacyId: token.pharmacyId,
  });

  if (!medicine) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  // 🔁 REFILL
  if (action === "refill") {
    if (medicine.status === "stopped") {
      return NextResponse.json(
        { message: "Cannot refill stopped medicine" },
        { status: 400 }
      );
    }

    const days = Math.floor(
      medicine.tabletsGiven / medicine.dosagePerDay
    );

    const newRefillDate = new Date();
    newRefillDate.setDate(newRefillDate.getDate() + days);

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

  // ⛔ STOP
  if (action === "stop") {
    medicine.status = "stopped";
    await medicine.save();
    return NextResponse.json(medicine);
  }

  return NextResponse.json(
    { message: "Invalid action" },
    { status: 400 }
  );
}



// src/app/api/medicines/[id]/route.ts
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
    const { action } = await req.json(); // refill | stop | resume

    console.log("🩺 PATCH medicine", { id, action });

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
    today.setUTCHours(0, 0, 0, 0); // ✅ UTC FIX

    // 🔐 Safety check
    if (!medicine.dosagePerDay || medicine.dosagePerDay <= 0) {
      return NextResponse.json(
        { message: "Invalid dosage per day" },
        { status: 400 }
      );
    }

    // ---------------- REFILL ----------------
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
      newRefillDate.setUTCDate(today.getUTCDate() + days);

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

      console.log("✅ Refill logged");

      return NextResponse.json(medicine);
    }

    // ---------------- STOP ----------------
    if (action === "stop") {
      medicine.status = "stopped";
      await medicine.save();

      console.log("⛔ Medicine stopped");

      return NextResponse.json(medicine);
    }

    // ---------------- RESUME ----------------
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
      newRefillDate.setUTCDate(today.getUTCDate() + days);

      medicine.refillDate = newRefillDate;
      medicine.status = "active";
      await medicine.save();

      console.log("▶️ Medicine resumed");

      return NextResponse.json(medicine);
    }

    return NextResponse.json(
      { message: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("❌ PATCH medicine error", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

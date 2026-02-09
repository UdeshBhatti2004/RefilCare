import { NextRequest, NextResponse } from "next/server";
import { getModels } from "@/lib/model";
import { getToken } from "next-auth/jwt";function utcDay(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { Medicine } = await getModels();

    const token = await getToken({ req });
    if (!token?.pharmacyId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: patientId } = await context.params;

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter");

    const today = utcDay(new Date());    let medicines = await Medicine.find({
      pharmacyId: token.pharmacyId,
      patientId: patientId,
    })
      .populate("patientId", "name")
      .sort({ createdAt: -1 });

    if (filter) {
      medicines = medicines.filter((m) => {
        const refillDate = utcDay(new Date(m.refillDate));

        if (filter === "today") {
          return refillDate.getTime() === today.getTime();
        }

        if (filter === "upcoming") {
          return refillDate.getTime() > today.getTime();
        }

        if (filter === "missed") {
          return refillDate.getTime() < today.getTime();
        }

        return true;
      });
    }

    return NextResponse.json(medicines);
  } catch (error) {
    console.error("GET patient medicines error", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

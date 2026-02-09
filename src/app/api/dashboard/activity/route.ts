import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getModels } from "@/lib/model"; 

export async function GET() {
  const { RefillLog } = await getModels();
  
  const session = await getServerSession(authOptions);

  if (!session?.user?.pharmacyId) {
    return NextResponse.json([], { status: 401 });
  }

  const logs = await RefillLog.find({
    pharmacyId: session.user.pharmacyId,
  })
    .populate("patientId", "name")
    .populate("medicineId", "medicineName")
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  return NextResponse.json(logs);
}
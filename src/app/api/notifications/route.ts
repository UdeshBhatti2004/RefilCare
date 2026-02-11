import { NextRequest, NextResponse } from "next/server";
import { getModels } from "@/lib/model";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const { Notification } = await getModels();

  const token = await getToken({ req });
  if (!token?.pharmacyId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const notifications = await Notification.find({
  pharmacyId: token.pharmacyId,
})
  .sort({ isRead: 1, createdAt: -1 })  
  .limit(20)
  .populate("patientId", "name")
  .populate("medicineId", "medicineName");

  const unreadCount = await Notification.countDocuments({
    pharmacyId: token.pharmacyId,
    isRead: false,
  });

  return NextResponse.json({
    notifications,
    unreadCount,
  });
}

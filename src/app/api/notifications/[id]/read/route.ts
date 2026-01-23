import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import Notification from "@/models/notificationModel";
import connectDb from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDb();

  // ✅ getToken REQUIRES NextRequest
  const token = await getToken({ req });

  if (!token?.pharmacyId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ unwrap async params
  const { id } = await context.params;

  const notification = await Notification.findOneAndUpdate(
    {
      _id: id,
      pharmacyId: token.pharmacyId,
    },
    { $set: { isRead: true } },
    { new: true }
  );

  if (!notification) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

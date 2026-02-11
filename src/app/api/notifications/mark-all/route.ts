import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getModels } from "@/lib/model";

export async function PATCH(req: NextRequest) {
  const { Notification } = await getModels();
  const token = await getToken({ req });

  if (!token?.pharmacyId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await Notification.updateMany(
    {
      pharmacyId: token.pharmacyId,
      isRead: false,
    },
    {
      $set: { isRead: true },
    }
  );

  return NextResponse.json({ success: true });
}

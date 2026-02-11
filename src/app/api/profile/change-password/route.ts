import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getModels } from "@/lib/model";
import bcrypt from "bcryptjs";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.pharmacyId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();

  const { Pharmacy } = await getModels();

  const pharmacy = await Pharmacy.findById(
    session.user.pharmacyId
  );

  const isMatch = await bcrypt.compare(
    currentPassword,
    pharmacy.password
  );

  if (!isMatch) {
    return NextResponse.json(
      { message: "Current password incorrect" },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  pharmacy.password = hashed;
  await pharmacy.save();

  return NextResponse.json({ message: "Password updated" });
}

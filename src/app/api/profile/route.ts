import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getModels } from "@/lib/model";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.pharmacyId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { Pharmacy } = await getModels();

  const pharmacy = await Pharmacy.findById(
    session.user.pharmacyId
  ).select("name email");

  return NextResponse.json(pharmacy);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.pharmacyId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, email } = body;

  const { Pharmacy } = await getModels();

  const updated = await Pharmacy.findByIdAndUpdate(
    session.user.pharmacyId,
    { name, email },
    { new: true }
  ).select("name email");

  return NextResponse.json(updated);
}

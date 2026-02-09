import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getModels } from "@/lib/model";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  const { Pharmacy } = await getModels();

  const exists = await Pharmacy.findOne({ email });
  if (exists) {
    return NextResponse.json(
      { error: "Pharmacy already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await Pharmacy.create({
    name,
    email,
    password: hashedPassword,
  });

  return NextResponse.json({ success: true });
}
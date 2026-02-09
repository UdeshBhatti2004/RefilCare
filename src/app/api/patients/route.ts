import { getModels } from "@/lib/model";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";


export async function GET(req: NextRequest) {
  try {
    const { Patient } = await getModels();
        const token = await getToken({ req });
    if (!token?.pharmacyId){
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

        const patients = await Patient.find({
      pharmacyId: token.pharmacyId,
      deleted: { $ne: true }, 
    })
      .sort({ createdAt: -1 })
      .select("_id name phone createdAt"); 


    return NextResponse.json(patients.map(p => p.toObject()));
  } catch (error) {
    console.error("GET patients error", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    
  const { Patient } = await getModels();

    const token = await getToken({ req });
    if (!token?.pharmacyId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, phone } = await req.json();
    if (!name || !phone) {
      return NextResponse.json({ message: "All fields required" }, { status: 400 });
    }

    const patient = await Patient.create({
      pharmacyId: token.pharmacyId,
      name,
      phone,
    });    const botUsername = process.env.TELEGRAM_BOT_USERNAME || "your_bot";
    const telegramLink = `https://t.me/${botUsername}?start=${patient._id}`;

    return NextResponse.json({
      patient: patient.toObject(),
      telegramLink,
      message: "Patient created successfully. Share the Telegram link with them to enable reminders.",
    }, { status: 201 });
  } catch (error) {
    console.error("POST patient error", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
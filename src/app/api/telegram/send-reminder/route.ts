import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getModels } from "@/lib/model";

export async function POST(req:NextRequest) {
  const { Patient } = await getModels();

  const { patientId, message } = await req.json();

  if (!patientId) {
    return NextResponse.json({ error: "patientId required" }, { status: 400 });
  }

  const patient = await Patient.findById(patientId);

  if (!patient || !patient.telegramChatId) {
    return NextResponse.json(
      { error: "Patient not linked to Telegram" },
      { status: 400 }
    );
  }

  const text =
    message ||
    `💊 Refill Reminder\n\nHello ${patient.name},\nIt's time to refill your medicine.`;

  await axios.post(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      chat_id: patient.telegramChatId,
      text,
    }
  );

  return NextResponse.json({ success: true });
}

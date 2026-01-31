import { NextResponse } from "next/server";
import axios from "axios";
import connectDb from "@/lib/db";
import Patient from "@/models/patientModel";

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

// ✅ helper function (THIS WAS MISSING)
async function sendMessage(chatId: number, text: string) {
  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text,
  });
}

export async function POST(req: Request) {
  await connectDb();

  const body = await req.json();
  const message = body.message;

  if (!message || !message.text) {
    return NextResponse.json({ ok: true });
  }

  const chatId = message.chat.id;
  const text = message.text.trim();

  // ✅ ALWAYS respond to /start
  if (text.startsWith("/start")) {
    const patientId = text.split(" ")[1];

    // 🟡 CASE 1: /start WITHOUT patientId → guide user
    if (!patientId) {
      await sendMessage(
        chatId,
        `👋 Welcome to RefillCare!

To activate refill reminders, please open the link shared with you by your pharmacy.

Once you open that link, just tap START — that’s all 😊`
      );

      return NextResponse.json({ ok: true });
    }

    // 🟢 CASE 2: /start WITH patientId → link patient
    const patient = await Patient.findById(patientId);

    if (!patient) {
      await sendMessage(
        chatId,
        "❌ This activation link is invalid or expired."
      );
      return NextResponse.json({ ok: true });
    }

    patient.telegramChatId = chatId;
    await patient.save();

    await sendMessage(
      chatId,
      `✅ Welcome ${patient.name}!

You're now linked to RefillCare.
You'll receive medicine refill reminders here.`
    );
  }

  return NextResponse.json({ ok: true });
}

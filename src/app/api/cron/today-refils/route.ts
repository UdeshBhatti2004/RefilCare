import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Medicine from "@/models/medicineModel";
import Notification from "@/models/notificationModel";
import Patient from "@/models/patientModel";
import axios from "axios";

const TOKEN = process.env.WHATSAPP_TOKEN!;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;

// Format phone number with country code
function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (!cleaned.startsWith("91") && cleaned.length === 10) {
    return "91" + cleaned;
  }
  return cleaned;
}

// Send WhatsApp template message
async function sendMedicineRefillReminder(
  to: string,
  patientName: string,
  medicineName: string,
) {
  const url = `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`;

  try {
    const response = await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: "medicine_refill_reminder",
          language: {
            code: "en_US",
          },
          components: [
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: patientName,
                },
                {
                  type: "text",
                  text: medicineName,
                },
              ],
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("✅ WhatsApp message sent:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ WhatsApp Error:", error.response?.data);
    throw error;
  }
}

export async function GET(req: NextRequest) {
  // 🔐 Protect cron
  if (process.env.NODE_ENV !== "development") {
    const key = req.headers.get("x-cron-key");
    if (key !== process.env.CRON_SECRET) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  }

  await connectDb();

  const now = new Date();

  // Find all active medicines
  const allMedicines = await Medicine.find({ status: "active" });

  // Filter for today's refills
  const medicinesDueToday = allMedicines.filter((med) => {
    const refillDate = new Date(med.refillDate);
    return (
      refillDate.getFullYear() === now.getFullYear() &&
      refillDate.getMonth() === now.getMonth() &&
      refillDate.getDate() === now.getDate()
    );
  });

  console.log(`📅 Found ${medicinesDueToday.length} medicines due today`);

  let sent = 0;
  const results: any[] = [];

  for (const med of medicinesDueToday) {
    try {
      // Check if notification sent in last hour
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const recentNotification = await Notification.findOne({
        pharmacyId: med.pharmacyId,
        medicineId: med._id,
        type: "upcoming",
        createdAt: { $gte: oneHourAgo },
      });

      if (recentNotification) {
        results.push({
          medicine: med.medicineName,
          status: "⏭️ Skipped - already sent in last hour",
        });
        continue;
      }

      const patient = await Patient.findById(med.patientId);

      if (!patient?.phone) {
        results.push({
          medicine: med.medicineName,
          status: "⚠️ Skipped - no phone number",
        });
        continue;
      }

      const formattedPhone = formatPhoneNumber(patient.phone);

      // Send WhatsApp template message
      await sendMedicineRefillReminder(
        formattedPhone,
        patient.name,
        med.medicineName,
      );

      // Create notification in database
      await Notification.create({
        pharmacyId: med.pharmacyId,
        patientId: med.patientId,
        medicineId: med._id,
        type: "upcoming",
        message: `Refill due today for ${med.medicineName}`,
        read: false,
      });

      sent++;
      results.push({
        medicine: med.medicineName,
        patient: patient.name,
        phone: formattedPhone,
        status: "✅ Message sent successfully",
      });
    } catch (error: any) {
      const errorMsg = error.response?.data?.error?.message || error.message;
      results.push({
        medicine: med.medicineName,
        status: "❌ Failed",
        error: errorMsg,
      });
    }
  }

  console.log(`📊 Summary: ${sent}/${medicinesDueToday.length} messages sent`);

  return NextResponse.json({
    success: true,
    message: "Today refill cron executed",
    messagesSent: sent,
    totalDueToday: medicinesDueToday.length,
    timestamp: now.toISOString(),
    results,
  });
}

import axios from "axios";

const TOKEN = process.env.WHATSAPP_TOKEN!;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;

export async function sendWhatsAppMessage(to: string, body: string) {
  const url = `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`;

  try {
    const response = await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: {
          preview_url: false,
          body,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("✅ WhatsApp message sent successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ WhatsApp API Error Details:");
    console.error("Status:", error.response?.status);
    console.error("Error:", JSON.stringify(error.response?.data, null, 2));
    console.error("To:", to);
    console.error("Message:", body);
    throw error;
  }
}

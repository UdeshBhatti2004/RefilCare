import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: "917990496001", // no +, country code included
        type: "template",
        template: {
          name: "hello_world", // default test template
          language: { code: "en_US" },
        },
      }),
    },
  );

  const data = await res.json();
  console.log("Meta response:", data);

  return NextResponse.json({ success: true, data });
}

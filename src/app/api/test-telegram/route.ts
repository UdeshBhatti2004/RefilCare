import { NextRequest, NextResponse } from "next/server";
import { getBotInfo } from "@/lib/telegram";

export async function GET(req: NextRequest) {
  try {
    const botInfo = await getBotInfo();
    
    return NextResponse.json({
      success: true,
      bot: botInfo.result,
      message: "Bot is working! ✅",
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

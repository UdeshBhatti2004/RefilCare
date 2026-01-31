import axios from "axios";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Send message to a Telegram user
export async function sendTelegramMessage(chatId: string, message: string) {
  try {
    const response = await axios.post(`${API_URL}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: "HTML",
    });

    console.log("✅ Telegram message sent:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Telegram Error:", error.response?.data || error.message);
    throw error;
  }
}

// Get bot info (for testing)
export async function getBotInfo() {
  try {
    const response = await axios.get(`${API_URL}/getMe`);
    return response.data;
  } catch (error: any) {
    console.error("❌ Bot Info Error:", error.response?.data || error.message);
    throw error;
  }
}
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    console.log("Testando gemini-pro...");
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent("Oi");
    console.log("Sucesso:", result.response.text());
  } catch (e) {
    console.error("Erro:", e.message);
  }
}

listModels();

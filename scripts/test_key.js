import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const result = await model.generateContent("Oi");
    console.log("SUCESSO: Chave válida! Resposta:", result.response.text());
  } catch (e) {
    console.error("ERRO NA CHAVE:", e.message);
  }
}

test();

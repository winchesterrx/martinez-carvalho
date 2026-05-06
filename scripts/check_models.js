import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listAllModels() {
  try {
    // Usando a API de busca de modelos nativa do SDK
    // @ts-ignore
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    console.log("Modelos Disponíveis para sua chave:");
    if (data.models) {
      data.models.forEach(m => console.log(`- ${m.name}`));
    } else {
      console.log("Nenhum modelo encontrado ou erro na resposta:", JSON.stringify(data));
    }
  } catch (e) {
    console.error("Erro ao listar modelos:", e.message);
  }
}

listAllModels();

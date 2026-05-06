import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from "@google/generative-ai/server";
import dotenv from 'dotenv';
import pool from '../api/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializa Gemini e Gerenciador de Arquivos
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

// Inicializa Google Drive
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../service_account.json'),
  scopes: SCOPES,
});
const drive = google.drive({ version: 'v3', auth });

async function downloadFromDrive(fileId, destPath) {
  console.log(`Baixando arquivo do Google Drive (ID: ${fileId})...`);
  const dest = fs.createWriteStream(destPath);
  const res = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
  return new Promise((resolve, reject) => {
    res.data.on('end', resolve).on('error', reject).pipe(dest);
  });
}

async function processVideoWithGemini(filePath) {
  console.log('Subindo arquivo para o Google AI File API...');
  
  try {
    // 1. Upload do arquivo para o File Manager (Otimizado para vídeos)
    const uploadResult = await fileManager.uploadFile(filePath, {
      mimeType: "video/mp4",
      displayName: "Video Treinamento",
    });

    console.log(`Arquivo subido: ${uploadResult.file.uri}`);

    // 2. Aguarda o processamento do arquivo pelo Google
    let file = await fileManager.getFile(uploadResult.file.name);
    while (file.state === "PROCESSING") {
      process.stdout.write(".");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      file = await fileManager.getFile(uploadResult.file.name);
    }

    if (file.state === "FAILED") throw new Error("Falha no processamento do vídeo no Google.");
    console.log("\nVídeo processado e pronto.");

    // 3. Gera o conteúdo (Usando os nomes exatos permitidos para sua chave)
    const modelNames = ['gemini-flash-latest', 'gemini-2.0-flash', 'gemini-2.5-flash'];
    let lastError = null;

    for (const modelName of modelNames) {
      try {
        console.log(`Tentando modelo: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const prompt = `
          Você é um especialista em documentação técnica dos sistemas Fiorilli.
          Analise este vídeo/áudio e extraia o conhecimento técnico.
          
          REGRAS OBRIGATÓRIAS:
          1. NÃO comece com introduções como "Com certeza", "Aqui está" ou "Olá".
          2. Inicie DIRETAMENTE no conteúdo técnico.
          3. Estruture em: RESUMO DO MÓDULO, PASSO A PASSO e DICAS DE SUPORTE.
          4. Use linguagem profissional para base de conhecimento de IA.
          
          Retorne apenas o texto da documentação finalizada.
        `;
        const result = await model.generateContent([
          {
            fileData: {
              mimeType: file.mimeType,
              fileUri: file.uri,
            },
          },
          { text: prompt },
        ]);

        const response = await result.response;
        return response.text();
      } catch (err) {
        lastError = err;
        console.log(`Modelo ${modelName} falhou: ${err.message}`);
      }
    }
    
    throw lastError;

  } catch (error) {
    console.error('Erro no processamento:', error.message);
    throw error;
  }
}

async function saveToKnowledgeBase(titulo, conteudo, sistema = 'geral') {
  const query = `INSERT INTO conhecimento_site (sistema, categoria, titulo, conteudo, tags, ativo) VALUES (?, ?, ?, ?, ?, ?)`;
  await pool.execute(query, [sistema, 'video_treinamento', titulo, conteudo, 'gemini, auto', 1]);
}

async function runIngestionPipeline(driveFileId, systemName, videoTitle) {
  const tempFilePath = path.join(__dirname, 'temp_video.mp4');
  try {
    await downloadFromDrive(driveFileId, tempFilePath);
    const structuredContent = await processVideoWithGemini(tempFilePath);
    await saveToKnowledgeBase(videoTitle, structuredContent, systemName);
    console.log(`--- SUCESSO: Conhecimento extraído e salvo! ---`);
  } catch (error) {
    console.error('Pipeline falhou:', error);
  } finally {
    if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
    await pool.end();
  }
}

// ==========================================
// CONFIGURAÇÃO DE TESTE
// ==========================================
// Altere os valores abaixo para cada vídeo que for subir:
const VIDEO_PARA_PROCESSAR = {
  id_drive: '1GzAep-ANR1rrUMSpEe896odfMWXcwVtq',
  sistema: 'saude', // Altere para 'scpi', 'sip', 'saude', 'arrecadacao', etc.
  titulo: 'Treinamento SIS - Gestão de Atendimento' 
};

runIngestionPipeline(
  VIDEO_PARA_PROCESSAR.id_drive, 
  VIDEO_PARA_PROCESSAR.sistema, 
  VIDEO_PARA_PROCESSAR.titulo
);

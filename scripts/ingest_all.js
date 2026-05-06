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

// Configurações
const GEN_AI_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEN_AI_KEY);
const fileManager = new GoogleAIFileManager(GEN_AI_KEY);

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../service_account.json'),
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});
const drive = google.drive({ version: 'v3', auth });

// Mapeamento inteligente de pastas para sistemas
const FOLDER_TO_SYSTEM = {
  'medicos': 'saude',
  'médicos': 'saude',
  'enfermeiros': 'saude',
  'recepcao': 'saude',
  'recepção': 'saude',
  'agendamento': 'saude',
  'hospital': 'saude',
  'pronto socorro': 'saude',
  'pronto socorro-hospital': 'saude',
  'scpi': 'scpi',
  'sip': 'sip',
  'rh': 'rh',
  'contabilidade': 'scpi',
  'tesouraria': 'scpi',
};

async function getFolderId(folderName) {
  const res = await drive.files.list({
    q: `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name)',
  });
  return res.data.files[0]?.id;
}

async function listFilesRecursively(folderId, parentFolderName = '') {
  let results = [];
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name, mimeType)',
  });

  for (const file of res.data.files) {
    if (file.mimeType === 'application/vnd.google-apps.folder') {
      const subFiles = await listFilesRecursively(file.id, file.name);
      results = results.concat(subFiles);
    } else if (file.mimeType.startsWith('video/') || file.mimeType.startsWith('audio/')) {
      results.push({
        id: file.id,
        name: file.name,
        parentFolder: parentFolderName.toLowerCase()
      });
    }
  }
  return results;
}

async function isAlreadyProcessed(title) {
  const [rows] = await pool.query('SELECT id FROM conhecimento_site WHERE titulo = ?', [title]);
  return rows.length > 0;
}

async function processVideo(fileId, fileName, systemName) {
  const tempPath = path.join(__dirname, `temp_${fileId}.mp4`);
  
  try {
    // 1. Download
    console.log(`\n--- Processando: ${fileName} ---`);
    const dest = fs.createWriteStream(tempPath);
    const res = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
    await new Promise((resolve, reject) => {
      res.data.on('end', resolve).on('error', reject).pipe(dest);
    });

    // 2. Upload para Google AI
    const uploadResult = await fileManager.uploadFile(tempPath, {
      mimeType: "video/mp4",
      displayName: fileName,
    });

    let file = await fileManager.getFile(uploadResult.file.name);
    while (file.state === "PROCESSING") {
      process.stdout.write(".");
      await new Promise(r => setTimeout(r, 3000));
      file = await fileManager.getFile(uploadResult.file.name);
    }
    console.log(" Vídeo pronto.");

    // 3. Gemini Flash (Inteligência)
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const prompt = `
      Você é um especialista em documentação técnica dos sistemas Fiorilli.
      Extraia o manual técnico deste vídeo.
      
      REGRAS CRÍTICAS:
      1. Use EXATAMENTE os nomes de telas, botões, abas e módulos citados no vídeo.
      2. NÃO generalize termos (Ex: se falar "Consultório", mantenha "Consultório", não use "Prontuário").
      3. Se o instrutor clicar em uma aba específica (Ex: "Aba Planos"), registre esse nome exato.
      4. Não use introduções.
      5. Estruture como artigo de suporte: RESUMO, PASSO A PASSO e DICAS.
      
      Retorne apenas o manual técnico finalizado.
    `;

    const result = await model.generateContent([
      { fileData: { mimeType: file.mimeType, fileUri: file.uri } },
      { text: prompt },
    ]);

    const content = result.response.text();

    // 4. Salvar no Banco
    const query = `INSERT INTO conhecimento_site (sistema, categoria, titulo, conteudo, tags, ativo) VALUES (?, ?, ?, ?, ?, ?)`;
    await pool.execute(query, [systemName, 'video_treinamento', fileName, content, 'auto_ingest, gemini', 1]);
    
    console.log(`✅ Salvo com sucesso no sistema: ${systemName}`);

  } catch (e) {
    console.error(`❌ Erro ao processar ${fileName}:`, e.message);
  } finally {
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  }
}

async function startSuperIngestion() {
  console.log("🔍 Iniciando busca pela pasta 'CLEUSA IA'...");
  const rootFolderId = await getFolderId('CLEUSA IA');
  
  if (!rootFolderId) {
    console.error("Pasta 'CLEUSA IA' não encontrada no Drive compartilhado!");
    process.exit(1);
  }

  console.log(`📂 Pasta encontrada! (ID: ${rootFolderId})`);
  const allFiles = await listFilesRecursively(rootFolderId);
  console.log(`🎥 Total de vídeos/áudios encontrados: ${allFiles.length}`);

  for (const file of allFiles) {
    const title = file.name;
    
    if (await isAlreadyProcessed(title)) {
      console.log(`⏭️ Pulando '${title}' (Já existe no banco)`);
      continue;
    }

    const system = FOLDER_TO_SYSTEM[file.parentFolder] || 'geral';
    await processVideo(file.id, title, system);
    
    // Pequena pausa para não estourar rate limit da conta gratuita
    console.log("Aguardando 10 segundos para o próximo...");
    await new Promise(r => setTimeout(r, 10000));
  }

  console.log("\n🚀 TODOS OS VÍDEOS FORAM PROCESSADOS!");
  await pool.end();
}

startSuperIngestion();

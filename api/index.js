import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do Banco de Dados com Timeout (Importante para Vercel)
const dbConfig = {
  host: 'martinezvideo.mysql.uhserver.com',
  user: 'winchester123',
  password: '@Saopaulop45',
  database: 'martinezvideo',
  connectTimeout: 10000 // 10 segundos
};

// Criar pool de conexão de forma preguiçosa (Lazy)
let pool;
function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// Helper para parse de JSON
function safeJson(val) {
  if (!val) return [];
  if (typeof val !== 'string') return val;
  try { return JSON.parse(val); } catch (e) { return []; }
}

// ROTA DE SAÚDE (Para testar se a API está viva)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ==========================================
// AUTH / LOGIN
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { usuario, senha } = req.body;
    const [rows] = await getPool().query('SELECT * FROM usuarios_site WHERE usuario = ? AND senha_hash = ?', [usuario, senha]);
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }
    
    const user = rows[0];
    res.json({
      success: true,
      token: `martinez-jwt-${Date.now()}`,
      user: { id: user.id, nome: user.nome, usuario: user.usuario, papel: user.papel }
    });
  } catch (error) {
    console.error('Erro login:', error);
    res.status(500).json({ error: 'Erro interno no banco de dados' });
  }
});

app.get('/api/auth/verify', (req, res) => {
  res.json({ valid: true });
});

// ==========================================
// SISTEMAS
// ==========================================
app.get('/api/sistemas', async (req, res) => {
  try {
    const [rows] = await getPool().query('SELECT * FROM sistemas_site WHERE ativo = 1 ORDER BY ordem ASC');
    const parsed = rows.map(r => ({
      ...r,
      features: safeJson(r.features),
      modulos: safeJson(r.modulos),
      beneficios: safeJson(r.beneficios)
    }));
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// CHAT CLEUSA
// ==========================================
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) return res.status(500).json({ error: 'Chave da IA não configurada' });

    // RAG simples
    let context = '';
    try {
      const lastMsg = messages[messages.length - 1].content;
      const [artigos] = await getPool().query('SELECT titulo, conteudo FROM conhecimento_site WHERE ativo = 1 LIMIT 5');
      artigos.forEach(a => context += `\n- ${a.titulo}: ${a.conteudo}`);
    } catch (e) {}

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `Você é a Cleusa. Contexto: ${context}` }] },
          ...(messages || []).map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          }))
        ]
      })
    });

    if (!response.ok) throw new Error('Erro na Gemini API');

    res.setHeader('Content-Type', 'text/event-stream');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`);
            }
          } catch (e) {}
        }
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Adicionando rotas sem /api para compatibilidade total
app.get('/sistemas', (req, res) => res.redirect('/api/sistemas'));
app.post('/chat', (req, res) => res.redirect(307, '/api/chat'));
app.post('/auth/login', (req, res) => res.redirect(307, '/api/auth/login'));

export default app;

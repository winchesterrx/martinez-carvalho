import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const dbConfig = {
  host: 'martinezvideo.mysql.uhserver.com',
  user: 'winchester123',
  password: '@Saopaulop45',
  database: 'martinezvideo',
  connectTimeout: 15000
};

let pool;
function getPool() {
  if (!pool) pool = mysql.createPool(dbConfig);
  return pool;
}

function safeJson(val) {
  if (!val) return [];
  if (typeof val !== 'string') return val;
  try { return JSON.parse(val); } catch { return []; }
}

// ==========================================
// AUTH
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { usuario, senha } = req.body;
    const [rows] = await getPool().query('SELECT * FROM usuarios_site WHERE usuario = ? AND senha_hash = ?', [usuario, senha]);
    if (rows.length === 0) return res.status(401).json({ error: 'Falha' });
    const u = rows[0];
    res.json({ success: true, token: `jwt-${Date.now()}`, user: { nome: u.nome, usuario: u.usuario, papel: u.papel } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/auth/verify', (req, res) => res.json({ valid: true }));

// ==========================================
// SISTEMAS (Com suporte a Slug e All)
// ==========================================
app.get('/api/sistemas', async (req, res) => {
  try {
    const [rows] = await getPool().query('SELECT * FROM sistemas_site WHERE ativo = 1 ORDER BY ordem ASC');
    res.json(rows.map(r => ({ ...r, features: safeJson(r.features), modulos: safeJson(r.modulos), beneficios: safeJson(r.beneficios) })));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/sistemas/all', async (req, res) => {
  try {
    const [rows] = await getPool().query('SELECT * FROM sistemas_site ORDER BY ordem ASC');
    res.json(rows.map(r => ({ ...r, features: safeJson(r.features), modulos: safeJson(r.modulos), beneficios: safeJson(r.beneficios) })));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/sistemas/:slug', async (req, res) => {
  try {
    const [rows] = await getPool().query('SELECT * FROM sistemas_site WHERE slug = ?', [req.params.slug]);
    if (rows.length === 0) return res.status(404).json({ error: 'N/A' });
    const r = rows[0];
    res.json({ ...r, features: safeJson(r.features), modulos: safeJson(r.modulos), beneficios: safeJson(r.beneficios) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/sistemas', async (req, res) => {
  try {
    const keys = Object.keys(req.body).filter(k => k !== 'id');
    const values = keys.map(k => typeof req.body[k] === 'object' ? JSON.stringify(req.body[k]) : req.body[k]);
    const sql = `INSERT INTO sistemas_site (${keys.join(',')}) VALUES (${keys.map(() => '?').join(',')})`;
    const [result] = await getPool().query(sql, values);
    res.json({ success: true, id: result.insertId });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/sistemas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const keys = Object.keys(req.body).filter(k => k !== 'id');
    const values = keys.map(k => typeof req.body[k] === 'object' ? JSON.stringify(req.body[k]) : req.body[k]);
    const sql = `UPDATE sistemas_site SET ${keys.map(k => `${k}=?`).join(',')} WHERE id=?`;
    await getPool().query(sql, [...values, id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/sistemas/:id', async (req, res) => {
  try {
    await getPool().query('DELETE FROM sistemas_site WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ==========================================
// CONHECIMENTO (IA) - EXPLÍCITO PARA EVITAR 404
// ==========================================
app.get('/api/conhecimento', async (req, res) => {
  try {
    const [rows] = await getPool().query('SELECT * FROM conhecimento_site WHERE ativo = 1 ORDER BY ordem ASC, id DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/conhecimento/all', async (req, res) => {
  try {
    const [rows] = await getPool().query('SELECT * FROM conhecimento_site ORDER BY ordem ASC, id DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/conhecimento', async (req, res) => {
  try {
    const { sistema, categoria, titulo, conteudo, tags, ordem, ativo } = req.body;
    const [result] = await getPool().query(
      'INSERT INTO conhecimento_site (sistema, categoria, titulo, conteudo, tags, ordem, ativo) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [sistema || null, categoria || 'FAQ', titulo, conteudo, tags || null, ordem || 0, ativo !== undefined ? ativo : 1]
    );
    res.json({ success: true, id: result.insertId });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/conhecimento/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { sistema, categoria, titulo, conteudo, tags, ordem, ativo } = req.body;
    await getPool().query(
      'UPDATE conhecimento_site SET sistema=?, categoria=?, titulo=?, conteudo=?, tags=?, ordem=?, ativo=? WHERE id=?',
      [sistema || null, categoria, titulo, conteudo, tags || null, ordem || 0, ativo !== undefined ? ativo : 1, id]
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/conhecimento/:id', async (req, res) => {
  try {
    await getPool().query('DELETE FROM conhecimento_site WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ==========================================
// ROTAS GENÉRICAS (Videos, Ferramentas, Hero, etc)
// ==========================================
const tables = ['videos', 'ferramentas', 'hero', 'sobre', 'contato', 'parceria', 'configuracoes'];

tables.forEach(t => {
  // Rota Pública
  app.get(`/api/${t}`, async (req, res) => {
    try {
      const [rows] = await getPool().query(`SELECT * FROM ${t}_site WHERE ativo = 1 OR id = 1 ORDER BY id DESC`);
      res.json(t === 'sobre' || t === 'contato' || t === 'parceria' ? rows[0] : rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Rota Admin (All)
  app.get(`/api/${t}/all`, async (req, res) => {
    try {
      const [rows] = await getPool().query(`SELECT * FROM ${t}_site ORDER BY id DESC`);
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Salvar Novo
  app.post(`/api/${t}`, async (req, res) => {
    try {
      const keys = Object.keys(req.body).filter(k => k !== 'id');
      const values = keys.map(k => typeof req.body[k] === 'object' ? JSON.stringify(req.body[k]) : req.body[k]);
      const sql = `INSERT INTO ${t}_site (${keys.join(',')}) VALUES (${keys.map(() => '?').join(',')})`;
      const [result] = await getPool().query(sql, values);
      res.json({ success: true, id: result.insertId });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Atualizar
  app.put(`/api/${t}/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const keys = Object.keys(req.body).filter(k => k !== 'id');
      const values = keys.map(k => typeof req.body[k] === 'object' ? JSON.stringify(req.body[k]) : req.body[k]);
      const sql = `UPDATE ${t}_site SET ${keys.map(k => `${k}=?`).join(',')} WHERE id=?`;
      await getPool().query(sql, [...values, id]);
      res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Deletar
  app.delete(`/api/${t}/:id`, async (req, res) => {
    try {
      await getPool().query(`DELETE FROM ${t}_site WHERE id=?`, [req.params.id]);
      res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
});

// ==========================================
// CHAT CLEUSA
// ==========================================
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    // RAG Inteligente: Buscar na base de conhecimento por palavras-chave
    let context = '';
    try {
      const lastMsg = (messages[messages.length - 1].content || '').toLowerCase();
      const words = lastMsg.split(/\s+/).filter(w => w.length > 3);
      
      if (words.length > 0) {
        const conditions = words.map(() => '(LOWER(titulo) LIKE ? OR LOWER(conteudo) LIKE ? OR LOWER(tags) LIKE ?)');
        const params = words.flatMap(w => [`%${w}%`, `%${w}%`, `%${w}%`]);
        const [artigos] = await getPool().query(`SELECT titulo, conteudo, categoria FROM conhecimento_site WHERE ativo = 1 AND (${conditions.join(' OR ')}) LIMIT 10`, params);
        
        if (artigos.length > 0) {
          context = '\n=== CONHECIMENTO TÉCNICO ENCONTRADO ===\n';
          artigos.forEach(a => context += `\n[${a.categoria}] ${a.titulo}: ${a.conteudo}\n`);
        }
      }
      
      // Se não achar nada específico, pega os mais importantes
      if (!context) {
        const [top] = await getPool().query('SELECT titulo, conteudo FROM conhecimento_site WHERE ativo = 1 ORDER BY ordem ASC LIMIT 5');
        context = '\n=== CONHECIMENTO GERAL ===\n';
        top.forEach(a => context += `\n- ${a.titulo}: ${a.conteudo}`);
      }
      console.log('Contexto RAG recuperado:', context.length, 'caracteres');
    } catch (e) { console.error('Erro RAG:', e); }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.error('ERRO: GEMINI_API_KEY não encontrada!');
      return res.status(500).json({ error: 'Key' });
    }

    const model = 'gemini-1.5-flash';
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${key}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `Você é a Cleusa, assistente técnica da Martinez & Carvalho. Use este contexto técnico para responder SEMPRE com links quando disponíveis: ${context}` }] },
          { role: 'model', parts: [{ text: 'Entendido. Sou a Cleusa e vou ajudar com os sistemas Fiorilli usando links reais do canal Fiorilli Play.' }] },
          ...(messages || []).map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content || '' }]
          }))
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Erro na API do Gemini:', response.status, errText);
      throw new Error(`Gemini API: ${response.status}`);
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let streamBuffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      streamBuffer += decoder.decode(value, { stream: true });
      let lines = streamBuffer.split('\n');
      streamBuffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim().startsWith('data: ')) continue;
        const jsonStr = line.trim().slice(6);
        if (jsonStr === '[DONE]') break;

        try {
          const data = JSON.parse(jsonStr);
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            const output = JSON.stringify({
              choices: [{ delta: { content: text } }]
            });
            res.write(`data: ${output}\n\n`);
          }
        } catch (e) {}
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default app;

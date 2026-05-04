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
// ROTAS GENÉRICAS (Videos, Ferramentas, Hero, etc)
// ==========================================
const tables = ['videos', 'ferramentas', 'hero', 'conhecimento', 'sobre', 'contato', 'parceria'];

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
    const key = process.env.GEMINI_API_KEY;
    if (!key) return res.status(500).json({ error: 'Key' });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: (messages || []).map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content || '' }]
        }))
      })
    });

    res.setHeader('Content-Type', 'text/event-stream');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      chunk.split('\n').filter(l => l.startsWith('data: ')).forEach(l => {
        try {
          const text = JSON.parse(l.slice(6)).candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`);
        } catch {}
      });
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default app;

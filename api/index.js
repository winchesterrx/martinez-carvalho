import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Banco de Dados
const dbConfig = {
  host: 'martinezvideo.mysql.uhserver.com',
  user: 'winchester123',
  password: '@Saopaulop45',
  database: 'martinezvideo',
  connectTimeout: 10000
};

let pool;
function getPool() {
  if (!pool) pool = mysql.createPool(dbConfig);
  return pool;
}

// ==========================================
// ROTAS DE AUTH
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { usuario, senha } = req.body;
    const [rows] = await getPool().query('SELECT * FROM usuarios_site WHERE usuario = ? AND senha_hash = ?', [usuario, senha]);
    if (rows.length === 0) return res.status(401).json({ error: 'Incorreto' });
    const user = rows[0];
    res.json({ success: true, token: `jwt-${Date.now()}`, user: { id: user.id, nome: user.nome, usuario: user.usuario, papel: user.papel } });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/auth/verify', (req, res) => res.json({ valid: true }));

// ==========================================
// ROTAS DE DADOS (CURINGA PARA EVITAR 404)
// ==========================================
app.get('/api/:table', async (req, res) => {
  const { table } = req.params;
  const allowedTables = ['sistemas', 'videos', 'ferramentas', 'hero', 'contato', 'sobre', 'conhecimento'];
  
  if (!allowedTables.includes(table)) return res.status(404).json({ error: 'Not found' });

  try {
    const tableName = `${table}_site`;
    const [rows] = await getPool().query(`SELECT * FROM ${tableName} WHERE ativo = 1 OR id=1`);
    res.json(rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ==========================================
// CHAT CLEUSA (SEMPRE RESPONDE)
// ==========================================
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) return res.status(500).json({ error: 'No Key' });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: (messages || []).map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content || '' }]
        }))
      })
    });

    if (!response.ok) throw new Error('API Error');

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
            if (text) res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`);
          } catch(e) {}
        }
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) { res.status(500).json({ error: error.message }); }
});

export default app;

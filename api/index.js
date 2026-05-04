import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Aumentar limite para uploads (importante para o admin)
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Configuração do Banco de Dados Direta (Garante que não falte arquivo db.js)
const dbConfig = {
  host: 'martinezvideo.mysql.uhserver.com',
  user: 'winchester123',
  password: '@Saopaulop45',
  database: 'martinezvideo',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const db = mysql.createPool(dbConfig);

// Helper para JSON seguro
function safeJsonParse(str, fallback) {
  if (!str) return fallback;
  if (typeof str !== 'string') return str;
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
}

// Criar um Router para todas as rotas
const apiRouter = express.Router();

// ==========================================
// AUTH (LOGIN) - RESTAURADO E TESTADO
// ==========================================
apiRouter.post('/auth/login', async (req, res) => {
  try {
    const { usuario, senha } = req.body;
    console.log('Tentativa de login:', usuario);
    
    const [rows] = await db.query('SELECT * FROM usuarios_site WHERE usuario = ? AND senha_hash = ?', [usuario, senha]);
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos' });
    }
    
    const user = rows[0];
    res.json({ 
      token: `martinez-jwt-${Date.now()}`, 
      user: { 
        id: user.id,
        nome: user.nome, 
        usuario: user.usuario, 
        papel: user.papel 
      } 
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno no servidor de autenticação' });
  }
});

apiRouter.get('/auth/verify', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token && token.startsWith('martinez-jwt-')) {
    res.json({ valid: true });
  } else {
    res.status(401).json({ valid: false });
  }
});

// ==========================================
// SISTEMAS
// ==========================================
apiRouter.get('/sistemas', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM sistemas_site WHERE ativo = 1 ORDER BY ordem ASC');
    const parsed = rows.map(r => ({
      ...r,
      features: safeJsonParse(r.features, []),
      modulos: safeJsonParse(r.modulos, []),
      beneficios: safeJsonParse(r.beneficios, [])
    }));
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.get('/sistemas/all', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM sistemas_site ORDER BY ordem ASC');
    const parsed = rows.map(r => ({
      ...r,
      features: safeJsonParse(r.features, []),
      modulos: safeJsonParse(r.modulos, []),
      beneficios: safeJsonParse(r.beneficios, [])
    }));
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.get('/sistemas/:slug', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM sistemas_site WHERE slug = ?', [req.params.slug]);
    if (rows.length === 0) return res.status(404).json({ error: 'Sistema não encontrado' });
    const s = rows[0];
    res.json({
      ...s,
      features: safeJsonParse(s.features, []),
      modulos: safeJsonParse(s.modulos, []),
      beneficios: safeJsonParse(s.beneficios, [])
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Outras rotas CRUD (simplificadas para garantir estabilidade)
apiRouter.post('/sistemas', async (req, res) => {
  try {
    const { slug, nome, titulo, descricao, tagline, icone, features, modulos, beneficios, ordem } = req.body;
    const [result] = await db.query(
      'INSERT INTO sistemas_site (slug, nome, titulo, descricao, tagline, icone, features, modulos, beneficios, ordem) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [slug, nome, titulo, descricao, tagline, icone || 'Calculator', JSON.stringify(features || []), JSON.stringify(modulos || []), JSON.stringify(beneficios || []), ordem || 0]
    );
    res.json({ id: result.insertId });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

apiRouter.put('/sistemas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { slug, nome, titulo, descricao, tagline, icone, features, modulos, beneficios, ordem, ativo } = req.body;
    await db.query(
      'UPDATE sistemas_site SET slug = ?, nome = ?, titulo = ?, descricao = ?, tagline = ?, icone = ?, features = ?, modulos = ?, beneficios = ?, ordem = ?, ativo = ? WHERE id = ?',
      [slug, nome, titulo, descricao, tagline, icone, JSON.stringify(features), JSON.stringify(modulos), JSON.stringify(beneficios), ordem, ativo !== undefined ? ativo : 1, id]
    );
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

apiRouter.delete('/sistemas/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM sistemas_site WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ==========================================
// VÍDEOS / TUTORIAIS
// ==========================================
apiRouter.get('/videos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM videos_site WHERE ativo = 1 ORDER BY ordem ASC');
    res.json(rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

apiRouter.get('/videos/all', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM videos_site ORDER BY ordem ASC');
    res.json(rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

apiRouter.post('/videos', async (req, res) => {
  try {
    const { titulo, descricao, url_video, duracao, topico, ordem } = req.body;
    const [result] = await db.query(
      'INSERT INTO videos_site (titulo, descricao, url_video, duracao, topico, ordem) VALUES (?, ?, ?, ?, ?, ?)',
      [titulo, descricao, url_video, duracao, topico, ordem || 0]
    );
    res.json({ id: result.insertId });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

apiRouter.put('/videos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, url_video, duracao, topico, ordem, ativo } = req.body;
    await db.query(
      'UPDATE videos_site SET titulo = ?, descricao = ?, url_video = ?, duracao = ?, topico = ?, ordem = ?, ativo = ? WHERE id = ?',
      [titulo, descricao, url_video, duracao, topico, ordem, ativo !== undefined ? ativo : 1, id]
    );
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

apiRouter.delete('/videos/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM videos_site WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ==========================================
// CONHECIMENTO (BASE DA IA)
// ==========================================
apiRouter.get('/conhecimento', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM conhecimento_site WHERE ativo = 1 ORDER BY ordem ASC');
    res.json(rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

apiRouter.get('/conhecimento/all', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM conhecimento_site ORDER BY ordem ASC');
    res.json(rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

apiRouter.post('/conhecimento', async (req, res) => {
  try {
    const { sistema, categoria, titulo, conteudo, tags, ordem } = req.body;
    const [result] = await db.query(
      'INSERT INTO conhecimento_site (sistema, categoria, titulo, conteudo, tags, ordem) VALUES (?, ?, ?, ?, ?, ?)',
      [sistema || null, categoria || 'geral', titulo, conteudo, tags || null, ordem || 0]
    );
    res.json({ id: result.insertId });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

apiRouter.put('/conhecimento/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { sistema, categoria, titulo, conteudo, tags, ordem, ativo } = req.body;
    await db.query(
      'UPDATE conhecimento_site SET sistema = ?, categoria = ?, titulo = ?, conteudo = ?, tags = ?, ordem = ?, ativo = ? WHERE id = ?',
      [sistema || null, categoria, titulo, conteudo, tags || null, ordem || 0, ativo !== undefined ? ativo : 1, id]
    );
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

apiRouter.delete('/conhecimento/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM conhecimento_site WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ==========================================
// CHAT CLEUSA (IA com Gemini + RAG)
// ==========================================
async function buildKnowledgeContext(userMessage) {
  let context = '';
  try {
    // 1. Buscar sistemas
    try {
      const [sistemas] = await db.query('SELECT nome, titulo, descricao FROM sistemas_site WHERE ativo = 1');
      if (sistemas && sistemas.length) {
        context += '\n\n=== SISTEMAS FIORILLI ===\n';
        sistemas.forEach(s => context += `- ${s.nome}: ${s.titulo} (${s.descricao})\n`);
      }
    } catch (e) {}

    // 2. RAG: Buscar artigos técnicos
    try {
      const words = userMessage.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      if (words.length > 0) {
        const conditions = words.map(() => '(LOWER(titulo) LIKE ? OR LOWER(conteudo) LIKE ? OR LOWER(tags) LIKE ?)');
        const params = words.flatMap(w => [`%${w}%`, `%${w}%`, `%${w}%`]);
        const [artigos] = await db.query(`SELECT titulo, conteudo, categoria FROM conhecimento_site WHERE ativo = 1 AND (${conditions.join(' OR ')}) LIMIT 5`, params);
        if (artigos && artigos.length) {
          context += '\n\n=== PROCEDIMENTOS TÉCNICOS ===\n';
          artigos.forEach(a => context += `\n[${a.categoria.toUpperCase()}] ${a.titulo}: ${a.conteudo}\n`);
        }
      }
    } catch (e) {}
  } catch (err) { console.error('Erro no contexto:', err); }
  return context;
}

const SYSTEM_PROMPT = `Você é a Cleusa, assistente virtual da Martinez & Carvalho. 
Especialista em sistemas Fiorilli (SCPI, SIP, SIS, etc).
Responda de forma profissional e curta.
Se houver link de vídeo no contexto, SEMPRE informe.
Para suporte remoto, peça AnyDesk.`;

apiRouter.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) return res.status(500).json({ error: 'IA Key ausente' });

    const lastMsg = messages?.filter(m => m.role === 'user').pop()?.content || '';
    const knowledge = await buildKnowledgeContext(lastMsg);
    const fullPrompt = SYSTEM_PROMPT + knowledge;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: 'system: ' + fullPrompt }] },
          ...(messages || []).map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          }))
        ]
      })
    });

    if (!response.ok) return res.status(500).json({ error: 'Erro na IA' });

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
          } catch(e) {}
        }
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Registrar rotas
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Teste de conexão
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

export default app;

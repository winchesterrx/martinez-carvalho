import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ==========================================
// HEALTH CHECK
// ==========================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', message: 'API Martinez & Carvalho operando' });
});

app.get('/api/db-test', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 as test');
    res.json({ success: true, message: 'Conexão com o banco estabelecida!', data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Falha na conexão', error: error.message });
  }
});

// ==========================================
// AUTH
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { usuario, senha } = req.body;
    const [rows] = await db.query('SELECT * FROM usuarios_site WHERE usuario = ? AND senha_hash = ? AND ativo = 1', [usuario, senha]);
    if (rows.length > 0) {
      await db.query('UPDATE usuarios_site SET ultimo_login = NOW() WHERE id = ?', [rows[0].id]);
      const user = { id: rows[0].id, nome: rows[0].nome, usuario: rows[0].usuario, papel: rows[0].papel };
      res.json({ success: true, token: 'martinez-jwt-' + Date.now(), user });
    } else {
      res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/verify', (req, res) => {
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
app.get('/api/sistemas', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM sistemas_site WHERE ativo = 1 ORDER BY ordem ASC, id ASC');
    const parsed = rows.map(r => ({
      ...r,
      features: safeJsonParse(r.features, []),
      modulos: safeJsonParse(r.modulos, []),
      beneficios: safeJsonParse(r.beneficios, []),
    }));
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/sistemas/all', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM sistemas_site ORDER BY ordem ASC, id ASC');
    const parsed = rows.map(r => ({
      ...r,
      features: safeJsonParse(r.features, []),
      modulos: safeJsonParse(r.modulos, []),
      beneficios: safeJsonParse(r.beneficios, []),
    }));
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/sistemas/:slug', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM sistemas_site WHERE slug = ? AND ativo = 1', [req.params.slug]);
    if (rows.length === 0) return res.status(404).json({ error: 'Sistema não encontrado' });
    const r = rows[0];
    res.json({
      ...r,
      features: safeJsonParse(r.features, []),
      modulos: safeJsonParse(r.modulos, []),
      beneficios: safeJsonParse(r.beneficios, []),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/sistemas', async (req, res) => {
  try {
    const { slug, icone, nome, titulo, descricao, tagline, features, modulos, beneficios, ordem, ativo } = req.body;
    const [result] = await db.query(
      'INSERT INTO sistemas_site (slug, icone, nome, titulo, descricao, tagline, features, modulos, beneficios, ordem, ativo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [slug, icone || 'Calculator', nome, titulo, descricao, tagline, JSON.stringify(features || []), JSON.stringify(modulos || []), JSON.stringify(beneficios || []), ordem || 0, ativo !== undefined ? ativo : 1]
    );
    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/sistemas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { slug, icone, nome, titulo, descricao, tagline, features, modulos, beneficios, ordem, ativo } = req.body;
    await db.query(
      'UPDATE sistemas_site SET slug = ?, icone = ?, nome = ?, titulo = ?, descricao = ?, tagline = ?, features = ?, modulos = ?, beneficios = ?, ordem = ?, ativo = ?, atualizado_em = NOW() WHERE id = ?',
      [slug, icone, nome, titulo, descricao, tagline, JSON.stringify(features || []), JSON.stringify(modulos || []), JSON.stringify(beneficios || []), ordem || 0, ativo !== undefined ? ativo : 1, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/sistemas/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM sistemas_site WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// VÍDEOS / TUTORIAIS
// ==========================================
app.get('/api/videos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM videos_site WHERE ativo = 1 ORDER BY ordem ASC, id ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/videos/all', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM videos_site ORDER BY ordem ASC, id ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/videos', async (req, res) => {
  try {
    const { titulo, descricao, url_video, duracao, topico, thumbnail_url, ordem } = req.body;
    const [result] = await db.query(
      'INSERT INTO videos_site (titulo, descricao, url_video, duracao, topico, thumbnail_url, ordem) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [titulo, descricao, url_video, duracao, topico, thumbnail_url || null, ordem || 0]
    );
    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/videos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, url_video, duracao, topico, thumbnail_url, ordem, ativo } = req.body;
    await db.query(
      'UPDATE videos_site SET titulo = ?, descricao = ?, url_video = ?, duracao = ?, topico = ?, thumbnail_url = ?, ordem = ?, ativo = ? WHERE id = ?',
      [titulo, descricao, url_video, duracao, topico, thumbnail_url || null, ordem || 0, ativo !== undefined ? ativo : 1, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/videos/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM videos_site WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// FERRAMENTAS DE SUPORTE
// ==========================================
app.get('/api/ferramentas', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ferramentas_site WHERE ativo = 1 ORDER BY ordem ASC, id ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/ferramentas/all', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ferramentas_site ORDER BY ordem ASC, id ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ferramentas', async (req, res) => {
  try {
    const { nome, descricao, url_download, icone, cor, ordem } = req.body;
    const [result] = await db.query(
      'INSERT INTO ferramentas_site (nome, descricao, url_download, icone, cor, ordem) VALUES (?, ?, ?, ?, ?, ?)',
      [nome, descricao, url_download, icone || 'Download', cor || 'from-primary to-primary-deep', ordem || 0]
    );
    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/ferramentas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, url_download, icone, cor, ordem, ativo } = req.body;
    await db.query(
      'UPDATE ferramentas_site SET nome = ?, descricao = ?, url_download = ?, icone = ?, cor = ?, ordem = ?, ativo = ? WHERE id = ?',
      [nome, descricao, url_download, icone, cor, ordem || 0, ativo !== undefined ? ativo : 1, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/ferramentas/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM ferramentas_site WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// SOBRE / QUEM SOMOS
// ==========================================
app.get('/api/sobre', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM sobre_site WHERE id = 1');
    res.json(rows[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/sobre', async (req, res) => {
  try {
    const {
      titulo, subtitulo, texto_principal, texto_secundario,
      imagem_1, imagem_2, imagem_3, imagem_4,
      stat_1_icone, stat_1_valor, stat_1_label,
      stat_2_icone, stat_2_valor, stat_2_label,
      stat_3_icone, stat_3_valor, stat_3_label
    } = req.body;
    await db.query(
      `INSERT INTO sobre_site (
        id, titulo, subtitulo, texto_principal, texto_secundario,
        imagem_1, imagem_2, imagem_3, imagem_4,
        stat_1_icone, stat_1_valor, stat_1_label,
        stat_2_icone, stat_2_valor, stat_2_label,
        stat_3_icone, stat_3_valor, stat_3_label, atualizado_em
      ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE
        titulo = VALUES(titulo), subtitulo = VALUES(subtitulo),
        texto_principal = VALUES(texto_principal), texto_secundario = VALUES(texto_secundario),
        imagem_1 = VALUES(imagem_1), imagem_2 = VALUES(imagem_2),
        imagem_3 = VALUES(imagem_3), imagem_4 = VALUES(imagem_4),
        stat_1_icone = VALUES(stat_1_icone), stat_1_valor = VALUES(stat_1_valor), stat_1_label = VALUES(stat_1_label),
        stat_2_icone = VALUES(stat_2_icone), stat_2_valor = VALUES(stat_2_valor), stat_2_label = VALUES(stat_2_label),
        stat_3_icone = VALUES(stat_3_icone), stat_3_valor = VALUES(stat_3_valor), stat_3_label = VALUES(stat_3_label),
        atualizado_em = NOW()`,
      [
        titulo, subtitulo, texto_principal, texto_secundario,
        imagem_1 || null, imagem_2 || null, imagem_3 || null, imagem_4 || null,
        stat_1_icone, stat_1_valor, stat_1_label,
        stat_2_icone, stat_2_valor, stat_2_label,
        stat_3_icone, stat_3_valor, stat_3_label
      ]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// CONTATO
// ==========================================
app.get('/api/contato', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM contato_site WHERE id = 1');
    res.json(rows[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/contato', async (req, res) => {
  try {
    const {
      telefone, email, endereco_rua, endereco_bairro, endereco_cidade, endereco_cep,
      cnpj, facebook_url, instagram_url, linkedin_url, whatsapp, mapa_url
    } = req.body;
    await db.query(
      `INSERT INTO contato_site (
        id, telefone, email, endereco_rua, endereco_bairro, endereco_cidade, endereco_cep,
        cnpj, facebook_url, instagram_url, linkedin_url, whatsapp, mapa_url, atualizado_em
      ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE
        telefone = VALUES(telefone), email = VALUES(email),
        endereco_rua = VALUES(endereco_rua), endereco_bairro = VALUES(endereco_bairro),
        endereco_cidade = VALUES(endereco_cidade), endereco_cep = VALUES(endereco_cep),
        cnpj = VALUES(cnpj), facebook_url = VALUES(facebook_url),
        instagram_url = VALUES(instagram_url), linkedin_url = VALUES(linkedin_url),
        whatsapp = VALUES(whatsapp), mapa_url = VALUES(mapa_url), atualizado_em = NOW()`,
      [telefone, email, endereco_rua, endereco_bairro, endereco_cidade, endereco_cep,
        cnpj, facebook_url || null, instagram_url || null, linkedin_url || null, whatsapp || null, mapa_url || null]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// CONFIGURAÇÕES (key/value)
// ==========================================
app.get('/api/configuracoes', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT chave, valor FROM configuracoes_site');
    const configs = rows.reduce((acc, row) => {
      acc[row.chave] = row.valor;
      return acc;
    }, {});
    res.json(configs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/configuracoes/:chave', async (req, res) => {
  try {
    const { chave } = req.params;
    const { valor } = req.body;
    await db.query(
      'INSERT INTO configuracoes_site (chave, valor) VALUES (?, ?) ON DUPLICATE KEY UPDATE valor = ?, atualizado_em = NOW()',
      [chave, valor, valor]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// HERO SLIDES
// ==========================================
app.get('/api/hero', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM hero_site WHERE ativo = 1 ORDER BY ordem ASC, id ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/hero/all', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM hero_site ORDER BY ordem ASC, id ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/hero', async (req, res) => {
  try {
    const { texto, ordem, ativo } = req.body;
    const [result] = await db.query(
      'INSERT INTO hero_site (texto, ordem, ativo) VALUES (?, ?, ?)',
      [texto, ordem || 0, ativo !== undefined ? ativo : 1]
    );
    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/hero/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { texto, ordem, ativo } = req.body;
    await db.query(
      'UPDATE hero_site SET texto = ?, ordem = ?, ativo = ? WHERE id = ?',
      [texto, ordem || 0, ativo !== undefined ? ativo : 1, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/hero/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM hero_site WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// PARCERIA
// ==========================================
app.get('/api/parceria', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM parceria_site WHERE id = 1');
    res.json(rows[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/parceria', async (req, res) => {
  try {
    const { titulo, subtitulo, descricao, badge_texto, logo_url } = req.body;
    await db.query(
      `INSERT INTO parceria_site (id, titulo, subtitulo, descricao, badge_texto, logo_url, atualizado_em)
       VALUES (1, ?, ?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE
        titulo = VALUES(titulo), subtitulo = VALUES(subtitulo),
        descricao = VALUES(descricao), badge_texto = VALUES(badge_texto),
        logo_url = VALUES(logo_url), atualizado_em = NOW()`,
      [titulo, subtitulo, descricao, badge_texto, logo_url || null]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// HELPER
// ==========================================
function safeJsonParse(str, fallback) {
  if (!str) return fallback;
  try { return JSON.parse(str); } catch { return fallback; }
}

// Exporta o app
export default app;

// Execução local
import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`✅ API Martinez & Carvalho rodando na porta ${PORT}`);
  });
}

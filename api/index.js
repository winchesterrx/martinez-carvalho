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
// CONHECIMENTO (BASE DA IA)
// ==========================================
app.get('/api/conhecimento', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM conhecimento_site WHERE ativo = 1 ORDER BY ordem ASC, id ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/conhecimento/all', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM conhecimento_site ORDER BY ordem ASC, id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/conhecimento', async (req, res) => {
  try {
    const { sistema, categoria, titulo, conteudo, tags, ordem } = req.body;
    const [result] = await db.query(
      'INSERT INTO conhecimento_site (sistema, categoria, titulo, conteudo, tags, ordem) VALUES (?, ?, ?, ?, ?, ?)',
      [sistema || null, categoria || 'geral', titulo, conteudo, tags || null, ordem || 0]
    );
    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/conhecimento/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { sistema, categoria, titulo, conteudo, tags, ordem, ativo } = req.body;
    await db.query(
      'UPDATE conhecimento_site SET sistema = ?, categoria = ?, titulo = ?, conteudo = ?, tags = ?, ordem = ?, ativo = ? WHERE id = ?',
      [sistema || null, categoria, titulo, conteudo, tags || null, ordem || 0, ativo !== undefined ? ativo : 1, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/conhecimento/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM conhecimento_site WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// CHAT CLEUSA (IA com Gemini + RAG)
// ==========================================
async function buildKnowledgeContext(userMessage) {
  let context = '';
  try {
    // 1. Buscar sistemas
    const [sistemas] = await db.query('SELECT nome, titulo, descricao, tagline, modulos, beneficios FROM sistemas_site WHERE ativo = 1');
    if (sistemas.length) {
      context += '\n\n=== SISTEMAS FIORILLI ATENDIDOS ===\n';
      sistemas.forEach(s => {
        context += `\n**${s.nome} — ${s.titulo}**: ${s.descricao}\n${s.tagline || ''}\nMódulos: ${s.modulos || 'N/A'}\nBenefícios: ${s.beneficios || 'N/A'}\n`;
      });
    }

    // 2. Buscar vídeos/tutoriais
    const [videos] = await db.query('SELECT titulo, descricao, url_video, topico, duracao FROM videos_site WHERE ativo = 1');
    if (videos.length) {
      context += '\n\n=== VÍDEOS E TUTORIAIS DISPONÍVEIS ===\n';
      context += 'Quando o usuário perguntar como fazer algo, indique o vídeo relevante com o link.\n';
      videos.forEach(v => {
        context += `- "${v.titulo}" (${v.topico}, ${v.duracao || '?'}) ${v.url_video ? '→ ' + v.url_video : ''}: ${v.descricao || ''}\n`;
      });
    }

    // 3. Buscar ferramentas
    const [ferramentas] = await db.query('SELECT nome, descricao, url_download FROM ferramentas_site WHERE ativo = 1');
    if (ferramentas.length) {
      context += '\n\n=== FERRAMENTAS DE SUPORTE ===\n';
      ferramentas.forEach(f => {
        context += `- ${f.nome}: ${f.descricao} → Download: ${f.url_download}\n`;
      });
    }

    // 4. Buscar contato
    const [contato] = await db.query('SELECT * FROM contato_site WHERE id = 1');
    if (contato.length) {
      const c = contato[0];
      context += '\n\n=== DADOS DE CONTATO OFICIAIS ===\n';
      context += `Telefone: ${c.telefone || 'N/A'}\nE-mail: ${c.email || 'N/A'}\nWhatsApp: ${c.whatsapp || 'N/A'}\nEndereço: ${c.endereco_rua || ''}, ${c.endereco_bairro || ''}, ${c.endereco_cidade || ''} - CEP ${c.endereco_cep || ''}\nCNPJ: ${c.cnpj || 'N/A'}\n`;
    }

    // 5. RAG: Buscar artigos de conhecimento relevantes (por palavras-chave)
    const words = userMessage.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    if (words.length > 0) {
      const conditions = words.map(() => '(LOWER(titulo) LIKE ? OR LOWER(conteudo) LIKE ? OR LOWER(tags) LIKE ?)');
      const params = words.flatMap(w => [`%${w}%`, `%${w}%`, `%${w}%`]);
      const query = `SELECT titulo, conteudo, sistema, categoria FROM conhecimento_site WHERE ativo = 1 AND (${conditions.join(' OR ')}) LIMIT 10`;
      const [artigos] = await db.query(query, params);
      if (artigos.length) {
        context += '\n\n=== CONHECIMENTO TÉCNICO RELEVANTE ===\n';
        context += 'Use estas informações para responder com precisão:\n';
        artigos.forEach(a => {
          context += `\n[${a.categoria?.toUpperCase() || 'INFO'}${a.sistema ? ' - ' + a.sistema : ''}] ${a.titulo}\n${a.conteudo}\n`;
        });
      }
    }

    // 6. Buscar TODOS os artigos se não houver match (para perguntas genéricas)
    if (!context.includes('CONHECIMENTO TÉCNICO')) {
      const [allArtigos] = await db.query('SELECT titulo, conteudo, sistema, categoria FROM conhecimento_site WHERE ativo = 1 ORDER BY ordem ASC LIMIT 20');
      if (allArtigos.length) {
        context += '\n\n=== BASE DE CONHECIMENTO GERAL ===\n';
        allArtigos.forEach(a => {
          context += `\n[${a.categoria?.toUpperCase() || 'INFO'}${a.sistema ? ' - ' + a.sistema : ''}] ${a.titulo}\n${a.conteudo}\n`;
        });
      }
    }
  } catch (err) {
    console.error('Erro ao buscar contexto:', err.message);
  }
  return context;
}

const SYSTEM_PROMPT_BASE = `Você é a Cleusa, assistente virtual oficial da Martinez & Carvalho Software LTDA, empresa especializada em implantação e suporte dos sistemas Fiorilli Software para gestão pública municipal.

Diretrizes OBRIGATÓRIAS:
- Sempre responda em português do Brasil, com tom cordial, claro e profissional.
- Apresente-se apenas se o usuário cumprimentar; nas demais respostas vá direto ao ponto.
- Faça perguntas objetivas para entender o sistema, o cenário e o erro/dúvida.
- Forneça orientações passo a passo quando possível e cite caminhos de menu dos sistemas Fiorilli.
- Quando tiver um vídeo tutorial relevante na base de conhecimento, SEMPRE indique com o link.
- Quando o problema exigir intervenção técnica, oriente o usuário a baixar o AnyDesk ou TeamViewer (disponíveis no portal de suporte) e informar o ID para atendimento remoto.
- NUNCA peça dados pessoais (nome, telefone, CPF, e-mail) com promessa de retornar. A empresa NÃO retorna contato via chat.
- Para atendimento humano, suporte urgente, orçamento, comercial ou contrato, SEMPRE indique os canais oficiais de contato que estão na base de conhecimento.
- Nunca invente informações de contrato, prazos ou valores.
- Use respostas curtas e bem formatadas (listas, negrito).
- Se não souber algo específico, diga honestamente e direcione para o telefone/e-mail oficial.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY não configurada no servidor.' });
    }

    // Build context from database
    const lastUserMsg = messages?.filter(m => m.role === 'user').pop()?.content || '';
    const knowledge = await buildKnowledgeContext(lastUserMsg);
    const fullSystemPrompt = SYSTEM_PROMPT_BASE + knowledge;

    // Call Gemini API (Google AI Studio)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`;

    const geminiMessages = [
      { role: 'user', parts: [{ text: 'system: ' + fullSystemPrompt }] },
      { role: 'model', parts: [{ text: 'Entendido. Sou a Cleusa, assistente virtual da Martinez & Carvalho. Estou pronta para ajudar com os sistemas Fiorilli.' }] },
      ...(messages || []).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))
    ];

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          topP: 0.9,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', response.status, errText);
      if (response.status === 429) {
        return res.status(429).json({ error: 'Muitas mensagens. Aguarde alguns segundos.' });
      }
      return res.status(500).json({ error: 'Erro ao conectar com a IA.' });
    }

    // Stream SSE response back
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    const processChunk = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          res.write('data: [DONE]\n\n');
          res.end();
          return;
        }

        buffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.trim() === '' || line.startsWith(':')) continue;

          if (line.startsWith('data: ')) {
            const json = line.slice(6).trim();
            if (json === '[DONE]') {
              res.write('data: [DONE]\n\n');
              res.end();
              return;
            }
            try {
              const parsed = JSON.parse(json);
              const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                // Convert to OpenAI-compatible SSE format for frontend compatibility
                const sseData = JSON.stringify({
                  choices: [{ delta: { content: text } }]
                });
                res.write(`data: ${sseData}\n\n`);
              }
            } catch {
              // ignore parse errors
            }
          }
        }
      }
    };

    processChunk().catch(err => {
      console.error('Stream error:', err);
      res.end();
    });

  } catch (error) {
    console.error('Chat error:', error);
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


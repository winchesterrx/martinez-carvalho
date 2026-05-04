const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

async function fetchJSON(url: string) {
  const res = await fetch(`${API_BASE}${url}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function postJSON(url: string, data: unknown) {
  const res = await fetch(`${API_BASE}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function putJSON(url: string, data: unknown) {
  const res = await fetch(`${API_BASE}${url}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function deleteJSON(url: string) {
  const res = await fetch(`${API_BASE}${url}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ============== PUBLIC FETCHERS ==============

export const fetchSistemas = () => fetchJSON('/sistemas');
export const fetchSistemaBySlug = (slug: string) => fetchJSON(`/sistemas/${slug}`);
export const fetchVideos = () => fetchJSON('/videos');
export const fetchFerramentas = () => fetchJSON('/ferramentas');
export const fetchSobre = () => fetchJSON('/sobre');
export const fetchContato = () => fetchJSON('/contato');
export const fetchHero = () => fetchJSON('/hero');
export const fetchParceria = () => fetchJSON('/parceria');
export const fetchConfiguracoes = () => fetchJSON('/configuracoes');

// ============== ADMIN FETCHERS ==============

export const fetchSistemasAll = () => fetchJSON('/sistemas/all');
export const fetchVideosAll = () => fetchJSON('/videos/all');
export const fetchFerramentasAll = () => fetchJSON('/ferramentas/all');
export const fetchHeroAll = () => fetchJSON('/hero/all');

// ============== AUTH ==============

export const loginAdmin = (usuario: string, senha: string) =>
  postJSON('/auth/login', { usuario, senha });

export const verifyAuth = async () => {
  const token = localStorage.getItem('martinez_token');
  if (!token) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.valid === true;
  } catch {
    return false;
  }
};

// ============== CRUD HELPERS ==============

// Sistemas
export const createSistema = (data: unknown) => postJSON('/sistemas', data);
export const updateSistema = (id: number, data: unknown) => putJSON(`/sistemas/${id}`, data);
export const deleteSistema = (id: number) => deleteJSON(`/sistemas/${id}`);

// Vídeos
export const createVideo = (data: unknown) => postJSON('/videos', data);
export const updateVideo = (id: number, data: unknown) => putJSON(`/videos/${id}`, data);
export const deleteVideo = (id: number) => deleteJSON(`/videos/${id}`);

// Ferramentas
export const createFerramenta = (data: unknown) => postJSON('/ferramentas', data);
export const updateFerramenta = (id: number, data: unknown) => putJSON(`/ferramentas/${id}`, data);
export const deleteFerramenta = (id: number) => deleteJSON(`/ferramentas/${id}`);

// Sobre
export const updateSobre = (data: unknown) => putJSON('/sobre', data);

// Contato
export const updateContato = (data: unknown) => putJSON('/contato', data);

// Hero
export const createHeroSlide = (data: unknown) => postJSON('/hero', data);
export const updateHeroSlide = (id: number, data: unknown) => putJSON(`/hero/${id}`, data);
export const deleteHeroSlide = (id: number) => deleteJSON(`/hero/${id}`);

// Conhecimento (IA)
export const fetchConhecimentoAll = () => fetchJSON('/conhecimento/all');
export const createConhecimento = (data: unknown) => postJSON('/conhecimento', data);
export const updateConhecimento = (id: number, data: unknown) => putJSON(`/conhecimento/${id}`, data);
export const deleteConhecimento = (id: number) => deleteJSON(`/conhecimento/${id}`);

// Parceria
export const updateParceria = (data: unknown) => putJSON('/parceria', data);

// Configurações
export const updateConfiguracao = (chave: string, valor: string) =>
  putJSON(`/configuracoes/${chave}`, { valor });

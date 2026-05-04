import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Save, X, Loader2, Play } from "lucide-react";
import { fetchVideosAll, createVideo, updateVideo, deleteVideo } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

type Video = {
  id?: number;
  titulo: string;
  descricao: string;
  url_video: string;
  duracao: string;
  topico: string;
  thumbnail_url: string;
  ordem: number;
  ativo: number;
};

const EMPTY: Video = { titulo: "", descricao: "", url_video: "", duracao: "", topico: "", thumbnail_url: "", ordem: 0, ativo: 1 };

const VideosManager = () => {
  const qc = useQueryClient();
  const { data: videos = [], isLoading } = useQuery({ queryKey: ["admin-videos"], queryFn: fetchVideosAll });
  const [editing, setEditing] = useState<Video | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) await updateVideo(editing.id, editing);
      else await createVideo(editing);
      toast({ title: "Sucesso", description: "Vídeo salvo!" });
      qc.invalidateQueries({ queryKey: ["admin-videos"] });
      setEditing(null);
    } catch (e: unknown) {
      toast({ title: "Erro", description: String(e), variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir este vídeo?")) return;
    try {
      await deleteVideo(id);
      toast({ title: "Excluído" });
      qc.invalidateQueries({ queryKey: ["admin-videos"] });
    } catch (e: unknown) {
      toast({ title: "Erro", description: String(e), variant: "destructive" });
    }
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Vídeos & Tutoriais</h2>
          <p className="text-sm text-muted-foreground">Gerencie os vídeos exibidos na seção de suporte</p>
        </div>
        <button onClick={() => setEditing({ ...EMPTY })} className="btn-gradient px-4 py-2.5 rounded-xl text-sm flex items-center gap-2">
          <Plus size={18} /> Novo Vídeo
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((v: Video) => (
          <div key={v.id} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-brand-dark to-brand-gray flex items-center justify-center relative">
              {v.url_video && (
                <a href={v.url_video} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Play className="text-white ml-0.5" size={20} fill="currentColor" />
                  </div>
                </a>
              )}
              {v.duracao && <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">{v.duracao}</span>}
              {!v.ativo && <span className="absolute top-2 right-2 bg-destructive text-white text-xs px-2 py-0.5 rounded">Inativo</span>}
            </div>
            <div className="p-4">
              <span className="text-xs font-semibold text-primary uppercase">{v.topico}</span>
              <h4 className="font-semibold text-foreground mt-1">{v.titulo}</h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{v.descricao}</p>
              <div className="flex gap-1 mt-3">
                <button onClick={() => setEditing({ ...v })} className="flex-1 py-2 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors flex items-center justify-center gap-1">
                  <Pencil size={14} /> Editar
                </button>
                <button onClick={() => handleDelete(v.id!)} className="py-2 px-3 text-sm rounded-lg border border-border hover:bg-destructive/10 hover:text-destructive transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-lg font-bold">{editing.id ? "Editar Vídeo" : "Novo Vídeo"}</h3>
              <button onClick={() => setEditing(null)} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium">Título</label>
                <input value={editing.titulo} onChange={e => setEditing({...editing, titulo: e.target.value})} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium">URL do Vídeo (YouTube/Vimeo)</label>
                <input value={editing.url_video} onChange={e => setEditing({...editing, url_video: e.target.value})} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" placeholder="https://youtube.com/watch?v=..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Duração</label>
                  <input value={editing.duracao} onChange={e => setEditing({...editing, duracao: e.target.value})} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" placeholder="12:35" />
                </div>
                <div>
                  <label className="text-sm font-medium">Tópico</label>
                  <input value={editing.topico} onChange={e => setEditing({...editing, topico: e.target.value})} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" placeholder="Contabilidade" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <textarea value={editing.descricao} onChange={e => setEditing({...editing, descricao: e.target.value})} rows={2} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Ordem</label>
                  <input type="number" value={editing.ordem} onChange={e => setEditing({...editing, ordem: Number(e.target.value)})} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" />
                </div>
                <div className="flex items-end pb-0.5">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={!!editing.ativo} onChange={e => setEditing({...editing, ativo: e.target.checked ? 1 : 0})} className="accent-primary" />
                    <span className="font-medium">Ativo</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="btn-gradient px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideosManager;

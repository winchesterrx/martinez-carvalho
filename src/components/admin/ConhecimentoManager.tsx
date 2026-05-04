import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Save, X, Loader2, BrainCircuit } from "lucide-react";
import { fetchConhecimentoAll, createConhecimento, updateConhecimento, deleteConhecimento } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

type Artigo = {
  id?: number;
  sistema: string;
  categoria: string;
  titulo: string;
  conteudo: string;
  tags: string;
  ordem: number;
  ativo: number;
};

const EMPTY: Artigo = { sistema: "geral", categoria: "FAQ", titulo: "", conteudo: "", tags: "", ordem: 0, ativo: 1 };
const CATEGORIAS = ["FAQ", "Procedimento", "Erro Comum", "Tutorial", "Geral"];
const SISTEMAS = ["geral", "SCPI", "SIP", "SIS", "Arrecadação", "Educação", "Transparência"];

const ConhecimentoManager = () => {
  const qc = useQueryClient();
  const { data: artigos = [], isLoading } = useQuery({ queryKey: ["admin-conhecimento"], queryFn: fetchConhecimentoAll });
  const [editing, setEditing] = useState<Artigo | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) await updateConhecimento(editing.id, editing);
      else await createConhecimento(editing);
      toast({ title: "Sucesso", description: "Conhecimento salvo!" });
      qc.invalidateQueries({ queryKey: ["admin-conhecimento"] });
      setEditing(null);
    } catch (e: unknown) {
      toast({ title: "Erro", description: String(e), variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir este conhecimento? A Cleusa deixará de saber isso.")) return;
    try {
      await deleteConhecimento(id);
      toast({ title: "Excluído" });
      qc.invalidateQueries({ queryKey: ["admin-conhecimento"] });
    } catch (e: unknown) {
      toast({ title: "Erro", description: String(e), variant: "destructive" });
    }
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Base de Conhecimento (IA)</h2>
          <p className="text-sm text-muted-foreground">Treine a Cleusa com manuais, dicas e procedimentos técnicos</p>
        </div>
        <button onClick={() => setEditing({ ...EMPTY })} className="btn-gradient px-4 py-2.5 rounded-xl text-sm flex items-center gap-2">
          <Plus size={18} /> Novo Artigo
        </button>
      </div>

      <div className="space-y-3">
        {artigos.map((a: Artigo) => (
          <div key={a.id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
              <BrainCircuit size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">{a.sistema}</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">{a.categoria}</span>
                <span className="font-bold text-foreground">{a.titulo}</span>
                {!a.ativo && <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded">Inativo</span>}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{a.conteudo}</p>
              {a.tags && <div className="mt-2 flex gap-1 flex-wrap">
                {a.tags.split(',').map(t => <span key={t} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">#{t.trim()}</span>)}
              </div>}
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => setEditing({ ...a })} className="w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground"><Pencil size={16} /></button>
              <button onClick={() => handleDelete(a.id!)} className="w-9 h-9 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-lg font-bold">{editing.id ? "Editar Conhecimento" : "Novo Artigo de Conhecimento"}</h3>
              <button onClick={() => setEditing(null)} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Sistema</label>
                  <select value={editing.sistema} onChange={e => setEditing({...editing, sistema: e.target.value})} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm">
                    {SISTEMAS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Categoria</label>
                  <select value={editing.categoria} onChange={e => setEditing({...editing, categoria: e.target.value})} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm">
                    {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Título (Pergunta ou Assunto)</label>
                <input value={editing.titulo} onChange={e => setEditing({...editing, titulo: e.target.value})} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" placeholder="Ex: Como gerar o arquivo AUDESP no SCPI?" />
              </div>
              <div>
                <label className="text-sm font-medium">Conteúdo (Resposta ou Procedimento)</label>
                <textarea value={editing.conteudo} onChange={e => setEditing({...editing, conteudo: e.target.value})} rows={6} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" placeholder="Descreva o passo a passo..." />
              </div>
              <div>
                <label className="text-sm font-medium">Tags de Busca (separadas por vírgula)</label>
                <input value={editing.tags} onChange={e => setEditing({...editing, tags: e.target.value})} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" placeholder="audesp, tribunal de contas, fechamento, scpi" />
                <p className="text-[10px] text-muted-foreground mt-1">A Cleusa usa estas tags para encontrar este artigo rapidamente.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Ordem de Prioridade</label>
                  <input type="number" value={editing.ordem} onChange={e => setEditing({...editing, ordem: Number(e.target.value)})} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" />
                </div>
                <div className="flex items-end pb-0.5">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={!!editing.ativo} onChange={e => setEditing({...editing, ativo: e.target.checked ? 1 : 0})} className="accent-primary" />
                    <span className="font-medium">Artigo Ativo</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2.5 border border-border rounded-xl text-sm hover:bg-muted">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="btn-gradient px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Salvar no Cérebro da Cleusa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConhecimentoManager;

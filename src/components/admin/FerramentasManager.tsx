import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Save, X, Loader2, Download } from "lucide-react";
import { fetchFerramentasAll, createFerramenta, updateFerramenta, deleteFerramenta } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

type Ferramenta = {
  id?: number;
  nome: string;
  descricao: string;
  url_download: string;
  icone: string;
  cor: string;
  ordem: number;
  ativo: number;
};

const EMPTY: Ferramenta = { nome: "", descricao: "", url_download: "", icone: "Download", cor: "from-primary to-primary-deep", ordem: 0, ativo: 1 };
const ICONS = ["Download", "MonitorSmartphone", "FileCheck2", "FileText", "Wrench", "Settings", "Shield", "ExternalLink"];
const COLORS = [
  { label: "Laranja (padrão)", value: "from-primary to-primary-deep" },
  { label: "Vermelho", value: "from-red-500 to-red-600" },
  { label: "Azul", value: "from-blue-500 to-blue-600" },
  { label: "Verde", value: "from-emerald-500 to-emerald-600" },
  { label: "Roxo", value: "from-purple-500 to-purple-600" },
  { label: "Cinza", value: "from-gray-500 to-gray-600" },
];

const FerramentasManager = () => {
  const qc = useQueryClient();
  const { data: ferramentas = [], isLoading } = useQuery({ queryKey: ["admin-ferramentas"], queryFn: fetchFerramentasAll });
  const [editing, setEditing] = useState<Ferramenta | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) await updateFerramenta(editing.id, editing);
      else await createFerramenta(editing);
      toast({ title: "Sucesso", description: "Ferramenta salva!" });
      qc.invalidateQueries({ queryKey: ["admin-ferramentas"] });
      setEditing(null);
    } catch (e: unknown) {
      toast({ title: "Erro", description: String(e), variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir esta ferramenta?")) return;
    try {
      await deleteFerramenta(id);
      toast({ title: "Excluído" });
      qc.invalidateQueries({ queryKey: ["admin-ferramentas"] });
    } catch (e: unknown) {
      toast({ title: "Erro", description: String(e), variant: "destructive" });
    }
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Ferramentas de Suporte</h2>
          <p className="text-sm text-muted-foreground">Gerencie os downloads e ferramentas exibidos no site</p>
        </div>
        <button onClick={() => setEditing({ ...EMPTY })} className="btn-gradient px-4 py-2.5 rounded-xl text-sm flex items-center gap-2">
          <Plus size={18} /> Nova Ferramenta
        </button>
      </div>

      <div className="space-y-3">
        {ferramentas.map((f: Ferramenta) => (
          <div key={f.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.cor} flex items-center justify-center text-white shrink-0`}>
              <Download size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-foreground">{f.nome}</span>
              {!f.ativo && <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded ml-2">Inativo</span>}
              <p className="text-xs text-muted-foreground truncate">{f.descricao}</p>
              <p className="text-xs text-primary truncate">{f.url_download}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => setEditing({ ...f })} className="w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"><Pencil size={16} /></button>
              <button onClick={() => handleDelete(f.id!)} className="w-9 h-9 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-lg font-bold">{editing.id ? "Editar Ferramenta" : "Nova Ferramenta"}</h3>
              <button onClick={() => setEditing(null)} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium">Nome</label>
                <input value={editing.nome} onChange={e => setEditing({...editing, nome: e.target.value})} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" placeholder="AnyDesk" />
              </div>
              <div>
                <label className="text-sm font-medium">URL de Download</label>
                <input value={editing.url_download} onChange={e => setEditing({...editing, url_download: e.target.value})} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" placeholder="https://..." />
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <textarea value={editing.descricao} onChange={e => setEditing({...editing, descricao: e.target.value})} rows={2} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Ícone</label>
                  <select value={editing.icone} onChange={e => setEditing({...editing, icone: e.target.value})} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm">
                    {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Cor</label>
                  <select value={editing.cor} onChange={e => setEditing({...editing, cor: e.target.value})} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm">
                    {COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
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

export default FerramentasManager;

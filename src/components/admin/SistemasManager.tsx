import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Save, X, Loader2, GripVertical } from "lucide-react";
import { fetchSistemasAll, createSistema, updateSistema, deleteSistema } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

type Sistema = {
  id?: number;
  slug: string;
  icone: string;
  nome: string;
  titulo: string;
  descricao: string;
  tagline: string;
  features: { title: string; description: string }[];
  modulos: string[];
  beneficios: string[];
  ordem: number;
  ativo: number;
};

const EMPTY: Sistema = {
  slug: "", icone: "Calculator", nome: "", titulo: "", descricao: "", tagline: "",
  features: [], modulos: [], beneficios: [], ordem: 0, ativo: 1,
};

const ICONS = ["Calculator", "Wallet", "HeartPulse", "Receipt", "GraduationCap", "Eye", "Monitor", "Shield", "FileText", "Settings"];

const SistemasManager = () => {
  const qc = useQueryClient();
  const { data: sistemas = [], isLoading } = useQuery({ queryKey: ["admin-sistemas"], queryFn: fetchSistemasAll });
  const [editing, setEditing] = useState<Sistema | null>(null);
  const [saving, setSaving] = useState(false);

  const [newFeature, setNewFeature] = useState({ title: "", description: "" });
  const [newModulo, setNewModulo] = useState("");
  const [newBeneficio, setNewBeneficio] = useState("");

  const openNew = () => setEditing({ ...EMPTY });
  const openEdit = (s: Sistema) => setEditing({ ...s });
  const close = () => setEditing(null);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        await updateSistema(editing.id, editing);
      } else {
        await createSistema(editing);
      }
      toast({ title: "Sucesso", description: "Sistema salvo com sucesso!" });
      qc.invalidateQueries({ queryKey: ["admin-sistemas"] });
      close();
    } catch (e: unknown) {
      toast({ title: "Erro", description: String(e), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este sistema?")) return;
    try {
      await deleteSistema(id);
      toast({ title: "Excluído", description: "Sistema removido." });
      qc.invalidateQueries({ queryKey: ["admin-sistemas"] });
    } catch (e: unknown) {
      toast({ title: "Erro", description: String(e), variant: "destructive" });
    }
  };

  const addFeature = () => {
    if (!newFeature.title || !editing) return;
    setEditing({ ...editing, features: [...editing.features, { ...newFeature }] });
    setNewFeature({ title: "", description: "" });
  };
  const removeFeature = (i: number) => {
    if (!editing) return;
    setEditing({ ...editing, features: editing.features.filter((_, idx) => idx !== i) });
  };
  const addModulo = () => {
    if (!newModulo || !editing) return;
    setEditing({ ...editing, modulos: [...editing.modulos, newModulo] });
    setNewModulo("");
  };
  const removeModulo = (i: number) => {
    if (!editing) return;
    setEditing({ ...editing, modulos: editing.modulos.filter((_, idx) => idx !== i) });
  };
  const addBeneficio = () => {
    if (!newBeneficio || !editing) return;
    setEditing({ ...editing, beneficios: [...editing.beneficios, newBeneficio] });
    setNewBeneficio("");
  };
  const removeBeneficio = (i: number) => {
    if (!editing) return;
    setEditing({ ...editing, beneficios: editing.beneficios.filter((_, idx) => idx !== i) });
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Sistemas Fiorilli</h2>
          <p className="text-sm text-muted-foreground">Gerencie os sistemas exibidos no site</p>
        </div>
        <button onClick={openNew} className="btn-gradient px-4 py-2.5 rounded-xl text-sm flex items-center gap-2">
          <Plus size={18} /> Novo Sistema
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {sistemas.map((s: Sistema) => (
          <div key={s.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <GripVertical className="text-muted-foreground/40 shrink-0" size={18} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">{s.nome}</span>
                <span className="text-sm text-muted-foreground">— {s.titulo}</span>
                {!s.ativo && <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded">Inativo</span>}
              </div>
              <p className="text-xs text-muted-foreground truncate">{s.descricao}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => openEdit(s)} className="w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground">
                <Pencil size={16} />
              </button>
              <button onClick={() => handleDelete(s.id!)} className="w-9 h-9 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8 px-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-lg font-bold">{editing.id ? "Editar Sistema" : "Novo Sistema"}</h3>
              <button onClick={close} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Slug (URL)</label>
                  <input value={editing.slug} onChange={e => setEditing({...editing, slug: e.target.value})} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" placeholder="contabilidade" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Ícone</label>
                  <select value={editing.icone} onChange={e => setEditing({...editing, icone: e.target.value})} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm">
                    {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Nome</label>
                  <input value={editing.nome} onChange={e => setEditing({...editing, nome: e.target.value})} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" placeholder="SCPI" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Título</label>
                  <input value={editing.titulo} onChange={e => setEditing({...editing, titulo: e.target.value})} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" placeholder="Contabilidade Pública" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Descrição</label>
                <textarea value={editing.descricao} onChange={e => setEditing({...editing, descricao: e.target.value})} rows={2} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Tagline</label>
                <textarea value={editing.tagline} onChange={e => setEditing({...editing, tagline: e.target.value})} rows={2} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Ordem</label>
                  <input type="number" value={editing.ordem} onChange={e => setEditing({...editing, ordem: Number(e.target.value)})} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" />
                </div>
                <div className="flex items-end gap-2 pb-0.5">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={!!editing.ativo} onChange={e => setEditing({...editing, ativo: e.target.checked ? 1 : 0})} className="accent-primary" />
                    <span className="font-medium">Ativo</span>
                  </label>
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="text-sm font-bold text-foreground block mb-2">Diferenciais (Features)</label>
                {editing.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2 bg-muted rounded-lg px-3 py-2">
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium">{f.title}</span>
                      <span className="text-xs text-muted-foreground block truncate">{f.description}</span>
                    </div>
                    <button onClick={() => removeFeature(i)} className="text-destructive hover:bg-destructive/10 rounded p-1"><X size={14} /></button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input value={newFeature.title} onChange={e => setNewFeature({...newFeature, title: e.target.value})} placeholder="Título" className="flex-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" />
                  <input value={newFeature.description} onChange={e => setNewFeature({...newFeature, description: e.target.value})} placeholder="Descrição" className="flex-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" />
                  <button onClick={addFeature} className="px-3 py-2 bg-primary text-white rounded-lg text-sm"><Plus size={16} /></button>
                </div>
              </div>

              {/* Módulos */}
              <div>
                <label className="text-sm font-bold text-foreground block mb-2">Módulos</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editing.modulos.map((m, i) => (
                    <span key={i} className="inline-flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm">
                      {m} <button onClick={() => removeModulo(i)} className="text-destructive"><X size={12} /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={newModulo} onChange={e => setNewModulo(e.target.value)} placeholder="Nome do módulo" className="flex-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addModulo())} />
                  <button onClick={addModulo} className="px-3 py-2 bg-primary text-white rounded-lg text-sm"><Plus size={16} /></button>
                </div>
              </div>

              {/* Benefícios */}
              <div>
                <label className="text-sm font-bold text-foreground block mb-2">Benefícios</label>
                <div className="space-y-1 mb-2">
                  {editing.beneficios.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 text-sm">
                      <span className="flex-1">{b}</span>
                      <button onClick={() => removeBeneficio(i)} className="text-destructive"><X size={14} /></button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={newBeneficio} onChange={e => setNewBeneficio(e.target.value)} placeholder="Benefício" className="flex-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addBeneficio())} />
                  <button onClick={addBeneficio} className="px-3 py-2 bg-primary text-white rounded-lg text-sm"><Plus size={16} /></button>
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-2">
              <button onClick={close} className="px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="btn-gradient px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SistemasManager;

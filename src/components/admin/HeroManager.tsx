import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Save, X, Loader2 } from "lucide-react";
import { fetchHeroAll, createHeroSlide, updateHeroSlide, deleteHeroSlide } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

type Slide = { id?: number; texto: string; ordem: number; ativo: number };
const EMPTY: Slide = { texto: "", ordem: 0, ativo: 1 };

const HeroManager = () => {
  const qc = useQueryClient();
  const { data: slides = [], isLoading } = useQuery({ queryKey: ["admin-hero"], queryFn: fetchHeroAll });
  const [editing, setEditing] = useState<Slide | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) await updateHeroSlide(editing.id, editing);
      else await createHeroSlide(editing);
      toast({ title: "Sucesso", description: "Slide salvo!" });
      qc.invalidateQueries({ queryKey: ["admin-hero"] });
      setEditing(null);
    } catch (e: unknown) {
      toast({ title: "Erro", description: String(e), variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir este slide?")) return;
    try {
      await deleteHeroSlide(id);
      toast({ title: "Excluído" });
      qc.invalidateQueries({ queryKey: ["admin-hero"] });
    } catch (e: unknown) {
      toast({ title: "Erro", description: String(e), variant: "destructive" });
    }
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Hero / Banner</h2>
          <p className="text-sm text-muted-foreground">Frases que aparecem no carrossel do topo</p>
        </div>
        <button onClick={() => setEditing({ ...EMPTY })} className="btn-gradient px-4 py-2.5 rounded-xl text-sm flex items-center gap-2">
          <Plus size={18} /> Novo Slide
        </button>
      </div>
      <div className="space-y-3">
        {slides.map((s: Slide) => (
          <div key={s.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">{s.ordem}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">{s.texto}</p>
              {!s.ativo && <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded">Inativo</span>}
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => setEditing({ ...s })} className="w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground"><Pencil size={16} /></button>
              <button onClick={() => handleDelete(s.id!)} className="w-9 h-9 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-lg font-bold">{editing.id ? "Editar Slide" : "Novo Slide"}</h3>
              <button onClick={() => setEditing(null)} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="text-sm font-medium">Texto do Slide</label><textarea value={editing.texto} onChange={e => setEditing({...editing, texto: e.target.value})} rows={3} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium">Ordem</label><input type="number" value={editing.ordem} onChange={e => setEditing({...editing, ordem: Number(e.target.value)})} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" /></div>
                <div className="flex items-end pb-0.5"><label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={!!editing.ativo} onChange={e => setEditing({...editing, ativo: e.target.checked ? 1 : 0})} className="accent-primary" /><span className="font-medium">Ativo</span></label></div>
              </div>
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2.5 border border-border rounded-xl text-sm hover:bg-muted">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="btn-gradient px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">{saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroManager;

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Save, Loader2 } from "lucide-react";
import { fetchSobre, updateSobre } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const SobreManager = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-sobre"], queryFn: fetchSobre });
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (data) setForm(data); }, [data]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSobre(form);
      toast({ title: "Sucesso", description: "Seção atualizada!" });
      qc.invalidateQueries({ queryKey: ["admin-sobre"] });
    } catch (e: unknown) {
      toast({ title: "Erro", description: String(e), variant: "destructive" });
    } finally { setSaving(false); }
  };

  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Quem Somos</h2>
          <p className="text-sm text-muted-foreground">Edite textos e estatísticas</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-gradient px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Salvar
        </button>
      </div>
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="text-sm font-medium">Título</label><input value={form.titulo||""} onChange={e=>set("titulo",e.target.value)} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" /></div>
          <div><label className="text-sm font-medium">Subtítulo (gradiente)</label><input value={form.subtitulo||""} onChange={e=>set("subtitulo",e.target.value)} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" /></div>
        </div>
        <div><label className="text-sm font-medium">Texto Principal</label><textarea value={form.texto_principal||""} onChange={e=>set("texto_principal",e.target.value)} rows={3} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" /></div>
        <div><label className="text-sm font-medium">Texto Secundário</label><textarea value={form.texto_secundario||""} onChange={e=>set("texto_secundario",e.target.value)} rows={3} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" /></div>
        <hr className="border-border" />
        <h3 className="font-bold">Estatísticas</h3>
        {[1,2,3].map(n=>(
          <div key={n} className="grid grid-cols-3 gap-3">
            <div><label className="text-sm font-medium">Ícone {n}</label><select value={form[`stat_${n}_icone`]||""} onChange={e=>set(`stat_${n}_icone`,e.target.value)} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm">{["Award","Users","Building2","Star","Shield","Heart"].map(i=><option key={i} value={i}>{i}</option>)}</select></div>
            <div><label className="text-sm font-medium">Valor {n}</label><input value={form[`stat_${n}_valor`]||""} onChange={e=>set(`stat_${n}_valor`,e.target.value)} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" /></div>
            <div><label className="text-sm font-medium">Label {n}</label><input value={form[`stat_${n}_label`]||""} onChange={e=>set(`stat_${n}_label`,e.target.value)} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" /></div>
          </div>
        ))}
        <hr className="border-border" />
        <h3 className="font-bold">Imagens (URLs)</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[1,2,3,4].map(n=>(
            <div key={n}><label className="text-sm font-medium">Imagem {n}</label><input value={form[`imagem_${n}`]||""} onChange={e=>set(`imagem_${n}`,e.target.value)} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" placeholder="https://..." /></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SobreManager;

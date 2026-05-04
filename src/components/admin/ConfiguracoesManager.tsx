import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Save, Loader2 } from "lucide-react";
import { fetchConfiguracoes, updateConfiguracao } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const DEFAULT_KEYS = [
  { chave: "site_titulo", label: "Título do Site", placeholder: "Martinez & Carvalho" },
  { chave: "site_descricao", label: "Descrição (SEO)", placeholder: "Implantação e suporte Fiorilli..." },
  { chave: "hero_subtexto", label: "Subtexto do Hero", placeholder: "Mais de uma década modernizando..." },
  { chave: "divider_titulo", label: "Título Divider", placeholder: "Excelência em Atendimento..." },
  { chave: "divider_subtexto", label: "Subtexto Divider", placeholder: "Equipe certificada..." },
];

const ConfiguracoesManager = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-configs"], queryFn: fetchConfiguracoes });
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (data) setForm(data); }, [data]);

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const key of DEFAULT_KEYS) {
        if (form[key.chave] !== undefined) {
          await updateConfiguracao(key.chave, form[key.chave]);
        }
      }
      toast({ title: "Sucesso", description: "Configurações salvas!" });
      qc.invalidateQueries({ queryKey: ["admin-configs"] });
    } catch (e: unknown) {
      toast({ title: "Erro", description: String(e), variant: "destructive" });
    } finally { setSaving(false); }
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Configurações</h2>
          <p className="text-sm text-muted-foreground">Configurações gerais do site</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-gradient px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Salvar
        </button>
      </div>
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        {DEFAULT_KEYS.map(k => (
          <div key={k.chave}>
            <label className="text-sm font-medium text-foreground">{k.label}</label>
            <input
              value={form[k.chave] || ""}
              onChange={e => setForm({ ...form, [k.chave]: e.target.value })}
              placeholder={k.placeholder}
              className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConfiguracoesManager;

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Save, Loader2 } from "lucide-react";
import { fetchContato, updateContato } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const ContatoManager = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-contato"], queryFn: fetchContato });
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (data) setForm(data); }, [data]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateContato(form);
      toast({ title: "Sucesso", description: "Contato atualizado!" });
      qc.invalidateQueries({ queryKey: ["admin-contato"] });
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
          <h2 className="text-2xl font-bold text-foreground">Contato</h2>
          <p className="text-sm text-muted-foreground">Dados de contato e redes sociais</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-gradient px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Salvar
        </button>
      </div>
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="text-sm font-medium">Telefone</label><input value={form.telefone||""} onChange={e=>set("telefone",e.target.value)} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" /></div>
          <div><label className="text-sm font-medium">E-mail</label><input value={form.email||""} onChange={e=>set("email",e.target.value)} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" /></div>
        </div>
        <div><label className="text-sm font-medium">Rua / Endereço</label><input value={form.endereco_rua||""} onChange={e=>set("endereco_rua",e.target.value)} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" /></div>
        <div className="grid md:grid-cols-3 gap-4">
          <div><label className="text-sm font-medium">Bairro</label><input value={form.endereco_bairro||""} onChange={e=>set("endereco_bairro",e.target.value)} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" /></div>
          <div><label className="text-sm font-medium">Cidade/UF</label><input value={form.endereco_cidade||""} onChange={e=>set("endereco_cidade",e.target.value)} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" /></div>
          <div><label className="text-sm font-medium">CEP</label><input value={form.endereco_cep||""} onChange={e=>set("endereco_cep",e.target.value)} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" /></div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="text-sm font-medium">CNPJ</label><input value={form.cnpj||""} onChange={e=>set("cnpj",e.target.value)} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" /></div>
          <div><label className="text-sm font-medium">WhatsApp</label><input value={form.whatsapp||""} onChange={e=>set("whatsapp",e.target.value)} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" placeholder="5517999999999" /></div>
        </div>
        <hr className="border-border" />
        <h3 className="font-bold">Redes Sociais</h3>
        <div className="space-y-3">
          <div><label className="text-sm font-medium">Facebook URL</label><input value={form.facebook_url||""} onChange={e=>set("facebook_url",e.target.value)} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" /></div>
          <div><label className="text-sm font-medium">Instagram URL</label><input value={form.instagram_url||""} onChange={e=>set("instagram_url",e.target.value)} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" /></div>
          <div><label className="text-sm font-medium">LinkedIn URL</label><input value={form.linkedin_url||""} onChange={e=>set("linkedin_url",e.target.value)} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" /></div>
        </div>
        <hr className="border-border" />
        <div><label className="text-sm font-medium">URL do Mapa (embed Google)</label><input value={form.mapa_url||""} onChange={e=>set("mapa_url",e.target.value)} className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm" /></div>
      </div>
    </div>
  );
};

export default ContatoManager;

import { motion } from "framer-motion";
import { Download, Play, Wrench, Headphones } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchFerramentas, fetchVideos } from "@/lib/api";
import * as LucideIcons from "lucide-react";

const getIcon = (name: string) => {
  const icons = LucideIcons as Record<string, unknown>;
  return (icons[name] as React.ComponentType<{ size?: number }>) || LucideIcons.Download;
};

export const Support = () => {
  const { data: tools = [] } = useQuery({ queryKey: ["ferramentas"], queryFn: fetchFerramentas });
  const { data: tutorials = [] } = useQuery({ queryKey: ["videos"], queryFn: fetchVideos });

  return (
    <section id="suporte" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">Portal de Suporte</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            Atendimento <span className="text-gradient-primary">rápido e especializado</span>
          </h2>
          <p className="text-muted-foreground text-lg">Baixe as ferramentas de acesso remoto e acesse nossa biblioteca de tutoriais.</p>
        </motion.div>

        {/* Ferramentas */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Wrench className="text-primary" />
            <h3 className="text-2xl font-bold text-foreground">Central de Ferramentas</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((d: Record<string, unknown>, i: number) => {
              const Icon = getIcon(d.icone as string);
              return (
                <motion.div key={d.id as number} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} className="group flex flex-col bg-card border border-border rounded-2xl p-6 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${d.cor as string} flex items-center justify-center text-white shadow-lg mb-4`}>
                    <Icon size={26} />
                  </div>
                  <h4 className="text-lg font-bold text-foreground mb-1">{d.nome as string}</h4>
                  <p className="text-sm text-muted-foreground flex-1 mb-5">{d.descricao as string}</p>
                  <a href={d.url_download as string} target={(d.url_download as string).startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 btn-gradient px-4 py-2.5 rounded-lg text-sm">
                    <Download size={16} /> Download
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Tutoriais */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Headphones className="text-primary" />
            <h3 className="text-2xl font-bold text-foreground">Tutoriais & Treinamentos</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((t: Record<string, unknown>, i: number) => (
              <motion.div key={t.id as number} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }} className="group bg-card border border-border rounded-2xl overflow-hidden cursor-pointer hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 transition-all duration-300">
                <div className="relative aspect-video bg-gradient-to-br from-brand-dark to-brand-gray flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.3),transparent_70%)]" />
                  <div className="relative w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                    <Play className="text-white ml-1" size={26} fill="currentColor" />
                  </div>
                  {t.duracao && <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded">{t.duracao as string}</span>}
                </div>
                <div className="p-5">
                  <span className="inline-block text-xs font-semibold text-primary uppercase tracking-wider mb-2">{t.topico as string}</span>
                  <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">{t.titulo as string}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.descricao as string}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

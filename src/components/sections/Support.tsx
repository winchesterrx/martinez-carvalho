import { motion } from "framer-motion";
import { Download, Play, Monitor, Headphones } from "lucide-react";

const downloads = [
  {
    name: "AnyDesk",
    description: "Acesso remoto rápido e seguro para suporte imediato.",
    href: "https://anydesk.com/pt/downloads/windows",
    color: "from-red-500 to-red-600",
  },
  {
    name: "TeamViewer",
    description: "Conexão remota completa com o nosso time técnico.",
    href: "https://www.teamviewer.com/pt-br/baixar/windows/",
    color: "from-blue-500 to-blue-600",
  },
];

const tutorials = [
  { title: "Introdução ao SCPI", duration: "12:35", topic: "Contabilidade" },
  { title: "Folha mensal no SIP", duration: "18:20", topic: "Folha de Pagamento" },
  { title: "Atendimento e-SUS no SIS", duration: "15:10", topic: "Saúde" },
  { title: "Lançamento de IPTU", duration: "09:48", topic: "Arrecadação" },
  { title: "Matrícula escolar online", duration: "11:22", topic: "Educação" },
  { title: "Publicação Transparência", duration: "07:55", topic: "Transparência" },
];

export const Support = () => {
  return (
    <section id="suporte" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Portal de Suporte
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            Atendimento{" "}
            <span className="text-gradient-primary">rápido e especializado</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Baixe as ferramentas de acesso remoto e acesse nossa biblioteca de
            tutoriais.
          </p>
        </motion.div>

        {/* Downloads */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Monitor className="text-primary" />
            <h3 className="text-2xl font-bold text-foreground">Acesso Remoto</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {downloads.map((d, i) => (
              <motion.a
                key={d.name}
                href={d.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex items-center gap-5 bg-card border border-border rounded-2xl p-6 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${d.color} flex items-center justify-center text-white shadow-lg`}
                >
                  <Download size={28} />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-foreground mb-1">
                    Baixar {d.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">{d.description}</p>
                </div>
                <Download
                  className="text-muted-foreground group-hover:text-primary transition-colors"
                  size={22}
                />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Tutorials */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Headphones className="text-primary" />
            <h3 className="text-2xl font-bold text-foreground">Tutoriais & Treinamentos</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group bg-card border border-border rounded-2xl overflow-hidden cursor-pointer hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative aspect-video bg-gradient-to-br from-brand-dark to-brand-gray flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.3),transparent_70%)]" />
                  <div className="relative w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                    <Play className="text-white ml-1" size={26} fill="currentColor" />
                  </div>
                  <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded">
                    {t.duration}
                  </span>
                </div>
                <div className="p-5">
                  <span className="inline-block text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                    {t.topic}
                  </span>
                  <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {t.title}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

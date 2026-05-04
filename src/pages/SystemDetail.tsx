import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Phone, Mail, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchSistemaBySlug, fetchContato } from "@/lib/api";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SupportChat } from "@/components/sections/SupportChat";
import { getSystemBySlug } from "@/data/systems";
import * as LucideIcons from "lucide-react";
import NotFound from "./NotFound";

const getIcon = (name: string) => {
  const icons = LucideIcons as Record<string, unknown>;
  return (icons[name] as React.ComponentType<{ size?: number }>) || LucideIcons.Monitor;
};

const SystemDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: dbSystem, isLoading } = useQuery({
    queryKey: ["sistema", slug],
    queryFn: () => fetchSistemaBySlug(slug!),
    enabled: !!slug,
    retry: false,
  });
  const { data: contato } = useQuery({ queryKey: ["contato"], queryFn: fetchContato });

  const fallback = slug ? getSystemBySlug(slug) : undefined;
  const system = dbSystem || (fallback ? { ...fallback, icone: "" } : null);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  if (!system) return <NotFound />;

  const Icon = dbSystem ? getIcon(dbSystem.icone) : (fallback?.icon || LucideIcons.Monitor);
  const features = system.features || [];
  const modules = system.modulos || system.modules || [];
  const benefits = system.beneficios || system.benefits || [];
  const tel = contato?.telefone || "(17) 3411-1444";
  const email = contato?.email || "martinez@martinez.inf.br";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary via-primary-deep to-primary text-primary-foreground overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.15),_transparent_50%)]" />
          <div className="container mx-auto px-4 relative">
            <Link to="/#softwares" className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground mb-8 transition-colors">
              <ArrowLeft size={16} /> Voltar para sistemas
            </Link>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 backdrop-blur mb-6">
                <Icon size={32} />
              </div>
              <span className="inline-block text-sm font-semibold uppercase tracking-wider opacity-80 mb-3">Sistema Fiorilli</span>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
                {system.nome || system.name}
                <span className="block text-2xl md:text-3xl font-medium opacity-90 mt-2">{system.titulo || system.title}</span>
              </h1>
              <p className="text-lg md:text-xl opacity-90 leading-relaxed">{system.tagline}</p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
              Principais <span className="text-gradient-primary">diferenciais</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((f: { title: string; description: string }, i: number) => (
                <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="bg-card border border-border rounded-2xl p-6 shadow-[var(--shadow-card)]">
                  <h3 className="text-xl font-bold text-foreground mb-3">{f.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{f.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-secondary/40">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Módulos inclusos</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {modules.map((m: string) => (
                  <li key={m} className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3">
                    <Check size={18} className="text-primary flex-shrink-0" />
                    <span className="text-foreground font-medium">{m}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Benefícios</h2>
              <ul className="space-y-4">
                {benefits.map((b: string) => (
                  <li key={b} className="flex gap-3">
                    <div className="mt-1 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check size={14} className="text-primary" />
                    </div>
                    <span className="text-muted-foreground leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-br from-primary to-primary-deep rounded-3xl p-10 md:p-14 text-primary-foreground text-center shadow-[var(--shadow-glow)]">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Quer implantar o {system.nome || system.name} na sua prefeitura?
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                A Martinez & Carvalho é parceira homologada Fiorilli. Fale com nossa equipe para implantação, treinamento e suporte especializado.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={`tel:${tel.replace(/\D/g, "")}`} className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition-colors">
                  <Phone size={18} /> {tel}
                </a>
                <a href={`mailto:${email}`} className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur border border-white/30 font-semibold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors">
                  <Mail size={18} /> {email}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <SupportChat />
    </div>
  );
};

export default SystemDetail;
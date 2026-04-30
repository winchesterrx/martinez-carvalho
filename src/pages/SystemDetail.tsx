import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Phone, Mail } from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SupportChat } from "@/components/sections/SupportChat";
import { getSystemBySlug } from "@/data/systems";
import NotFound from "./NotFound";

const SystemDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const system = slug ? getSystemBySlug(slug) : undefined;

  if (!system) return <NotFound />;

  const Icon = system.icon;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary via-primary-deep to-primary text-primary-foreground overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.15),_transparent_50%)]" />
          <div className="container mx-auto px-4 relative">
            <Link
              to="/#softwares"
              className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground mb-8 transition-colors"
            >
              <ArrowLeft size={16} /> Voltar para sistemas
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 backdrop-blur mb-6">
                <Icon size={32} />
              </div>
              <span className="inline-block text-sm font-semibold uppercase tracking-wider opacity-80 mb-3">
                Sistema Fiorilli
              </span>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
                {system.name}
                <span className="block text-2xl md:text-3xl font-medium opacity-90 mt-2">
                  {system.title}
                </span>
              </h1>
              <p className="text-lg md:text-xl opacity-90 leading-relaxed">
                {system.tagline}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
              Principais <span className="text-gradient-primary">diferenciais</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {system.features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-6 shadow-[var(--shadow-card)]"
                >
                  <h3 className="text-xl font-bold text-foreground mb-3">{f.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{f.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Modules + Benefits */}
        <section className="py-20 bg-secondary/40">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Módulos inclusos</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {system.modules.map((m) => (
                  <li
                    key={m}
                    className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3"
                  >
                    <Check size={18} className="text-primary flex-shrink-0" />
                    <span className="text-foreground font-medium">{m}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Benefícios</h2>
              <ul className="space-y-4">
                {system.benefits.map((b) => (
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

        {/* CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-br from-primary to-primary-deep rounded-3xl p-10 md:p-14 text-primary-foreground text-center shadow-[var(--shadow-glow)]">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Quer implantar o {system.name} na sua prefeitura?
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                A Martinez & Carvalho é parceira homologada Fiorilli. Fale com nossa
                equipe para implantação, treinamento e suporte especializado.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+551734111444"
                  className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition-colors"
                >
                  <Phone size={18} /> (17) 3411-1444
                </a>
                <a
                  href="mailto:martinez@martinez.inf.br"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur border border-white/30 font-semibold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Mail size={18} /> martinez@martinez.inf.br
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
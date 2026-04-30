import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";

export const Partnership = () => {
  return (
    <section id="parceria" className="py-16 bg-secondary/40 border-y border-border">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between gap-8 bg-card border border-border rounded-2xl px-8 py-10 shadow-[var(--shadow-card)]"
        >
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              Nossa Parceria
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-3">
              Canal de Suporte e{" "}
              <span className="text-gradient-primary">Implantação Homologado</span>
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Atuamos como canal oficial homologado da Fiorilli Software, garantindo
              implantação técnica e suporte certificado para a gestão pública.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
              <BadgeCheck size={18} />
              Parceiro Oficial Fiorilli Software
            </div>
          </div>

          {/* Logo placeholder */}
          <div className="shrink-0 w-64 h-32 rounded-xl border-2 border-dashed border-border bg-background flex items-center justify-center">
            <span className="text-muted-foreground text-sm font-medium tracking-wide">
              [ Logo Fiorilli ]
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
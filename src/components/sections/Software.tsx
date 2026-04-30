import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { systems } from "@/data/systems";

export const Software = () => {
  return (
    <section id="softwares" className="py-24 bg-secondary/40">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Sistemas Fiorilli
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            Soluções completas para sua{" "}
            <span className="text-gradient-primary">prefeitura</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Implantamos, treinamos e damos suporte aos principais sistemas Fiorilli usados
            na administração pública.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systems.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                to={`/sistemas/${s.slug}`}
                className="group relative block h-full bg-card border border-border rounded-2xl p-8 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/15 transition-colors" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary-deep text-primary-foreground shadow-[var(--shadow-glow)] mb-5">
                    <s.icon size={26} />
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <h3 className="text-2xl font-bold text-foreground">{s.name}</h3>
                    <span className="text-sm text-muted-foreground">{s.title}</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{s.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Saiba mais <ArrowUpRight size={16} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

import { motion } from "framer-motion";
import { Award, Users, Building2 } from "lucide-react";
import office from "@/assets/about-office.jpg";
import team from "@/assets/about-team.jpg";
import work from "@/assets/about-work.jpg";
import support from "@/assets/about-support.jpg";

const stats = [
  { icon: Award, value: "+12", label: "Anos de mercado" },
  { icon: Users, value: "+50", label: "Órgãos atendidos" },
  { icon: Building2, value: "100%", label: "Foco em gestão pública" },
];

export const About = () => {
  return (
    <section id="quem-somos" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
              Quem Somos
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
              Tecnologia a serviço da{" "}
              <span className="text-gradient-primary">gestão pública</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Fundada em <strong className="text-foreground">2012</strong> em Votuporanga/SP,
              a Martinez & Carvalho Software nasceu com o propósito de modernizar a gestão
              pública municipal através da implantação e suporte especializado dos sistemas
              Fiorilli Software.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Combinamos profundo conhecimento técnico, atendimento próximo e compromisso
              com prazos para entregar soluções que realmente transformam a rotina das
              prefeituras e órgãos públicos da nossa região.
            </p>

            <div className="grid grid-cols-3 gap-6">
              {stats.map((s) => (
                <div key={s.label} className="text-center md:text-left">
                  <s.icon className="text-primary mb-2 mx-auto md:mx-0" size={28} />
                  <div className="text-3xl font-bold text-foreground">{s.value}</div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              <img
                src={office}
                alt="Sede em Votuporanga"
                loading="lazy"
                className="rounded-2xl shadow-[var(--shadow-card)] aspect-[4/5] object-cover w-full hover:scale-[1.02] transition-transform duration-500"
              />
              <img
                src={work}
                alt="Equipe trabalhando"
                loading="lazy"
                className="rounded-2xl shadow-[var(--shadow-card)] aspect-square object-cover w-full hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
            <div className="space-y-4 pt-8">
              <img
                src={team}
                alt="Equipe Martinez & Carvalho"
                loading="lazy"
                className="rounded-2xl shadow-[var(--shadow-card)] aspect-square object-cover w-full hover:scale-[1.02] transition-transform duration-500"
              />
              <img
                src={support}
                alt="Atendimento e suporte"
                loading="lazy"
                className="rounded-2xl shadow-[var(--shadow-card)] aspect-[4/5] object-cover w-full hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { fetchHero } from "@/lib/api";
import heroImage from "@/assets/hero-office-modern.jpg";

const FALLBACK = [
  "Especialistas em Gestão Pública Municipal.",
  "Suporte Técnico de Excelência para Sistemas Fiorilli.",
  "Tecnologia e Compromisso em Votuporanga e Região.",
];

export const Hero = () => {
  const { data: dbSlides } = useQuery({ queryKey: ["hero"], queryFn: fetchHero });
  const slides = dbSlides?.length ? dbSlides.map((s: { texto: string }) => s.texto) : FALLBACK;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img src={heroImage} alt="Escritório moderno" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/65 to-slate-950/85" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(220_40%_5%/0.35),hsl(220_40%_5%/0.7))]" />

      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur px-4 py-1.5 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Implantação e Suporte Fiorilli Software
        </motion.div>

        <div className="min-h-[180px] md:min-h-[220px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.h1 key={index} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.7, ease: "easeOut" }} className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-5xl mx-auto">
              {slides[index].split(" ").slice(0, -2).join(" ")}{" "}
              <span className="text-gradient-primary">{slides[index].split(" ").slice(-2).join(" ")}</span>
            </motion.h1>
          </AnimatePresence>
        </div>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
          Mais de uma década modernizando a gestão pública com tecnologia, segurança e atendimento próximo.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#softwares" className="btn-gradient inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg text-base">Conheça os Sistemas <ArrowRight size={18} /></a>
          <a href="#suporte" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg text-base font-semibold border border-white/30 text-white hover:bg-white/10 transition-colors backdrop-blur">Acessar Suporte</a>
        </motion.div>

        <div className="mt-16 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} className={`h-1.5 rounded-full transition-all ${i === index ? "w-10 bg-primary" : "w-4 bg-white/30"}`} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
      </div>

      <a href="#quem-somos" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-float" aria-label="Rolar para baixo">
        <ChevronDown size={32} />
      </a>
    </section>
  );
};

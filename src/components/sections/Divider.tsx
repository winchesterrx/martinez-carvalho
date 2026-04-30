import { motion } from "framer-motion";
import { Headset, GraduationCap } from "lucide-react";
import dividerImage from "@/assets/divider-team.jpg";

export const Divider = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <img
        src={dividerImage}
        alt="Equipe de suporte técnico"
        loading="lazy"
        width={1920}
        height={800}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Vibrant orange gradient mask ~70% opacity */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(28 95% 53% / 0.85), hsl(22 90% 45% / 0.85))",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative z-10 container mx-auto px-4 text-center text-white"
      >
        <div className="flex justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center">
            <Headset size={22} />
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center">
            <GraduationCap size={22} />
          </div>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold leading-tight max-w-4xl mx-auto">
          Suporte Técnico Especializado e{" "}
          <span className="underline decoration-white/40 underline-offset-8">
            Treinamentos Exclusivos
          </span>
        </h2>
        <p className="mt-5 text-white/90 text-lg max-w-2xl mx-auto">
          Capacitamos sua equipe e garantimos o pleno funcionamento dos sistemas
          Fiorilli em sua administração pública.
        </p>
      </motion.div>
    </section>
  );
};
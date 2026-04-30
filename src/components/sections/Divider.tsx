import { motion } from "framer-motion";
import dividerImage from "@/assets/divider-support.jpg";

export const Divider = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <img
        src={dividerImage}
        alt="Equipe de suporte técnico Fiorilli"
        loading="lazy"
        width={1920}
        height={800}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Vibrant orange mask — 75% opacity, brand color */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(28 95% 53% / 0.78), hsl(22 90% 45% / 0.78))",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative z-10 container mx-auto px-4 text-center text-white"
      >
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl mx-auto tracking-tight">
          Excelência em Atendimento e{" "}
          <span className="block md:inline">Suporte Técnico Fiorilli.</span>
        </h2>
        <p className="mt-6 text-white/90 text-lg max-w-2xl mx-auto">
          Equipe certificada, atendimento humano e treinamentos contínuos para sua
          administração pública.
        </p>
      </motion.div>
    </section>
  );
};
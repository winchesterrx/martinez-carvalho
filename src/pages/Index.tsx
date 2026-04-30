import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Software } from "@/components/sections/Software";
import { Support } from "@/components/sections/Support";
import { Footer } from "@/components/sections/Footer";
import { WhatsAppButton } from "@/components/sections/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Software />
        <Support />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;

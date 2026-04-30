import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Software } from "@/components/sections/Software";
import { Partnership } from "@/components/sections/Partnership";
import { Divider } from "@/components/sections/Divider";
import { Support } from "@/components/sections/Support";
import { Footer } from "@/components/sections/Footer";
import { WhatsAppButton } from "@/components/sections/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Partnership />
        <About />
        <Software />
        <Divider />
        <Support />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;

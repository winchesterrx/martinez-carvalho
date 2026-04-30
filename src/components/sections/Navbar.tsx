import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo-martinez.png";

const links = [
  { label: "Início", href: "#inicio" },
  { label: "Quem Somos", href: "#quem-somos" },
  { label: "Softwares", href: "#softwares" },
  { label: "Suporte", href: "#suporte" },
  { label: "Contato", href: "#contato" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-nav shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between py-3 px-4 md:px-6">
        <a href="#inicio" className="flex items-center gap-2">
          <img src={logo} alt="Martinez & Carvalho" className="h-10 md:h-12 w-auto" />
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  scrolled ? "text-foreground" : "text-white"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contato"
          className="hidden md:inline-flex btn-gradient px-5 py-2.5 rounded-lg text-sm"
        >
          Fale Conosco
        </a>

        <button
          onClick={() => setOpen(!open)}
          className={`md:hidden p-2 rounded-md ${scrolled ? "text-foreground" : "text-white"}`}
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden glass-nav border-t border-border/50">
          <ul className="container mx-auto flex flex-col py-4 px-4 gap-3">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-foreground font-medium hover:text-primary"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

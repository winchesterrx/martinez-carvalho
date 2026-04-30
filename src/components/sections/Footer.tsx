import { Mail, MapPin, Phone, Facebook, Instagram, Linkedin } from "lucide-react";
import logo from "@/assets/logo-martinez.png";

export const Footer = () => {
  return (
    <footer id="contato" className="bg-brand-dark text-white pt-20 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 rounded-xl p-3 inline-block mb-4">
              <img src={logo} alt="Martinez & Carvalho" className="h-12 w-auto" />
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Especialistas em implantação e suporte de Sistemas Fiorilli para a gestão
              pública municipal.
            </p>
            <div className="flex gap-3 mt-5">
              {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-primary border border-white/10 flex items-center justify-center transition-colors"
                  aria-label="Rede social"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contato</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <span>
                  Rua Carmem Rodrigues Basi, 1500<br />
                  Parque Cidade Jardim<br />
                  Votuporanga/SP — CEP 15503-538
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary shrink-0" />
                <a href="mailto:martinez@martinez.inf.br" className="hover:text-primary">
                  martinez@martinez.inf.br
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary shrink-0" />
                <span>(17) 0000-0000</span>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#inicio" className="hover:text-primary transition-colors">Início</a></li>
              <li><a href="#quem-somos" className="hover:text-primary transition-colors">Quem Somos</a></li>
              <li><a href="#softwares" className="hover:text-primary transition-colors">Softwares</a></li>
              <li><a href="#suporte" className="hover:text-primary transition-colors">Suporte</a></li>
            </ul>
          </div>

          {/* Map */}
          <div>
            <h4 className="text-lg font-bold mb-4">Localização</h4>
            <div className="rounded-xl overflow-hidden border border-white/10 aspect-video">
              <iframe
                title="Localização Martinez & Carvalho"
                src="https://www.google.com/maps?q=Rua+Carmem+Rodrigues+Basi+1500+Votuporanga&output=embed"
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale contrast-110"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row gap-3 justify-between items-center text-xs text-white/50">
          <p>
            © {new Date().getFullYear()} Martinez & Carvalho Software LTDA — CNPJ
            14.908.157/0001-24
          </p>
          <p>Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

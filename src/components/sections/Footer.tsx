import { Mail, MapPin, Phone, Facebook, Instagram, Linkedin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchContato } from "@/lib/api";
import logo from "@/assets/logo-martinez.png";

export const Footer = () => {
  const { data: c } = useQuery({ queryKey: ["contato"], queryFn: fetchContato });

  const tel = c?.telefone || "(17) 3411-1444";
  const email = c?.email || "martinez@martinez.inf.br";
  const rua = c?.endereco_rua || "Rua Carmem Rodrigues Basi, 1500";
  const bairro = c?.endereco_bairro || "Parque Cidade Jardim";
  const cidade = c?.endereco_cidade || "Votuporanga/SP";
  const cep = c?.endereco_cep || "15503-538";
  const cnpj = c?.cnpj || "14.908.157/0001-24";
  const mapaUrl = c?.mapa_url || "https://www.google.com/maps?q=Rua+Carmem+Rodrigues+Basi+1500+Votuporanga&output=embed";

  const socials = [
    { icon: Facebook, url: c?.facebook_url },
    { icon: Instagram, url: c?.instagram_url },
    { icon: Linkedin, url: c?.linkedin_url },
  ];

  return (
    <footer id="contato" className="bg-brand-dark text-white pt-20 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="lg:col-span-1">
            <div className="bg-white/95 rounded-xl px-5 py-5 inline-block mb-4">
              <img src={logo} alt="Martinez & Carvalho" className="h-12 w-auto" />
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Especialistas em implantação e suporte de Sistemas Fiorilli para a gestão pública municipal.
            </p>
            <div className="mt-5 inline-block px-3 py-2 rounded-lg border border-white/10 bg-white/5">
              <span className="block text-[10px] uppercase tracking-wider text-white/50 mb-0.5">CNPJ</span>
              <span className="text-sm font-medium text-white/90">{cnpj}</span>
            </div>
            <div className="flex gap-3 mt-5">
              {socials.map(({ icon: Icon, url }, i) => (
                <a key={i} href={url || "#"} target={url ? "_blank" : undefined} rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-primary border border-white/10 flex items-center justify-center transition-colors" aria-label="Rede social">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Contato</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <span>{rua}<br />{bairro}<br />{cidade} — CEP {cep}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-primary">{email}</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary shrink-0" />
                <a href={`tel:${tel.replace(/\D/g, "")}`} className="hover:text-primary">{tel}</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#inicio" className="hover:text-primary transition-colors">Início</a></li>
              <li><a href="#quem-somos" className="hover:text-primary transition-colors">Quem Somos</a></li>
              <li><a href="#softwares" className="hover:text-primary transition-colors">Softwares</a></li>
              <li><a href="#suporte" className="hover:text-primary transition-colors">Suporte</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Localização</h4>
            <div className="rounded-xl overflow-hidden border border-white/10 aspect-video">
              <iframe title="Localização Martinez & Carvalho" src={mapaUrl} width="100%" height="100%" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="grayscale contrast-110" />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row gap-3 justify-between items-center text-xs text-white/50">
          <p>© {new Date().getFullYear()} Martinez & Carvalho Software LTDA — CNPJ {cnpj}</p>
          <p>Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

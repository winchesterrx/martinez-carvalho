import { MessageCircle } from "lucide-react";

export const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/5517000000000?text=Ol%C3%A1%2C+preciso+de+suporte+Fiorilli."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Suporte via WhatsApp"
    >
      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30" />
      <span className="relative flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white rounded-full pl-4 pr-5 py-3 shadow-2xl transition-all duration-300 hover:scale-105">
        <MessageCircle size={24} fill="currentColor" />
        <span className="hidden md:inline font-semibold text-sm whitespace-nowrap">
          Suporte WhatsApp
        </span>
      </span>
    </a>
  );
};

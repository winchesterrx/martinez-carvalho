import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Monitor, Video, Wrench, FileText, Phone,
  Image, Handshake, Settings, LogOut, ChevronLeft, Menu, BrainCircuit
} from "lucide-react";
import { verifyAuth } from "@/lib/api";
import logo from "@/assets/logo-martinez.png";

import SistemasManager from "@/components/admin/SistemasManager";
import VideosManager from "@/components/admin/VideosManager";
import FerramentasManager from "@/components/admin/FerramentasManager";
import SobreManager from "@/components/admin/SobreManager";
import ContatoManager from "@/components/admin/ContatoManager";
import HeroManager from "@/components/admin/HeroManager";
import ConfiguracoesManager from "@/components/admin/ConfiguracoesManager";
import ConhecimentoManager from "@/components/admin/ConhecimentoManager";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "sistemas", label: "Sistemas", icon: Monitor },
  { id: "videos", label: "Vídeos", icon: Video },
  { id: "ferramentas", label: "Ferramentas", icon: Wrench },
  { id: "sobre", label: "Quem Somos", icon: FileText },
  { id: "contato", label: "Contato", icon: Phone },
  { id: "hero", label: "Hero / Banner", icon: Image },
  { id: "conhecimento", label: "Base IA", icon: BrainCircuit },
  { id: "configuracoes", label: "Configurações", icon: Settings },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    verifyAuth().then((valid) => {
      if (!valid) navigate("/admin/login");
      else setLoading(false);
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("martinez_token");
    localStorage.removeItem("martinez_user");
    navigate("/admin/login");
  };

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("martinez_user") || "{}"); } catch { return {}; }
  })();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "sistemas": return <SistemasManager />;
      case "videos": return <VideosManager />;
      case "ferramentas": return <FerramentasManager />;
      case "sobre": return <SobreManager />;
      case "contato": return <ContatoManager />;
      case "hero": return <HeroManager />;
      case "conhecimento": return <ConhecimentoManager />;
      case "configuracoes": return <ConfiguracoesManager />;
      default:
        return (
          <div className="p-6 md:p-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Bem-vindo, {user.nome || "Admin"} 👋
            </h1>
            <p className="text-muted-foreground mb-8">
              Gerencie todo o conteúdo do site Martinez & Carvalho.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tabs.filter(t => t.id !== "dashboard").map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="group flex items-center gap-4 bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300 text-left"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-deep flex items-center justify-center text-white shrink-0">
                      <Icon size={22} />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">{tab.label}</span>
                      <span className="block text-xs text-muted-foreground">Gerenciar</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-muted flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-50 bg-card border-r border-border flex flex-col transition-all duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${sidebarOpen ? "w-64" : "w-20"}`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {sidebarOpen ? (
            <div className="bg-white rounded-lg px-3 py-2">
              <img src={logo} alt="Martinez" className="h-8 w-auto" />
            </div>
          ) : (
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <Monitor size={20} className="text-primary" />
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex w-8 h-8 rounded-lg hover:bg-muted items-center justify-center text-muted-foreground"
          >
            <ChevronLeft size={16} className={`transition-transform ${!sidebarOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                title={!sidebarOpen ? tab.label : undefined}
              >
                <Icon size={20} className="shrink-0" />
                {sidebarOpen && <span>{tab.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors`}
          >
            <LogOut size={20} className="shrink-0" />
            {sidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        {/* Top bar mobile */}
        <div className="md:hidden flex items-center gap-3 p-4 border-b border-border bg-card sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center"
          >
            <Menu size={20} />
          </button>
          <span className="font-semibold text-foreground">
            {tabs.find((t) => t.id === activeTab)?.label || "Admin"}
          </span>
        </div>

        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;

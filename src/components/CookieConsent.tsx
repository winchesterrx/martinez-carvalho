import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Shield } from "lucide-react";

type CookiePrefs = {
  necessarios: boolean;
  analiticos: boolean;
  marketing: boolean;
};

const STORAGE_KEY = "martinez_cookie_consent";

function getStoredConsent(): CookiePrefs | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveConsent(prefs: CookiePrefs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

export const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState<CookiePrefs>({
    necessarios: true,
    analiticos: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = (all: boolean) => {
    const finalPrefs = all
      ? { necessarios: true, analiticos: true, marketing: true }
      : prefs;
    saveConsent(finalPrefs);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 inset-x-0 z-[60] p-4 md:p-6"
      >
        <div className="container mx-auto max-w-4xl">
          <div className="relative bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden">
            {/* Orange accent line on top */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-primary-glow to-primary-deep" />

            <div className="p-5 md:p-6">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-deep flex items-center justify-center text-white shrink-0 mt-0.5">
                  <Cookie size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-foreground mb-1">
                    Privacidade & Cookies
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Utilizamos cookies para melhorar sua experiência de navegação,
                    personalizar conteúdo e analisar nosso tráfego.{" "}
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="text-primary font-medium hover:underline"
                    >
                      {showDetails ? "Ocultar detalhes" : "Saiba mais"}
                    </button>
                  </p>
                </div>
                <button
                  onClick={() => accept(false)}
                  className="shrink-0 w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Fechar"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Details */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-border space-y-3">
                      {/* Necessários */}
                      <label className="flex items-center gap-3 cursor-not-allowed">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked
                            disabled
                            className="sr-only"
                          />
                          <div className="w-5 h-5 rounded-md bg-primary flex items-center justify-center">
                            <Shield size={12} className="text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-foreground">
                            Necessários
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            (sempre ativos)
                          </span>
                        </div>
                      </label>

                      {/* Analíticos */}
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={prefs.analiticos}
                          onChange={(e) =>
                            setPrefs({ ...prefs, analiticos: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-5 h-5 rounded-md border-2 border-border bg-muted peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center transition-colors">
                          {prefs.analiticos && (
                            <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-foreground">
                            Analíticos
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            — nos ajudam a entender o uso do site
                          </span>
                        </div>
                      </label>

                      {/* Marketing */}
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={prefs.marketing}
                          onChange={(e) =>
                            setPrefs({ ...prefs, marketing: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-5 h-5 rounded-md border-2 border-border bg-muted peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center transition-colors">
                          {prefs.marketing && (
                            <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-foreground">
                            Marketing
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            — personalização e publicidade
                          </span>
                        </div>
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:justify-end">
                <button
                  onClick={() => accept(false)}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors"
                >
                  Apenas Necessários
                </button>
                <button
                  onClick={() => accept(true)}
                  className="btn-gradient px-5 py-2.5 rounded-lg text-sm"
                >
                  Aceitar Todos
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

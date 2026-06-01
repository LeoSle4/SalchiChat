import { useState, useEffect } from "react";
import api from "../services/api";
import ThemeToggle from "../components/ThemeToggle";
import Sidebar from "../components/Sidebar";

// Consola del sistema para verificar la conexión de la Base de Datos, Gemini y el Telegram Bot
const DebugPage = () => {
  const [status, setStatus] = useState({
    gemini_online: false,
    database_online: false,
  });
  const [apiOnline, setApiOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hook que consulta el estado general de los servicios cada 30 segundos
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get("/chat/status");
        setStatus(res.data);
        setApiOnline(true);
      } catch (error) {
        console.error(error);
        setApiOnline(false);
      } finally {
        setLastUpdate(new Date());
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-stone-950 flex items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-neutral-200 border-t-primary rounded-full animate-spin"></div>
          <span className="font-serif text-sm tracking-widest text-neutral-400 dark:text-stone-500 uppercase animate-pulse">Preparación...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-stone-950 text-neutral-800 dark:text-stone-200 overflow-hidden font-sans transition-colors duration-300">
      <div className="hidden md:block h-full shrink-0">
        <Sidebar userRole="ADMIN" />
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-stone-950/40 dark:bg-stone-950/70 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-[280px] h-full bg-white dark:bg-stone-900 z-50 animate-in slide-in-from-left duration-200">
            <Sidebar userRole="ADMIN" />
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col h-full bg-neutral-50 dark:bg-stone-950 relative overflow-hidden">
        <div className="navbar bg-white dark:bg-stone-900 border-b border-neutral-200 dark:border-stone-800 px-6 justify-between shrink-0 h-16 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="btn btn-ghost btn-circle md:hidden text-neutral-800 dark:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
              </svg>
            </button>
            <div className="flex flex-col">
              <h2 className="font-serif text-lg font-medium text-neutral-900 dark:text-white tracking-wide">
                Consola de Control
              </h2>
              <span className="text-[9px] text-neutral-400 dark:text-stone-550 tracking-wider uppercase font-mono">
                Diagnóstico del Sistema
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-8 md:p-12 overflow-y-auto">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 border-b border-neutral-200 dark:border-stone-800 pb-8">
            <div>
              <h1 className="font-serif text-3xl font-light text-neutral-900 dark:text-white tracking-wide uppercase">
                Consola del Sistema
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-stone-550 font-mono mt-1">
                Diagnóstico de bajo nivel del servidor en tiempo real
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 py-1.5 px-3 border border-neutral-200 dark:border-stone-800 bg-white dark:bg-stone-900">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-450 dark:text-stone-400">
                  Auto-Refresh: 30s
                </span>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-stone-900 border border-neutral-200 dark:border-stone-800 p-8 shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
              <h2 className="font-serif text-lg font-medium text-neutral-900 dark:text-white uppercase tracking-wide mb-6 border-b border-neutral-100 dark:border-stone-800 pb-3">
                Conectividad del Servidor
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-neutral-100 dark:border-stone-800 pb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-stone-500">
                    Frontend Runtime
                  </span>
                  <span className="text-[10px] font-mono py-0.5 px-2 bg-neutral-50 dark:bg-stone-800 border border-neutral-200 dark:border-stone-700 text-neutral-600 dark:text-stone-300">
                    ESTABLE
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-neutral-100 dark:border-stone-800 pb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-stone-500">
                    Backend API Gateway
                  </span>
                  <span className={`text-[10px] font-mono py-0.5 px-2 border ${
                    apiOnline
                      ? "bg-neutral-50 dark:bg-stone-800 text-neutral-800 dark:text-stone-300 border-neutral-200 dark:border-stone-700"
                      : "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50"
                  }`}>
                    {apiOnline ? "ALCANZABLE" : "INACCESIBLE"}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-neutral-100 dark:border-stone-800 pb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-stone-500">
                    Instancia Base de Datos
                  </span>
                  <span className={`text-[10px] font-mono py-0.5 px-2 border ${
                    status.database_online
                      ? "bg-neutral-50 dark:bg-stone-800 text-neutral-800 dark:text-stone-300 border-neutral-200 dark:border-stone-700"
                      : "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50"
                  }`}>
                    {status.database_online ? "CONECTADO" : "SIN CONEXIÓN"}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-neutral-100 dark:border-stone-800 pb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-stone-500">
                    Motor de IA (Gemini)
                  </span>
                  <span className={`text-[10px] font-mono py-0.5 px-2 border ${
                    status.gemini_online
                      ? "bg-neutral-50 dark:bg-stone-800 text-neutral-800 dark:text-stone-300 border-neutral-200 dark:border-stone-700"
                      : "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50"
                  }`}>
                    {status.gemini_online ? "DISPONIBLE" : "FALLO"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-stone-500">
                    Servicio Telegram Bot
                  </span>
                  <span className="text-[10px] font-mono py-0.5 px-2 bg-neutral-50 dark:bg-stone-800 border border-neutral-200 dark:border-stone-700 text-neutral-600 dark:text-stone-300">
                    POLLING
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-stone-900 border border-neutral-200 dark:border-stone-800 p-8 shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-secondary"></div>
              <h2 className="font-serif text-lg font-medium text-neutral-900 dark:text-white uppercase tracking-wide mb-6 border-b border-neutral-100 dark:border-stone-800 pb-3">
                Parámetros del Sistema
              </h2>
              <div className="font-mono text-xs space-y-3 overflow-x-auto text-neutral-600 dark:text-stone-400">
                <p className="flex justify-between">
                  <span className="text-neutral-400 dark:text-stone-500">API_GATEWAY:</span>
                  <span className="text-neutral-800 dark:text-stone-200">http://localhost:8080/api</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-neutral-400 dark:text-stone-500">AUTH_STRATEGY:</span>
                  <span className="text-neutral-800 dark:text-stone-200">JWT_BEARER</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-neutral-400 dark:text-stone-500">CLIENT_THEME:</span>
                  <span className="text-neutral-800 dark:text-stone-200">{localStorage.getItem("theme")}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center text-[10px] font-mono text-neutral-300 dark:text-stone-700 uppercase tracking-widest">
            Sync: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DebugPage;

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";
import ThemeToggle from "../components/ThemeToggle";
import Sidebar from "../components/Sidebar";

// Vista de administración para supervisar las comandas y consultas de los usuarios en tiempo real
const AdminDashboard = () => {
  const [auditData, setAuditData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hook para consultar el historial general de comandas cada 10 segundos (polling)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/chat/history/null");
        setAuditData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
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

  const filteredData = auditData.filter((item) => {
    if (timeRange === "all") return true;

    const itemDate = new Date(item.createdAt);
    const now = new Date();

    if (timeRange === "today") {
      return itemDate.toDateString() === now.toDateString();
    }

    if (timeRange === "week") {
      const diff = now - itemDate;
      return diff <= 7 * 24 * 60 * 60 * 1000;
    }

    return true;
  });

  const totalUsers = new Set(filteredData.map((m) => m.user?.id || m.sessionId))
    .size;

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
                Control de Cocina
              </h2>
              <span className="text-[9px] text-neutral-400 dark:text-stone-500 tracking-wider uppercase font-mono">
                Supervisión de Actividad
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-8 md:p-12 overflow-y-auto">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 border-b border-neutral-200 dark:border-stone-800 pb-8">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-light text-neutral-900 dark:text-white tracking-wide uppercase">
                Panel Administrativo
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-stone-550 font-mono mt-1">
                Actividad de comandas y estado del sistema en tiempo real
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <Link
                to="/admin/create-user"
                className="py-2 px-5 border border-neutral-300 dark:border-stone-700 hover:border-primary dark:hover:border-primary text-xs font-semibold uppercase tracking-wider transition-colors bg-white dark:bg-stone-900"
              >
                Crear Usuario
              </Link>
            </div>
          </div>

          <div className="max-w-6xl mx-auto flex justify-end mb-8">
            <div className="inline-flex border border-neutral-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
              <button
                onClick={() => setTimeRange("today")}
                className={`py-1.5 px-4 text-xs font-medium tracking-wide transition-colors ${
                  timeRange === "today" ? "bg-primary text-white" : "text-neutral-500 hover:text-primary dark:text-stone-400 dark:hover:text-white"
                }`}
              >
                Hoy
              </button>
              <button
                onClick={() => setTimeRange("week")}
                className={`py-1.5 px-4 text-xs font-medium tracking-wide transition-colors border-x border-neutral-200 dark:border-stone-800 ${
                  timeRange === "week" ? "bg-primary text-white" : "text-neutral-500 hover:text-primary dark:text-stone-400 dark:hover:text-white"
                }`}
              >
                Últimos 7 días
              </button>
              <button
                onClick={() => setTimeRange("all")}
                className={`py-1.5 px-4 text-xs font-medium tracking-wide transition-colors ${
                  timeRange === "all" ? "bg-primary text-white" : "text-neutral-500 hover:text-primary dark:text-stone-400 dark:hover:text-white"
                }`}
              >
                Todo
              </button>
            </div>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white dark:bg-stone-900 border border-neutral-200 dark:border-stone-800 p-6 shadow-md relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
              <div className="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-stone-500 font-semibold mb-2">Total Consultas</div>
              <div className="font-serif text-3xl font-light text-neutral-900 dark:text-white">{filteredData.length}</div>
            </div>
            <div className="bg-white dark:bg-stone-900 border border-neutral-200 dark:border-stone-800 p-6 shadow-md relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-secondary"></div>
              <div className="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-stone-500 font-semibold mb-2">Usuarios Activos</div>
              <div className="font-serif text-3xl font-light text-neutral-900 dark:text-white">{totalUsers}</div>
            </div>
            <div className="bg-white dark:bg-stone-900 border border-neutral-200 dark:border-stone-800 p-6 shadow-md relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
              <div className="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-stone-500 font-semibold mb-2">Último Registro</div>
              <div className="font-serif text-3xl font-light text-neutral-900 dark:text-white truncate">
                {filteredData.length > 0
                  ? new Date(filteredData[0].createdAt).toLocaleTimeString()
                  : "Sin actividad"}
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto bg-white dark:bg-stone-900 border border-neutral-200 dark:border-stone-800 p-8 shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-secondary"></div>
            <h3 className="font-serif text-xl font-medium text-neutral-900 dark:text-white mb-8 pb-4 border-b border-neutral-100 dark:border-stone-800 uppercase tracking-wide">
              Registro de Auditoría de Comandas
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm font-sans border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-stone-800 text-[10px] uppercase tracking-wider text-neutral-400 dark:text-stone-500 font-semibold">
                    <th className="pb-3">Código</th>
                    <th className="pb-3">Usuario / Sesión</th>
                    <th className="pb-3">Consulta</th>
                    <th className="pb-3">Plataforma</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((msg, idx) => (
                    <tr key={msg.id || idx} className="border-b border-neutral-100 dark:border-stone-800/40 hover:bg-neutral-50/50 dark:hover:bg-stone-800/30 transition-colors">
                      <td className="py-4 font-mono text-xs text-neutral-400">#{msg.id}</td>
                      <td className="py-4 font-medium text-neutral-800 dark:text-stone-200">
                        {msg.user?.username || `Anon-${msg.sessionId.slice(-4)}`}
                      </td>
                      <td className="py-4 text-neutral-600 dark:text-stone-400 max-w-xs truncate">{msg.prompt}</td>
                      <td className="py-4">
                        <span className="inline-block py-0.5 px-2 bg-neutral-100 dark:bg-stone-800 border border-neutral-200 dark:border-stone-700 text-[10px] font-mono tracking-wider text-neutral-600 dark:text-stone-300 uppercase">
                          {msg.platform}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

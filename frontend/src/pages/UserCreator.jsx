import { useState } from "react";
import api from "../services/api";
import ThemeToggle from "../components/ThemeToggle";
import Sidebar from "../components/Sidebar";

// Componente de administración para que los administradores creen nuevos accesos
const UserCreator = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Envía los campos de usuario a la API de registro para crearlo de forma oficial
  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/auth/register", {
        username: username,
        password: password,
        role: role,
      });
      setSuccess(`Usuario "${username}" creado correctamente como ${role}.`);
      setUsername("");
      setPassword("");
      setRole("USER");
    } catch (err) {
      setError(err.response?.data?.error || "Error al crear el usuario.");
    } finally {
      setLoading(false);
    }
  };

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
                Gestión de Accesos
              </h2>
              <span className="text-[9px] text-neutral-400 dark:text-stone-550 tracking-wider uppercase font-mono">
                Administración de Usuarios
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-8 md:p-12 overflow-y-auto flex flex-col items-center">
          <div className="w-full max-w-4xl flex justify-between items-center mb-12 border-b border-neutral-200 dark:border-stone-800 pb-8">
            <div>
              <h1 className="font-serif text-3xl font-light text-neutral-900 dark:text-white tracking-wide uppercase">
                Gestión de Usuarios
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-stone-550 font-mono mt-1">
                Creación manual de accesos del sistema
              </p>
            </div>
          </div>

          <div className="w-full max-w-md bg-white dark:bg-stone-900 border border-neutral-200 dark:border-stone-800 p-8 shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="text-center mb-8">
                <div className="font-serif text-2xl font-light text-neutral-900 dark:text-white mb-2">Nuevo Acceso</div>
                <p className="text-[10px] text-neutral-400 dark:text-stone-500 uppercase tracking-widest">
                  Registrar credenciales
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-xs border border-red-150 dark:border-red-900/50 mb-6 flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 text-xs border border-green-150 dark:border-green-900/50 mb-6 flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>{success}</span>
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-neutral-400 dark:text-stone-500 mb-2">
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  placeholder="Ej: nuevo_chef"
                  className="w-full p-3 bg-neutral-50 dark:bg-stone-800 border border-neutral-200 dark:border-stone-700 focus:border-primary dark:focus:border-primary focus:outline-none text-sm text-neutral-800 dark:text-stone-100 transition-colors rounded-none"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-neutral-400 dark:text-stone-500 mb-2">
                  Contraseña temporal
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-3 bg-neutral-50 dark:bg-stone-800 border border-neutral-200 dark:border-stone-700 focus:border-primary dark:focus:border-primary focus:outline-none text-sm text-neutral-800 dark:text-stone-100 transition-colors rounded-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-neutral-400 dark:text-stone-500 mb-2">
                  Rol del sistema
                </label>
                <select
                  className="w-full p-3 bg-neutral-50 dark:bg-stone-800 border border-neutral-200 dark:border-stone-700 focus:border-primary dark:focus:border-primary focus:outline-none text-sm text-neutral-800 dark:text-stone-100 transition-colors rounded-none"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="USER">USER — Acceso estándar</option>
                  <option value="ADMIN">ADMIN — Privilegios de Chef</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-white hover:bg-primary/95 text-sm font-semibold tracking-wide transition-all shadow-md"
                disabled={loading}
              >
                {loading ? "Generando..." : "Generar Acceso"}
              </button>
            </form>
          </div>

          <div className="mt-12 text-[10px] font-mono text-neutral-300 dark:text-stone-700 uppercase tracking-widest">
            SalchiChat Identity Service v2.0
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserCreator;

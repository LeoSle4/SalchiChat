import { Link, useNavigate } from "react-router-dom";

// Componente modular de barra lateral, reutilizado en chat y paneles de administrador
const Sidebar = ({
  sessions = [],
  currentSessionId = "",
  selectSession = () => {},
  startNewChat = null,
  userRole = "USER"
}) => {
  const navigate = useNavigate();

  // Función para cerrar la sesión activa, borrando los datos guardados en LocalStorage
  const handleLogout = () => {
    localStorage.removeItem("_sk1");
    localStorage.removeItem("_sk2");
    localStorage.removeItem("_sk3");
    navigate("/");
  };

  // Lógica para iniciar nueva consulta: si ya estamos en chat se ejecuta, si no, te redirige
  const handleStartNewChat = () => {
    if (startNewChat) {
      startNewChat();
    } else {
      navigate("/chat");
    }
  };

  return (
    <div className="w-full bg-white dark:bg-stone-900 flex flex-col justify-between p-6 border-r border-neutral-200 dark:border-stone-800 shadow-sm h-full text-neutral-800 dark:text-stone-200 transition-colors duration-300">
      <div className="flex flex-col gap-6 flex-1 min-h-0">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src="/logo.png" alt="SalchiChat Logo" className="w-8 h-8 rounded-full border border-neutral-200 dark:border-stone-850" />
          <span className="font-serif text-2xl font-semibold tracking-wide text-neutral-900 dark:text-white">
            SalchiChat
          </span>
        </Link>

        <button
          onClick={handleStartNewChat}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-white hover:bg-primary/95 transition-colors text-sm font-medium tracking-wide border-b-2 border-primary/80 shadow-md shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Nueva Consulta
        </button>

        <div className="flex flex-col gap-2 mt-4 flex-1 min-h-0">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 dark:text-stone-500 font-sans border-b border-neutral-100 dark:border-stone-800 pb-2 shrink-0">
            Historial de Comandas
          </div>
          <div className="flex flex-col gap-1 overflow-y-auto flex-1 min-h-0">
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => selectSession(session.id)}
                  className={`text-left p-3 text-sm font-sans truncate transition-colors border border-transparent ${
                    currentSessionId === session.id
                      ? "bg-neutral-50 dark:bg-stone-800 text-neutral-900 dark:text-white border-l-2 border-l-primary font-medium"
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50/50 dark:hover:bg-stone-800/50"
                  }`}
                >
                  {session.generatedTitle || session.title}
                </button>
              ))
            ) : (
              <span className="text-xs text-neutral-400 dark:text-stone-500 italic text-center py-4">
                Sin consultas aún
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-4 border-t border-neutral-100 dark:border-stone-800">
        {userRole === "ADMIN" && (
          <>
            <Link
              to="/admin"
              className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-600 dark:text-stone-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-stone-800 transition-all font-sans"
            >
              <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"/>
              </svg>
              Panel de Administración
            </Link>
            <Link
              to="/debug"
              className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-600 dark:text-stone-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-stone-800 transition-all font-sans"
            >
              <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Consola del Sistema
            </Link>
          </>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all font-sans text-left"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Salir de Cocina
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

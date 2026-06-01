import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Fallback de demostración offline para Vercel o sin Backend
    if ((username === "admin" && password === "admin") || (username === "user" && password === "user")) {
      localStorage.setItem("_sk1", username);
      localStorage.setItem("_sk2", username === "admin" ? "ADMIN" : "USER");
      localStorage.setItem("_sk3", username === "admin" ? "mock-admin" : "mock-user");
      localStorage.setItem("_mock_session", "true");
      navigate("/chat");
      return;
    }

    // Si no es demo, quitar bandera de mock y llamar al backend real
    localStorage.removeItem("_mock_session");

    try {
      const response = await api.post("/auth/login", {
        username: username,
        password: password,
      });

      if (response.data.username) {
        localStorage.setItem("_sk1", response.data.username);
        localStorage.setItem("_sk2", response.data.role || "USER");
        localStorage.setItem("_sk3", response.data.id);
        navigate("/chat");
      } else {
        setError("Respuesta del servidor incompleta.");
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Credenciales incorrectas o error de conexión.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-stone-950 flex flex-col items-center justify-center p-6 font-sans transition-colors duration-300">
      <div className="w-full max-w-sm mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs text-neutral-450 dark:text-stone-500 hover:text-primary transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
          </svg>
          Volver al inicio
        </Link>
      </div>

      <div className="w-full max-w-sm bg-white dark:bg-stone-900 border border-neutral-200 dark:border-stone-800 p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
        <div className="text-center mb-8">
          <div className="font-serif text-3xl font-light text-neutral-900 dark:text-white mb-2">Ingreso de Personal</div>
          <p className="text-[10px] text-neutral-400 dark:text-stone-500 uppercase tracking-widest">
            Ingresa tus credenciales
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

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-semibold text-neutral-400 dark:text-stone-500 mb-2">
              Nombre de usuario
            </label>
            <input
              type="text"
              placeholder="Ej: chef_michelin"
              className="w-full p-3 bg-neutral-50 dark:bg-stone-800 border border-neutral-200 dark:border-stone-700 focus:border-primary dark:focus:border-primary focus:outline-none text-sm text-neutral-800 dark:text-stone-100 transition-colors rounded-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-semibold text-neutral-400 dark:text-stone-500 mb-2">
              Contraseña
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

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white hover:bg-primary/95 text-sm font-semibold tracking-wide transition-all shadow-md"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-4 p-2.5 bg-neutral-50 dark:bg-stone-800/50 border border-neutral-200 dark:border-stone-800 text-[10px] text-neutral-500 dark:text-stone-400 font-mono text-center">
          💡 Demo offline: Usa <strong>admin/admin</strong> o <strong>user/user</strong>.
        </div>

        <div className="mt-8 text-center text-xs text-neutral-500 dark:text-stone-400 font-light border-t border-neutral-100 dark:border-stone-800 pt-6">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Crear cuenta
          </Link>
        </div>
      </div>

      <div className="mt-12 text-[10px] font-mono text-neutral-300 dark:text-stone-700 uppercase tracking-widest">
        SalchiChat Gateway v2.0
      </div>
    </div>
  );
};

export default Login;

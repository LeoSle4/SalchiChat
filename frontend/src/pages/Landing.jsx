import { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

const Landing = () => {
  // Estado para abrir y cerrar la navegación móvil con el botón hamburguesa
  const [isNavOpen, setIsNavOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white dark:bg-stone-950 text-neutral-800 dark:text-stone-200 flex flex-col font-sans selection:bg-primary selection:text-white transition-colors duration-300">
      <nav className="navbar flex flex-wrap bg-white/80 dark:bg-stone-950/80 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-16 border-b border-neutral-100 dark:border-stone-900 py-4 justify-between items-center">
        <div className="w-10 h-10 md:hidden flex-none"></div>
        <div className="flex-1 flex justify-center md:justify-start min-w-[150px]">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="SalchiChat Logo" className="w-8 h-8 rounded-full border border-neutral-200 dark:border-stone-850" />
            <span className="font-serif text-2xl font-semibold tracking-wide text-neutral-900 dark:text-white">
              SalchiChat
            </span>
          </Link>
        </div>
        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="w-10 h-10 flex items-center justify-end md:hidden text-neutral-800 dark:text-white flex-none"
          aria-label="Toggle navigation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
          </svg>
        </button>
        <div className="hidden md:flex items-center gap-6">
          <ThemeToggle />
          <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors py-2">
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className="py-2.5 px-6 bg-primary text-white hover:bg-primary/95 text-sm font-medium tracking-wide transition-all shadow-md"
          >
            Crear cuenta
          </Link>
        </div>
        {isNavOpen && (
          <div className="w-full flex flex-col items-center gap-4 py-4 md:hidden border-t border-neutral-100 dark:border-stone-900 bg-white dark:bg-stone-950 mt-4 animate-in slide-in-from-top duration-200">
            <div className="flex items-center justify-between w-full px-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 dark:text-stone-500">Modo Oscuro</span>
              <ThemeToggle />
            </div>
            <Link
              to="/login"
              onClick={() => setIsNavOpen(false)}
              className="w-full text-center py-2 text-sm font-medium hover:text-primary border-b border-neutral-100 dark:border-stone-900/50"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              onClick={() => setIsNavOpen(false)}
              className="w-full text-center py-3 bg-primary text-white text-sm font-medium tracking-wide"
            >
              Crear cuenta
            </Link>
          </div>
        )}
      </nav>

      <header className="relative min-h-[85vh] bg-neutral-50 dark:bg-stone-900/30 flex items-center justify-center overflow-hidden border-b border-neutral-100 dark:border-stone-900">
        <div className="absolute inset-0 z-0">
          <img
            src="/gourmet_dish.png"
            alt="Cocina Gourmet"
            className="w-full h-full object-cover opacity-15 dark:opacity-5"
          />
        </div>
        <div className="relative z-10 max-w-4xl text-center px-6 py-12">
          <div className="inline-block py-1.5 px-4 border border-secondary text-[10px] tracking-[0.2em] uppercase text-secondary font-semibold mb-6">
            El Arte de la Cocina Guiada
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-neutral-900 dark:text-white tracking-tight leading-tight mb-6">
            Cocina del Alma con <br />
            <span className="italic font-normal text-primary">SalchiChat</span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-stone-400 max-w-xl mx-auto leading-relaxed mb-10 font-light">
            Descubre la sofisticación del servicio culinario interactivo. Nuestro asistente inteligente organiza tu alacena para componer recetas gourmet de primer nivel al instante.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-xs sm:max-w-none mx-auto">
            <Link
              to="/login"
              className="py-4 px-10 bg-primary text-white hover:bg-primary/95 font-medium tracking-wide transition-all shadow-lg text-center"
            >
              Entrar en Cocina
            </Link>
            <a
              href="#filosofia"
              className="py-4 px-10 border border-neutral-300 dark:border-stone-700 hover:border-primary dark:hover:border-primary text-neutral-800 dark:text-stone-300 font-medium tracking-wide transition-all text-center"
            >
              Nuestra Filosofía
            </a>
          </div>
        </div>
      </header>

      <section id="filosofia" className="py-24 bg-white dark:bg-stone-950 px-6 border-b border-neutral-100 dark:border-stone-900 transition-colors">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-neutral-900 dark:text-white tracking-wide mb-16 uppercase">
            El Servicio en Cuatro Tiempos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center p-4 border border-neutral-100 dark:border-stone-900 bg-neutral-50/50 dark:bg-stone-900/10">
              <div className="w-8 h-8 rounded-full border border-primary text-primary flex items-center justify-center font-serif text-sm mb-4">I</div>
              <h3 className="text-sm font-semibold tracking-wider uppercase mb-2 text-neutral-900 dark:text-white">Ingredientes</h3>
              <p className="text-xs text-neutral-500 dark:text-stone-450 font-light">Inventario actual de tu nevera</p>
            </div>
            <div className="flex flex-col items-center p-4 border border-neutral-100 dark:border-stone-900 bg-neutral-50/50 dark:bg-stone-900/10">
              <div className="w-8 h-8 rounded-full border border-primary text-primary flex items-center justify-center font-serif text-sm mb-4">II</div>
              <h3 className="text-sm font-semibold tracking-wider uppercase mb-2 text-neutral-900 dark:text-white">La Comanda</h3>
              <p className="text-xs text-neutral-500 dark:text-stone-450 font-light">Envío de tu solicitud culinaria</p>
            </div>
            <div className="flex flex-col items-center p-4 border border-neutral-100 dark:border-stone-900 bg-neutral-50/50 dark:bg-stone-900/10">
              <div className="w-8 h-8 rounded-full border border-primary text-primary flex items-center justify-center font-serif text-sm mb-4">III</div>
              <h3 className="text-sm font-semibold tracking-wider uppercase mb-2 text-neutral-900 dark:text-white">El Algoritmo</h3>
              <p className="text-xs text-neutral-500 dark:text-stone-450 font-light">Procesamiento inteligente con Gemini</p>
            </div>
            <div className="flex flex-col items-center p-4 border border-neutral-100 dark:border-stone-900 bg-neutral-50/50 dark:bg-stone-900/10">
              <div className="w-8 h-8 rounded-full border border-primary text-primary flex items-center justify-center font-serif text-sm mb-4">IV</div>
              <h3 className="text-sm font-semibold tracking-wider uppercase mb-2 text-neutral-900 dark:text-white">El Emplatado</h3>
              <p className="text-xs text-neutral-500 dark:text-stone-450 font-light">Receta detallada lista para servir</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-neutral-50/50 dark:bg-stone-900/20 px-6 border-b border-neutral-100 dark:border-stone-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-stone-900 p-8 border border-neutral-200 dark:border-stone-800 shadow-md relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
              <div className="w-12 h-12 border border-neutral-200 dark:border-stone-700 rounded-full flex items-center justify-center mb-6 bg-neutral-50 dark:bg-stone-800">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z"/>
                </svg>
              </div>
              <h3 className="font-serif text-xl font-medium text-neutral-900 dark:text-white mb-3">Búsqueda Exquisita</h3>
              <p className="text-sm text-neutral-500 dark:text-stone-400 font-light leading-relaxed">
                Localiza las mejores combinaciones culinarias basándote en lo que tienes a la mano de forma eficiente.
              </p>
            </div>
            <div className="bg-white dark:bg-stone-900 p-8 border border-neutral-200 dark:border-stone-800 shadow-md relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-secondary"></div>
              <div className="w-12 h-12 border border-neutral-200 dark:border-stone-700 rounded-full flex items-center justify-center mb-6 bg-neutral-50 dark:bg-stone-800">
                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h3 className="font-serif text-xl font-medium text-neutral-900 dark:text-white mb-3">Guías de Cocción</h3>
              <p className="text-sm text-neutral-500 dark:text-stone-400 font-light leading-relaxed">
                Instrucciones elaboradas paso a paso con rigor técnico profesional para que logres la cocción perfecta.
              </p>
            </div>
            <div className="bg-white dark:bg-stone-900 p-8 border border-neutral-200 dark:border-stone-800 shadow-md relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
              <div className="w-12 h-12 border border-neutral-200 dark:border-stone-700 rounded-full flex items-center justify-center mb-6 bg-neutral-50 dark:bg-stone-800">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
                </svg>
              </div>
              <h3 className="font-serif text-xl font-medium text-neutral-900 dark:text-white mb-3">Organización Técnica</h3>
              <p className="text-sm text-neutral-500 dark:text-stone-400 font-light leading-relaxed">
                Planifica tu minuta de la semana y guarda tus recetas favoritas en un entorno cómodo y exclusivo.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 border border-neutral-200 dark:border-stone-800 p-8 sm:p-12 mt-24 shadow-lg max-w-4xl mx-auto flex flex-col sm:flex-row justify-around text-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-primary"></div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-stone-500 font-semibold mb-2">Comandas Servidas</div>
              <div className="font-serif text-4xl font-light text-neutral-900 dark:text-white">25.6K</div>
            </div>
            <div className="hidden sm:block border-l border-neutral-200 dark:border-stone-800"></div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-stone-500 font-semibold mb-2">Chefs de Cocina</div>
              <div className="font-serif text-4xl font-light text-neutral-900 dark:text-white">1,200</div>
            </div>
            <div className="hidden sm:block border-l border-neutral-200 dark:border-stone-800"></div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-stone-500 font-semibold mb-2">Tiempo de Despacho</div>
              <div className="font-serif text-4xl font-light text-neutral-900 dark:text-white">0.8s</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-neutral-900 dark:bg-stone-950 text-white text-center transition-colors">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide mb-6 uppercase">
            Únete a la Brigada
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 font-light max-w-lg mx-auto leading-relaxed mb-10">
            Regístrate ahora para interactuar con SalchiChat y elevar tus destrezas culinarias al siguiente nivel.
          </p>
          <Link
            to="/register"
            className="inline-block py-4 px-10 bg-primary text-white hover:bg-primary/95 font-medium tracking-wide transition-all shadow-md"
          >
            Crear Cuenta Gratis
          </Link>
        </div>
      </section>

      <footer className="bg-white dark:bg-stone-950 border-t border-neutral-200 dark:border-stone-900 py-16 px-6 sm:px-16 transition-colors mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-sm text-neutral-500 dark:text-stone-400">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="font-serif text-neutral-900 dark:text-white font-semibold uppercase tracking-wider text-xs mb-4">SalchiChat</h4>
            <ul className="flex flex-col items-center sm:items-start gap-2 font-light">
              <li><Link to="/" className="hover:text-primary transition-colors">Nuestro concepto</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Funcionalidades</Link></li>
            </ul>
          </div>
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="font-serif text-neutral-900 dark:text-white font-semibold uppercase tracking-wider text-xs mb-4">Tecnología</h4>
            <ul className="flex flex-col items-center sm:items-start gap-2 font-light">
              <li><span className="text-neutral-400 dark:text-stone-600">SalchiEngine API</span></li>
              <li><span className="text-neutral-400 dark:text-stone-600">Gemini Intelligence</span></li>
            </ul>
          </div>
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="font-serif text-neutral-900 dark:text-white font-semibold uppercase tracking-wider text-xs mb-4">Legal</h4>
            <ul className="flex flex-col items-center sm:items-start gap-2 font-light">
              <li><span className="text-neutral-400 dark:text-stone-600">Políticas de Privacidad</span></li>
              <li><span className="text-neutral-400 dark:text-stone-600">Términos de Servicio</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-neutral-100 dark:border-stone-900 mt-12 pt-6 text-center text-xs text-neutral-400 dark:text-stone-500 font-light">
          &copy; {new Date().getFullYear()} SalchiChat. Todos los derechos reservados. Desarrollado para UTP.
        </div>
      </footer>
    </div>
  );
};

export default Landing;

import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import ReactMarkdown from "react-markdown";
import ThemeToggle from "../components/ThemeToggle";
import Sidebar from "../components/Sidebar";

// Componente principal de la interfaz: la estación de chat culinario
const ChatDashboard = () => {
  const [messages, setMessages] = useState([
    {
      sender: "GEMINI",
      content:
        "Bienvenido al servicio. Soy SalchiChat, su asistente de cocina. ¿Qué ingredientes tenemos hoy para componer su menú?",
    },
  ]);
  const [input, setInput] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(() =>
    Date.now().toString(),
  );
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const inputRef = useRef("");
  const userRole = localStorage.getItem("_sk2") || "USER";

  // Al montar la pantalla, traemos el historial de consultas previas del usuario desde el servidor
  useEffect(() => {
    const fetchHistory = async () => {
      const u = localStorage.getItem("_sk3");
      try {
        const res = await api.get(`/chat/history/${u}`);
        setAllMessages(res.data);
      } catch {
        console.error("ERR_SYNC_DATA");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-stone-950 flex items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-neutral-200 border-t-primary rounded-full animate-spin"></div>
          <span className="font-serif text-sm tracking-widest text-neutral-400 dark:text-stone-500 uppercase animate-pulse">Preparación...</span>
        </div>
      </div>
    );
  }

  const groups = allMessages.reduce((acc, msg) => {
    const sid = msg.sessionId || "default";
    if (!acc[sid]) {
      acc[sid] = {
        id: sid,
        title:
          msg.prompt && msg.prompt.trim() !== ""
            ? msg.prompt.substring(0, 30) + "..."
            : "Nueva Consulta",
        generatedTitle: msg.sessionTitle || null,
        msgs: [],
      };
    }
    acc[sid].msgs.push(msg);
    return acc;
  }, {});
  const sessions = Object.values(groups).reverse();

  const selectSession = (sessionId) => {
    const session = sessions.find((s) => s.id === sessionId);
    const formattedMsgs = session.msgs.flatMap((m) => [
      { sender: "USER", content: m.prompt },
      { sender: "GEMINI", content: m.response },
    ]);
    setMessages(formattedMsgs);
    setCurrentSessionId(sessionId);
    setIsMobileMenuOpen(false);
  };

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  const updateTitle = async (sid) => {
    try {
      const res = await api.get(`/chat/generate-title/${sid}`);
      setAllMessages((prev) =>
        prev.map((m) =>
          m.sessionId === sid ? { ...m, sessionTitle: res.data.title } : m,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Envía el mensaje escrito por el usuario al servidor y procesa la respuesta del chef de IA (Gemini)
  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!inputRef.current.trim() || isLoading) return;

    const userPrompt = inputRef.current;
    setMessages((prev) => [...prev, { sender: "USER", content: userPrompt }]);
    setInput("");
    inputRef.current = "";
    setIsLoading(true);

    const u = localStorage.getItem("_sk3");

    try {
      const response = await api.post("/chat/ask", {
        prompt: userPrompt,
        userId: u ? Number(u) : null,
        platform: "WEB",
        sessionId: currentSessionId,
      });

      const aiResponse = response.data.response;

      setMessages((prev) => {
        const newMessages = [
          ...prev,
          { sender: "GEMINI", content: aiResponse },
        ];
        if (newMessages.length === 4) {
          updateTitle(currentSessionId);
        }
        return newMessages;
      });

      setAllMessages((prev) => [
        ...prev,
        {
          sessionId: currentSessionId,
          prompt: userPrompt,
          response: aiResponse,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "GEMINI",
          content:
            "Ocurrió un error de conexión con el chef de cocina. Por favor, inténtelo de nuevo.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([
      {
        sender: "GEMINI",
        content:
          "Plan de trabajo limpio. Nueva sesión de cocina iniciada. ¿Qué platillo prepararemos?",
      },
    ]);
    setCurrentSessionId(Date.now().toString());
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-stone-950 text-neutral-800 dark:text-stone-200 overflow-hidden font-sans transition-colors duration-300">
      <div className="hidden md:block h-full w-80 shrink-0">
        <Sidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          selectSession={selectSession}
          startNewChat={startNewChat}
          userRole={userRole}
        />
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-stone-950/40 dark:bg-stone-950/70 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-[280px] h-full bg-white dark:bg-stone-900 z-50 animate-in slide-in-from-left duration-200">
            <Sidebar
              sessions={sessions}
              currentSessionId={currentSessionId}
              selectSession={selectSession}
              startNewChat={startNewChat}
              userRole={userRole}
            />
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col justify-between h-full bg-neutral-50 dark:bg-stone-950 relative overflow-hidden">
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
              <h2 className="font-serif text-lg font-medium text-neutral-900 dark:text-white tracking-wide flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Chef de Cocina
              </h2>
              <span className="text-[9px] text-neutral-400 dark:text-stone-500 tracking-wider uppercase font-mono">
                Estación Culinaria Activa
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-white dark:bg-stone-950 border-b border-neutral-100 dark:border-stone-900">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-4 ${msg.sender === "USER" ? "justify-end" : "justify-start"} animate-plate-slide`}
              >
                {msg.sender === "GEMINI" && (
                  <div className="w-8 h-8 rounded-full border border-neutral-200 dark:border-stone-800 flex items-center justify-center shrink-0 text-xs font-serif bg-neutral-50 dark:bg-stone-900 text-neutral-700 dark:text-stone-300">
                    C
                  </div>
                )}
                <div
                  className={`relative p-5 max-w-[85%] sm:max-w-xl text-sm leading-relaxed border shadow-sm ${
                    msg.sender === "USER"
                      ? "bg-neutral-50 dark:bg-stone-900 text-neutral-900 dark:text-stone-100 border-neutral-200 dark:border-stone-800"
                      : "bg-white dark:bg-stone-900/40 text-neutral-800 dark:text-stone-250 border-neutral-200 dark:border-stone-800"
                  }`}
                >
                  <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                  {msg.sender === "GEMINI" && (
                    <button
                      onClick={() => speak(msg.content)}
                      className="absolute bottom-2 right-2 text-neutral-400 dark:text-stone-500 hover:text-primary dark:hover:text-primary transition-colors"
                      aria-label="Escuchar respuesta"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"/>
                      </svg>
                    </button>
                  )}
                </div>
                {msg.sender === "USER" && (
                  <div className="w-8 h-8 rounded-full border border-neutral-200 dark:border-stone-800 flex items-center justify-center shrink-0 text-xs font-serif bg-black dark:bg-stone-900 text-white dark:text-stone-300">
                    U
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 rounded-full border border-primary flex items-center justify-center shrink-0 bg-neutral-50 dark:bg-stone-900 text-primary animate-pan-sizzle">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21V9.75M3.284 14.253A8.987 8.987 0 013 12c0-4.97 4.03-9 9-9s9 4.03 9 9c0 .777-.098 1.53-.284 2.253m-17.432 0A9.025 9.025 0 0012 15m0 0a9.025 9.025 0 007.432-3.747M12 15V9.75"/>
                  </svg>
                </div>
                <div className="p-5 max-w-xl text-sm italic text-neutral-400 dark:text-stone-500 bg-white dark:bg-stone-900/40 border border-neutral-100 dark:border-stone-900 flex items-center gap-3">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-steam-float"></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-steam-float [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-steam-float [animation-delay:0.4s]"></span>
                  </div>
                  Preparando comanda...
                </div>
              </div>
            )}
          </div>
        </div>

        <form
          onSubmit={handleSend}
          className="p-4 sm:p-6 bg-white dark:bg-stone-900 border-t border-neutral-200 dark:border-stone-800 shrink-0 transition-colors duration-300"
        >
          <div className="max-w-3xl mx-auto flex gap-2 sm:gap-4">
            <textarea
              placeholder="Escribe un ingrediente o formula tu consulta..."
              className="flex-1 p-3 bg-neutral-50 dark:bg-stone-800 border border-neutral-200 dark:border-stone-700 focus:border-primary dark:focus:border-primary focus:outline-none text-sm text-neutral-850 dark:text-stone-100 transition-colors resize-none min-h-[2.5rem] max-h-32 py-3 rounded-none"
              rows="1"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                inputRef.current = e.target.value;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              type="submit"
              className="w-12 h-12 flex items-center justify-center bg-primary text-white hover:bg-primary/95 transition-colors shrink-0 shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"/>
              </svg>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ChatDashboard;

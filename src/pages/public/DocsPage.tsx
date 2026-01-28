import React, { useState } from "react";
import {
  FaServer, FaDesktop, FaCloud, FaShieldAlt, FaTerminal,
  FaCode, FaLayerGroup, FaListUl, FaDocker, FaNetworkWired,
  FaPalette, FaCheckCircle, FaCube, FaArrowRight, FaDatabase,
  FaKey, FaCogs, FaSearch, FaRocket, FaFolderOpen
} from "react-icons/fa";

// Componente de Badge Refinado
const Badge = ({ children, color = "sky" }: { children: React.ReactNode; color?: string }) => {
  const colors: Record<string, string> = {
    sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${colors[color] || colors.sky}`}>
      {children}
    </span>
  );
};

// Endpoint Card con Estilo de Tabla de API
const EndpointCard = ({ method, path, desc }: { method: string; path: string; desc: string }) => (
  <div className="group flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700">
    <div className="flex items-center gap-3">
      <span className={`text-[10px] font-black px-3 py-1 rounded-md w-14 text-center ${method === 'GET' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-sky-500/10 text-sky-600'
        }`}>
        {method}
      </span>
      <code className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight">
        {path}
      </code>
    </div>
    <div className="h-px md:h-4 md:w-px bg-slate-200 dark:bg-slate-800" />
    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">
      {desc}
    </span>
  </div>
);

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("vision");

  const menuItems = [
    { id: "vision", label: "Visión General", icon: FaSearch },
    { id: "stack", label: "Stack Tecnológico", icon: FaLayerGroup },
    { id: "catalogos", label: "Catálogos API", icon: FaListUl },
    { id: "infra", label: "Infraestructura", icon: FaNetworkWired },
    { id: "comandos", label: "Guía de Comandos", icon: FaTerminal },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-500">

      {/* Hero Header Centrado e Impactante */}
      <header className="relative pt-32 pb-20 overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#020617]">
        {/* Decoración de fondo técnica */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 opacity-5 dark:opacity-10 pointer-events-none">
          <FaCode size={400} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-[0.3em] mb-10">
            <FaTerminal className="animate-pulse" /> InmoCore Resources v2.0.4
          </div>

          <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic leading-none mb-8">
            InmoCore <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-sky-500">
              System Docs
            </span>
          </h1>

          <div className="flex flex-col items-center justify-center gap-4">
            <p className="max-w-2xl text-slate-500 dark:text-slate-400 font-bold italic uppercase tracking-[0.15em] text-xs leading-relaxed">
              Documentación técnica avanzada para el ecosistema inmobiliario core.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-sky-500 rounded-full" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-12 gap-16">

          {/* Sidebar de navegación */}
          <aside className="lg:col-span-3">
            <div className="sticky top-28">
              <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] mb-6">Navegación Técnica</p>
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeSection === item.id
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                      }`}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Área de Contenido Principal */}
          <main className="lg:col-span-9">

            {/* Header de la sección activa */}
            <div className="mb-12">
              <h2 className="text-4xl font-black tracking-tighter uppercase italic dark:text-white mb-4">
                {menuItems.find(m => m.id === activeSection)?.label}
              </h2>
              <div className="h-1.5 w-20 bg-sky-500 rounded-full" />
            </div>

            {/* 1. Visión General */}
            {activeSection === "vision" && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
                <div className="p-10 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden border border-white/5">
                  <FaRocket className="absolute -bottom-4 -right-4 text-white/5 text-[12rem] rotate-12" />
                  <h3 className="text-2xl font-black italic uppercase mb-4 tracking-tight flex items-center gap-3">
                    <FaCube className="text-orange-500" /> Core Mission
                  </h3>
                  <p className="text-slate-300 text-lg leading-relaxed italic max-w-2xl font-medium">
                    Arquitectura modular diseñada para la alta disponibilidad en el sector inmobiliario, integrando servicios RESTful con una interfaz reactiva de baja latencia.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <FaPalette className="text-orange-500 mb-6" size={28} />
                    <h4 className="font-black uppercase italic text-sm mb-3">Diseño Adaptativo</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium italic tracking-wide">Basado en Tailwind JIT para una consistencia visual absoluta.</p>
                  </div>
                  <div className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <FaShieldAlt className="text-sky-500 mb-6" size={28} />
                    <h4 className="font-black uppercase italic text-sm mb-3">Seguridad Robusta</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium italic tracking-wide">Protección de identidades mediante Bcrypt hashing y TLS 1.3.</p>
                  </div>
                </div>
              </section>
            )}

            {/* 2. Stack Tecnológico */}
            {activeSection === "stack" && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div>
                      <h4 className="flex items-center gap-3 text-xs font-black uppercase italic tracking-widest text-slate-400 mb-4">
                        <FaDesktop className="text-sky-500" /> Frontend Layer
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {["React 18", "TypeScript", "Vite", "React Query", "Framer Motion"].map(t => <Badge key={t}>{t}</Badge>)}
                      </div>
                    </div>
                    <div>
                      <h4 className="flex items-center gap-3 text-xs font-black uppercase italic tracking-widest text-slate-400 mb-4">
                        <FaServer className="text-orange-500" /> Backend Layer
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {["NestJS Core", "PostgreSQL", "TypeORM", "Swagger UI", "JWT Auth"].map(t => <Badge key={t} color="orange">{t}</Badge>)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0f172a] rounded-3xl p-8 shadow-2xl border border-white/5">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                      </div>
                      <FaFolderOpen className="text-slate-600" />
                    </div>
                    <div className="space-y-3 font-mono text-[11px]">
                      <div className="flex items-center gap-2 text-sky-400 font-bold italic"><FaFolderOpen /> src</div>
                      <div className="pl-4 flex items-center gap-2 text-slate-500"><FaCogs /> api/services.ts</div>
                      <div className="pl-4 flex items-center gap-2 text-slate-500"><FaCube /> components/shared/</div>
                      <div className="pl-4 flex items-center gap-2 text-orange-400 font-bold italic"><FaKey /> auth/context/</div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 3. Catálogos API */}
            {activeSection === "catalogos" && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
                <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-2xl mb-8 flex items-start gap-4">
                  <FaCheckCircle className="text-emerald-500 mt-1" />
                  <div>
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase italic tracking-tight">Endpoints Operativos</p>
                    <p className="text-xs text-slate-500 italic mt-1 font-medium leading-relaxed">Arquitectura RESTful con tipado fuerte en todas las respuestas de catálogo.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <EndpointCard method="GET" path="/properties" desc="Propiedades con relaciones de agente y categorías." />
                  <EndpointCard method="GET" path="/categories" desc="Listado maestro de tipos de inmuebles." />
                  <EndpointCard method="GET" path="/locations" desc="Regiones, ciudades y sectores geográficos." />
                  <EndpointCard method="GET" path="/property-features" desc="Atributos técnicos y amenities." />
                  <EndpointCard method="GET" path="/users" desc="Gestión administrativa de cuentas (RBAC)." />
                </div>
              </section>
            )}

            {/* 4. Infraestructura */}
            {activeSection === "infra" && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="grid sm:grid-cols-3 gap-6">
                  {[
                    { label: "Cloud Engine", value: "Hostinger VPS", icon: FaCloud, color: "text-sky-500" },
                    { label: "Runtime", value: "Docker Engine", icon: FaDocker, color: "text-blue-500" },
                    { label: "Gateway", value: "Nginx Proxy", icon: FaNetworkWired, color: "text-slate-500" },
                  ].map((card, i) => (
                    <div key={i} className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center transition-all hover:border-orange-500/30">
                      <card.icon size={28} className={`${card.color} mb-6 mx-auto`} />
                      <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">{card.label}</h5>
                      <p className="text-sm font-black italic dark:text-white uppercase">{card.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-10 p-10 rounded-[3rem] bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-center">
                  <FaShieldAlt size={32} className="text-emerald-500 mx-auto mb-6" />
                  <p className="text-xs text-slate-500 font-bold italic uppercase tracking-[0.2em] mb-4">Security & SSL Active</p>
                  <p className="text-xs text-slate-400 max-w-xl mx-auto italic leading-relaxed font-medium">
                    Tráfico encriptado vía certificados Let's Encrypt. Protección perimetral con Nginx y políticas de CORS estrictas.
                  </p>
                </div>
              </section>
            )}

            {/* 5. Guía de Comandos */}
            {activeSection === "comandos" && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-4">
                {[
                  { cmd: "npm install", label: "Setup Dependencies", icon: FaDatabase },
                  { cmd: "npm run dev", label: "Dev Environment", icon: FaCode },
                  { cmd: "npm run build", label: "Compilar Production", icon: FaCube },
                  { cmd: "docker-compose up -d", label: "Deploy Docker", icon: FaDocker },
                ].map((item, i) => (
                  <div key={i} className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between transition-all hover:bg-slate-950 dark:hover:bg-white group-hover:text-white">
                    <div className="flex items-center gap-6">
                      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
                        <item.icon size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 group-hover:text-slate-500 transition-colors">{item.label}</p>
                        <code className="text-base font-black text-orange-500 dark:text-orange-400 tracking-tighter group-hover:text-orange-500">{item.cmd}</code>
                      </div>
                    </div>
                    <FaArrowRight className="text-slate-300 dark:text-slate-700 group-hover:translate-x-2 transition-all" />
                  </div>
                ))}
              </section>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
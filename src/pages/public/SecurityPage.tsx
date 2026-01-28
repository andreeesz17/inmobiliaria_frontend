import {
    FaLock, FaCode, FaNetworkWired, FaDatabase,
    FaChartLine, FaGlobe, FaCertificate,
    FaArrowRight, FaQuestionCircle, FaShieldAlt, FaUserShield
} from "react-icons/fa";

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans">
            
            {/* Capa de Red de Fondo (Cyber Grid) */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.03] dark:opacity-[0.05]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-blue-500/10 via-transparent to-transparent blur-3xl" />
            </div>

            {/* Hero Section: Impacto Inmediato */}
            <header className="relative pt-32 pb-20 px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col items-center text-center">
                        {/* Icono Principal con Aura */}
                        <div className="relative mb-12">
                            <div className="absolute inset-0 bg-blue-500 rounded-[2.5rem] blur-[40px] opacity-20 animate-pulse" />
                            <div className="relative w-28 h-28 rounded-[2.5rem] bg-slate-900 dark:bg-white flex items-center justify-center shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                                <FaUserShield className="w-12 h-12 text-white dark:text-slate-950" />
                            </div>
                        </div>

                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-[10px] font-black tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-8 uppercase italic">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                            </span>
                            Infraestructura de Grado Militar
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase leading-none mb-8">
                            Blindaje <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">
                                de Datos
                            </span>
                        </h1>

                        <p className="max-w-2xl text-xl text-slate-500 dark:text-slate-400 font-medium italic">
                            No solo guardamos información; construimos fortalezas digitales bajo los protocolos <span className="text-slate-900 dark:text-white font-black underline decoration-blue-500">Zero-Trust</span> más avanzados.
                        </p>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 pb-32 space-y-40">
                
                {/* Stats Grid: "The Security Dashboard" */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {[
                        { label: "Protocolo", value: "AES-256", sub: "Encriptación de Grado Bancario", icon: FaLock },
                        { label: "Cumplimiento", value: "GDPR+", sub: "Privacidad Global por Diseño", icon: FaGlobe },
                        { label: "Uptime", value: "99.99%", sub: "Disponibilidad Garantizada", icon: FaChartLine },
                        { label: "Auditoría", value: "Real-Time", sub: "Monitoreo de Amenazas 24/7", icon: FaShieldAlt },
                    ].map((stat, i) => (
                        <div key={i} className="group relative p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2">
                            <stat.icon className="text-blue-500 mb-6 text-2xl group-hover:scale-110 transition-transform" />
                            <div className="text-3xl font-black text-slate-900 dark:text-white mb-1 tracking-tight italic uppercase">{stat.value}</div>
                            <div className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">{stat.label}</div>
                            <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">{stat.sub}</p>
                        </div>
                    ))}
                </section>

                {/* Sección de Certificaciones (Dark Card Style) */}
                <section>
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="max-w-xl">
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-4">Certificaciones & Estándares</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium italic">Validaciones externas que garantizan nuestra integridad operativa.</p>
                        </div>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800 mx-8 hidden md:block" />
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "ISO 27001", desc: "Gestión proactiva de riesgos de información.", color: "from-blue-500/20" },
                            { title: "SOC 2 Type II", desc: "Auditados en seguridad y confidencialidad.", color: "from-purple-500/20" },
                            { title: "PCI-DSS", desc: "Transacciones seguras en todo momento.", color: "from-indigo-500/20" },
                            { title: "HIPAA Ready", desc: "Preparados para datos de alta sensibilidad.", color: "from-cyan-500/20" },
                        ].map((item, i) => (
                            <div key={i} className="relative p-8 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden group">
                                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${item.color} to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                                <FaCertificate className="text-blue-500 mb-6 text-xl" />
                                <h3 className="text-lg font-black text-slate-900 dark:text-white italic uppercase mb-3">{item.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Arquitectura Técnica: La "Caja Negra" */}
                <section className="relative overflow-hidden rounded-[3rem] bg-slate-900 text-white p-8 md:p-20 shadow-3xl dark:ring-1 dark:ring-white/10">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/10 to-transparent" />
                    
                    <div className="relative grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h3 className="text-3xl md:text-5xl font-black uppercase italic leading-none mb-10">
                                Arquitectura <br /> 
                                <span className="text-blue-500 underline decoration-white/20">Multicapa</span>
                            </h3>
                            <div className="space-y-8">
                                {[
                                    { t: "Capa de Aplicación", d: "Protección OWASP Top 10 y saneamiento de inputs.", i: FaCode },
                                    { t: "Capa de Red", d: "Firewalls de última generación y mitigación DDoS inteligente.", i: FaNetworkWired },
                                    { t: "Capa de Datos", d: "Sharding y encriptación en reposo y en tránsito.", i: FaDatabase },
                                ].map((layer, idx) => (
                                    <div key={idx} className="flex gap-6 group">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                            <layer.i />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-lg uppercase italic tracking-wide mb-1">{layer.t}</h4>
                                            <p className="text-slate-400 text-sm font-medium italic">{layer.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="h-3 w-3 rounded-full bg-red-500" />
                                <div className="h-3 w-3 rounded-full bg-amber-500" />
                                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest ml-auto text-slate-500 italic">Core Monitor</span>
                            </div>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                    <span className="text-xs font-bold text-slate-400 italic italic">DDoS Protection</span>
                                    <span className="text-xs font-black text-emerald-400 uppercase">Active</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                    <span className="text-xs font-bold text-slate-400 italic">SSL Handshake</span>
                                    <span className="text-xs font-black text-emerald-400 uppercase">Secure</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400 italic">Vulnerability Scan</span>
                                    <span className="text-xs font-black text-blue-400 uppercase italic">In Progress...</span>
                                </div>
                                <div className="mt-8 pt-8 border-t border-white/10">
                                    <p className="text-[10px] leading-relaxed font-mono text-slate-500">
                                        SYSTEM_STATUS: ROBUST <br />
                                        LAST_INCIDENT: 0 DAYS AGO <br />
                                        SECURITY_LEVEL: ALPHA
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Final: Soporte */}
                <section className="text-center">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white mb-10 shadow-inner group-hover:rotate-12 transition-transform">
                        <FaQuestionCircle className="h-10 w-10" />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-8 leading-none">
                        ¿Preguntas sobre <br /> <span className="text-blue-600">tu privacidad?</span>
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black uppercase italic text-xs tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl">
                            Reportar Vulnerabilidad
                        </button>
                        <button className="px-10 py-5 border-2 border-slate-200 dark:border-slate-800 font-black uppercase italic text-xs tracking-widest rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                            Política de Datos <FaArrowRight className="inline ml-2" />
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}
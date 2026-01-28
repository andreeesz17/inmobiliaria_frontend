import {
    FaHome, FaBuilding, FaChartLine, FaShieldAlt, FaUsers,
    FaFileContract, FaHeadset, FaRocket, FaCheck, FaArrowRight,
    FaMagic, FaChartPie
} from "react-icons/fa";

export default function ServicesPage() {
    const services = [
        { title: "Gestión de Propiedades", icon: FaHome, color: "from-orange-500 to-orange-600", desc: "Publicación masiva y optimización de listados con un click." },
        { title: "CRM Avanzado", icon: FaUsers, color: "from-sky-500 to-blue-600", desc: "Seguimiento automatizado de clientes y embudos de venta." },
        { title: "Análisis de Datos", icon: FaChartLine, color: "from-indigo-500 to-purple-600", desc: "Reportes en tiempo real sobre el rendimiento de tu stock." },
        { title: "Contratos Legales", icon: FaFileContract, color: "from-emerald-500 to-teal-600", desc: "Firma electrónica segura y plantillas personalizables." },
        { title: "Seguridad Pro", icon: FaShieldAlt, color: "from-slate-700 to-slate-900", desc: "Protección de datos bajo estándares ISO internacionales." },
        { title: "Soporte 24/7", icon: FaHeadset, color: "from-rose-500 to-pink-600", desc: "Asistencia técnica dedicada para que nunca te detengas." },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-500">

            {/* Ambient Background Lights */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-[-10%] w-[600px] h-[600px] bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 right-[-10%] w-[600px] h-[600px] bg-sky-500/5 dark:bg-sky-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            {/* Hero Section */}
            <header className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-8">
                        <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">
                            Ecosistema Inmobiliario 2026
                        </span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase italic italic mb-8">
                        Soluciones <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-orange-500 to-sky-500">
                            Sin Límites
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium italic leading-relaxed">
                        Transformamos la complejidad del mercado en una ventaja competitiva con herramientas de <span className="text-slate-900 dark:text-white font-bold">última generación</span>.
                    </p>

                    {/* Dashboard Style Stats */}
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {[
                            { label: "Propiedades", value: "10K+", icon: FaBuilding },
                            { label: "Eficiencia", value: "+40%", icon: FaMagic },
                            { label: "Seguridad", value: "ISO", icon: FaShieldAlt },
                            { label: "SLA", value: "99.9%", icon: FaChartPie },
                        ].map((stat, i) => (
                            <div key={i} className="p-6 rounded-[2rem] bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 backdrop-blur-md">
                                <stat.icon className="text-orange-500 mb-3 mx-auto" />
                                <div className="text-2xl font-black dark:text-white uppercase italic">{stat.value}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-20 space-y-40">

                {/* Services Grid */}
                <section>
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                        <div className="max-w-xl text-left">
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter dark:text-white">Catálogo de Potencia</h2>
                            <p className="text-slate-500 font-medium italic mt-2 text-lg">Herramientas diseñadas para dominar el stock y cerrar ventas en tiempo récord.</p>
                        </div>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800 mx-8 hidden md:block" />
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {services.map((s, i) => (
                            <div key={i} className="group relative p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-8 shadow-xl group-hover:rotate-6 transition-transform duration-500`}>
                                    <s.icon className="text-white text-2xl" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase italic tracking-tight">{s.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 italic font-medium">{s.desc}</p>
                                
                                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-orange-500 transition-colors">
                                        <FaCheck className="text-emerald-500" /> Despliegue Inmediato
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-sky-500 transition-colors">
                                        <FaCheck className="text-emerald-500" /> API First Architecture
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Case Study Feature */}
                <section className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-sky-500/20 rounded-[4rem] blur-2xl opacity-50" />
                    <div className="relative grid lg:grid-cols-2 gap-12 items-center bg-white dark:bg-[#0f172a] rounded-[3.5rem] p-8 md:p-20 border border-slate-200 dark:border-white/5 shadow-2xl overflow-hidden">
                        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,#f9731610,transparent)]" />
                        
                        <div>
                            <span className="text-orange-500 font-black tracking-[0.3em] uppercase text-xs">Partner Spotlight</span>
                            <h2 className="text-5xl font-black text-slate-900 dark:text-white mt-4 mb-8 leading-[0.9] italic uppercase tracking-tighter">
                                Quito <br /><span className="text-sky-500">Business</span> Center
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 italic leading-relaxed">
                                "InmoCore no solo es una herramienta, es el sistema operativo de nuestra inmobiliaria. Logramos reducir el tiempo de cierre de 45 a 12 días."
                            </p>
                            
                            <div className="flex gap-10">
                                <div>
                                    <div className="text-4xl font-black text-slate-900 dark:text-white uppercase italic italic tracking-tighter">85%</div>
                                    <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest mt-1">Ventas rápidas</div>
                                </div>
                                <div className="w-px h-12 bg-slate-200 dark:bg-slate-800" />
                                <div>
                                    <div className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">+50K</div>
                                    <div className="text-[10px] font-black text-sky-500 uppercase tracking-widest mt-1">Alcance mensual</div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-square rounded-[3rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                                <FaBuilding className="text-[12rem] text-slate-200 dark:text-slate-700/50" />
                                <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent" />
                                <div className="absolute bottom-10 left-10 right-10 p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                                    <p className="text-xs font-black uppercase text-white tracking-widest">Proyecto Destacado</p>
                                    <p className="text-lg font-bold text-white italic">Elite Corporate Plaza</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* High-Impact CTA */}
                <section className="relative py-24 px-12 rounded-[4rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-center overflow-hidden shadow-3xl">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                    <div className="relative z-10">
                        <FaRocket className="text-orange-500 text-6xl mx-auto mb-10 animate-bounce" />
                        <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-8 leading-none">
                            ¿Listo para el <br /> <span className="text-orange-500">Siguiente Nivel?</span>
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
                            <button className="group px-12 py-6 bg-orange-500 text-slate-900 font-black uppercase italic tracking-widest rounded-3xl hover:bg-white hover:text-orange-500 transition-all duration-300 shadow-2xl shadow-orange-500/40">
                                Iniciar despliegue <FaArrowRight className="inline ml-2 group-hover:translate-x-2 transition-transform" />
                            </button>
                            <button className="px-12 py-6 border-2 border-white/20 dark:border-slate-900/20 font-black uppercase italic tracking-widest rounded-3xl hover:bg-white/10 dark:hover:bg-slate-900/5 transition-all">
                                Hablar con un experto
                            </button>
                        </div>
                    </div>
                </section>

            </main>

            <footer className="py-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#020617] transition-colors">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center font-black italic text-white text-xl shadow-lg">I</div>
                        <span className="text-xl font-black italic uppercase tracking-tighter dark:text-white">InmoCore <span className="text-orange-500">2026</span></span>
                    </div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] italic">
                        Innovación Disruptiva en Real Estate
                    </p>
                </div>
            </footer>
        </div>
    );
}
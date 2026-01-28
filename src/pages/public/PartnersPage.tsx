import { useState } from "react";
import { FaUsers, FaBullseye, FaStar, FaBolt, FaArrowRight, FaLinkedin, FaInstagram, FaGithub, FaQuoteLeft } from "react-icons/fa";

// Datos actualizados con links individuales
const sociosFundadores = [
  {
    name: "Andres Zambrano",
    role: "CEO & Co-fundador",
    image: "/andres.jpg", // Aquí irían tus fotos reales
    bio: "Especialista en estrategia de negocios y expansión inmobiliaria con más de 10 años en el sector.",
    specialty: "Estrategia",
    level: 95,
    color: "from-orange-500 to-red-500",
    socials: { 
      linkedin: "https://www.linkedin.com/in/4ndresz?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app", 
      instagram: "https://www.instagram.com/4ndreesz?igsh=anVsZXZncHAxZW95&utm_source=qr", 
      github: "https://github.com/andreeesz17" }
  },
  {
    name: "Alexander Guamán",
    role: "CTO & Co-fundador",
    image: "/alexander.jpg",
    bio: "Arquitecto de software enfocado en soluciones cloud y automatización para el mercado Real Estate.",
    specialty: "Tecnología",
    level: 98,
    color: "from-cyan-500 to-blue-600",
    socials: { 
      linkedin: "#", 
      instagram: "https://www.instagram.com/life_4lex?igsh=MWdzdnQ5bDFoajY2aQ==", 
      github: "https://github.com/Axel-25-dg" }
  },
  {
    name: "Alex Macías",
    role: "CMO & Co-fundador",
    image: "/alex.jpg",
    bio: "Experto en marketing digital y crecimiento exponencial de marcas inmobiliarias de lujo.",
    specialty: "Marketing",
    level: 90,
    color: "from-purple-500 to-pink-500",
    socials: { 
      linkedin: "https://www.linkedin.com/in/alex-macias-710312253?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app", 
      instagram: "https://www.instagram.com/macixxker?igsh=MTN5dmQ1ejlmNW9mcg%3D%3D&utm_source=qr", 
      github: "https://github.com/AlexMa77" }
  },
];

const valores = [
  { title: "Integridad", desc: "Transparencia total en cada contrato.", icon: FaBullseye, color: "text-orange-500", bg: "bg-orange-500/10" },
  { title: "Innovación", desc: "IA aplicada al mercado inmobiliario.", icon: FaBolt, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { title: "Excelencia", desc: "Resultados que superan la expectativa.", icon: FaStar, color: "text-purple-500", bg: "bg-purple-500/10" },
];

function SocioCard({ socio }: { socio: (typeof sociosFundadores)[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow Effect dinámico */}
      <div className={`absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r ${socio.color} opacity-0 blur-2xl transition duration-500 group-hover:opacity-20`} />

      <div className="relative h-full overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xl transition-all duration-500 group-hover:-translate-y-3">

        {/* Banner Superior */}
        <div className={`h-32 w-full bg-gradient-to-r ${socio.color} opacity-80`} />

        {/* Avatar Section */}
        <div className="relative -mt-16 flex justify-center">
          <div className="relative h-32 w-32">
            <div className={`absolute inset-0 animate-spin-slow rounded-full bg-gradient-to-tr ${socio.color} p-1`}>
              <div className="h-full w-full rounded-full bg-white dark:bg-slate-900" />
            </div>
            <div className="absolute inset-1 overflow-hidden rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800">
              <FaUsers className="m-auto mt-6 h-12 w-12 text-slate-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>

        <div className="p-8 text-center">
          <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg bg-gradient-to-r ${socio.color}`}>
            {socio.specialty}
          </span>

          <h3 className="mt-4 text-2xl font-black text-slate-900 dark:text-white uppercase italic">{socio.name}</h3>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{socio.role}</p>

          <div className="relative mt-6 italic">
            <FaQuoteLeft className="absolute -left-2 -top-2 h-4 w-4 text-slate-200 dark:text-slate-700" />
            <p className="px-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
              "{socio.bio}"
            </p>
          </div>

          {/* Social Links Individuales */}
          <div className="mt-8 flex justify-center gap-4">
            <a href={socio.socials.linkedin} className="group/link flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 transition-all hover:bg-blue-600 hover:text-white">
              <FaLinkedin className="h-5 w-5" />
            </a>
            <a href={socio.socials.instagram} className="group/link flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 transition-all hover:bg-pink-600 hover:text-white">
              <FaInstagram className="h-5 w-5" />
            </a>
            <a href={socio.socials.github} className="group/link flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 transition-all hover:bg-slate-900 dark:hover:bg-white dark:hover:text-black hover:text-white">
              <FaGithub className="h-5 w-5" />
            </a>
          </div>

          {/* Skill bar mejorada */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-slate-400 mb-2">
              <span>Expertise Score</span>
              <span className="text-slate-900 dark:text-white">{socio.level}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full bg-gradient-to-r ${socio.color} transition-all duration-1000`}
                style={{ width: isHovered ? `${socio.level}%` : '5%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] transition-colors duration-500">

      {/* Hero Refinado */}
      <section className="relative overflow-hidden pt-24 pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-orange-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-cyan-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-2xl bg-white/80 p-2 pr-6 shadow-xl backdrop-blur-md dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
            <span className="rounded-xl bg-orange-500 px-3 py-1 text-xs font-black text-white italic">HOT</span>
            <span className="text-xs font-bold tracking-tight text-slate-600 dark:text-slate-300">Conoce al equipo InmoCore</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
            LOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-purple-600">FUNDADORES</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg font-medium text-slate-500 dark:text-slate-400">
            Unimos visión de negocio, potencia tecnológica y marketing agresivo para dominar el sector inmobiliario.
          </p>
        </div>
      </section>

      {/* Grid de Socios */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {sociosFundadores.map((socio, index) => (
            <SocioCard key={socio.name} socio={socio} index={index} />
          ))}
        </div>
      </section>

      {/* Valores con Diseño de "Capsulas" */}
      <section className="mx-auto max-w-7xl px-6 py-32">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {valores.map((val) => (
            <div key={val.title} className="group relative overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 transition-all hover:border-orange-500/30">
              <val.icon className={`h-12 w-12 ${val.color} mb-6 transition-transform group-hover:scale-110 group-hover:rotate-12`} />
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-wider">{val.title}</h3>
              <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final Brutalista */}
      <section className="mx-auto max-w-7xl px-6 pb-32">
        <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 dark:bg-white p-12 md:p-24 text-center">
          <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-orange-500/20 to-transparent" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-6xl font-black text-white dark:text-slate-900 uppercase italic leading-none">
              ¿Listo para el <br /> <span className="text-orange-500">siguiente nivel?</span>
            </h2>
            <div className="mt-12 flex flex-wrap justify-center gap-6">
              <button className="flex items-center gap-4 rounded-2xl bg-orange-500 px-10 py-5 font-black uppercase italic text-white shadow-[0_10px_40px_rgba(249,115,22,0.4)] transition-all hover:scale-105 hover:bg-orange-600">
                Agendar Llamada <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

interface NavLinkRenderProps {
  isActive: boolean;
}

// Estilos base ultra-refinados
const linkBase =
  "relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50";

const navLinkStyles = ({ isActive }: NavLinkRenderProps): string =>
  `${linkBase} ${
    isActive 
      ? "text-orange-600 dark:text-orange-400 bg-orange-500/10 dark:bg-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]" 
      : "text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-300 hover:bg-slate-100 dark:hover:bg-white/5"
  }`;

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-slate-800/50 dark:bg-[#0b1120]/80">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          
          {/* Brand - Logo con Glow sutil */}
          <Link to="/" className="group flex items-center gap-3 flex-shrink-0" onClick={() => setMobileMenuOpen(false)}>
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-orange-500 to-sky-500 opacity-20 blur-sm transition group-hover:opacity-40" />
              <img 
                src="/images/logo1.png" 
                alt="Logo" 
                className="relative h-9 w-9 rounded-xl object-cover"
              />
            </div>
            <span className="text-xl font-extrabold tracking-tighter text-slate-900 dark:text-white uppercase">
              Inmo<span className="text-orange-500">Core</span>
            </span>
          </Link>

          {/* Nav - Desktop */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Navegación principal">
            <NavLink to="/services" className={navLinkStyles}>Servicios</NavLink>
            <NavLink to="/docs" className={navLinkStyles}>Docs</NavLink>
            <NavLink to="/partners" className={navLinkStyles}>Socios</NavLink>
            <NavLink to="/security" className={navLinkStyles}>Seguridad</NavLink>
          </nav>

          {/* Acciones - Desktop */}
          <div className="hidden items-center gap-4 md:flex">
            <NavLink
              to="/login"
              className={({ isActive }: NavLinkRenderProps) =>
                `${linkBase} ${isActive ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`
              }
            >
              Acceso
            </NavLink>

            <NavLink
              to="/register"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-0.5 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-md shadow-orange-500/20"
            >
              <span className="absolute inset-0 bg-gradient-to-br from-orange-500 to-sky-600"></span>
              <span className="relative rounded-full bg-transparent px-5 py-2 transition-all duration-200 group-hover:bg-transparent">
                Registrarse
              </span>
            </NavLink>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <ThemeToggle />
          </div>

          {/* Botón Mobile con Animación */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
            >
              <div className="relative h-6 w-6">
                 <span className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 ${mobileMenuOpen ? 'top-3 rotate-45' : 'top-1'}`} />
                 <span className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 top-3 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                 <span className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 ${mobileMenuOpen ? 'top-3 -rotate-45' : 'top-5'}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Menú Mobile Desplegable */}
      {mobileMenuOpen && (
        <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 md:hidden">
          <div className="flex flex-col gap-2">
            <NavLink to="/services" onClick={() => setMobileMenuOpen(false)} className={navLinkStyles}>Servicios</NavLink>
            <NavLink to="/docs" onClick={() => setMobileMenuOpen(false)} className={navLinkStyles}>Documentación</NavLink>
            <NavLink to="/partners" onClick={() => setMobileMenuOpen(false)} className={navLinkStyles}>Socios</NavLink>
            <NavLink to="/security" onClick={() => setMobileMenuOpen(false)} className={navLinkStyles}>Seguridad</NavLink>
            <div className="my-2 h-px bg-slate-100 dark:bg-slate-800" />
            <NavLink to="/login" onClick={() => setMobileMenuOpen(false)} className={navLinkStyles}>Acceso</NavLink>
            <NavLink to="/register" onClick={() => setMobileMenuOpen(false)} className="mt-2 flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-sky-600 font-bold text-white shadow-lg shadow-orange-500/25">
              Registrarse ahora
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
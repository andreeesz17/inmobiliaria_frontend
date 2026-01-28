import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative w-full border-t border-slate-800 bg-[#0f172a] pt-16 pb-8">
      {/* Decoración de fondo sutil */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 md:grid-cols-2">
          
          {/* Columna 1: Brand & Bio */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <img 
                src="/images/logo1.png" 
                alt="Logo" 
                className="relative h-9 w-9 rounded-xl object-cover"
              />
              <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">
                INMO<span className="text-orange-500">CORE</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Transformando la búsqueda de propiedades con tecnología de vanguardia y filtros inteligentes. Encuentra tu lugar ideal hoy.
            </p>
            <div className="flex gap-4">
              {[FaFacebook, FaInstagram, FaTwitter, FaLinkedin].map((Icon, idx) => (
                <a key={idx} href="#" className="p-2 rounded-lg bg-slate-100 text-slate-600 transition-all hover:bg-orange-500 hover:text-white dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-orange-600">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2: Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-6">Navegación</h3>
            <ul className="space-y-4">
              {['Venta', 'Alquiler', 'Proyectos', 'Servicios', 'Dashboard'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-slate-500 transition hover:text-orange-500 dark:text-slate-400">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Contact Info */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-6">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
                <FaMapMarkerAlt className="mt-1 text-orange-500" />
                <span>Av. Quitumbe Ñan<br />Quito, Ecuador</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <FaPhone className="text-orange-500" />
                <span>+593 98 765 4321</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <FaEnvelope className="text-orange-500" />
                <span>inmobiliariaproyect83@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Columna 4: Newsletter */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-6">Newsletter</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Suscríbete para recibir nuevas propiedades cada semana.
            </p>
            <form className="flex flex-col gap-2">
              <input 
                type="email" 
                placeholder="tu@email.com" 
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-orange-500 dark:border-slate-800 dark:bg-slate-900"
              />
              <button className="w-full rounded-xl bg-orange-500 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all">
                Suscribirme
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-slate-100 pt-8 dark:border-slate-900">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <p className="text-xs text-slate-500 dark:text-slate-500 text-center">
              © 2026 InmoCore Real Estate. Todos los derechos reservados.
            </p>
            <div className="flex gap-8">
              <a href="#" className="text-xs text-slate-500 hover:text-orange-500 transition-colors">Privacidad</a>
              <a href="#" className="text-xs text-slate-500 hover:text-orange-500 transition-colors">Términos</a>
              <a href="#" className="text-xs text-slate-500 hover:text-orange-500 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
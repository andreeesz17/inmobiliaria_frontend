import { FaMapMarkerAlt, FaCity, FaBuilding, FaArrowRight, FaHeadset } from "react-icons/fa";
import type { IconType } from "react-icons"; // Importación de tipo obligatoria aquí

export default function SucursalesSection() {
  // Definimos la interfaz
  interface Sucursal {
    title: string;
    description: string;
    location: string;
    type: string;
    Icon: IconType;
    imageClass: string;
  }

  const sucursales: Sucursal[] = [
    {
      title: "Sucursal Matrix - Quito",
      description: "Centro de operaciones principal. Gestión de activos de alta plusvalía y administración central del sistema.",
      location: "Pichincha",
      type: "Corporativa",
      Icon: FaCity,
      imageClass: "from-orange-500/20 via-orange-500/5 to-transparent"
    },
    {
      title: "Sucursal Costa - Guayaquil",
      description: "Especializada en logística inmobiliaria portuaria y gestión de contratos comerciales de alto impacto.",
      location: "Guayas",
      type: "Comercial",
      Icon: FaBuilding,
      imageClass: "from-sky-500/20 via-sky-500/5 to-transparent"
    },
    {
      title: "Sucursal Austral - Cuenca",
      description: "Punto de atención boutique. Enfoque en propiedades residenciales premium y soporte al cliente personalizado.",
      location: "Azuay",
      type: "Residencial",
      Icon: FaHeadset,
      imageClass: "from-emerald-500/20 via-emerald-500/5 to-transparent"
    }
  ];

  return (
    <section className="py-32 bg-white dark:bg-[#020617] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-24">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 dark:text-orange-400 mb-4 bg-orange-500/5 inline-block px-4 py-1 rounded-full border border-orange-500/10">
            Network Global
          </h2>
          <p className="mt-2 text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic leading-none">
            Nuestras <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-sky-500">
              Sucursales
            </span>
          </p>
          <div className="mt-8 flex justify-center">
            <div className="h-1.5 w-24 bg-slate-900 dark:bg-white rounded-full" />
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-10 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {sucursales.map((office, index) => {
            const IconComponent = office.Icon; // Referencia local para evitar problemas de renderizado
            return (
              <article 
                key={index}
                className="group relative flex flex-col rounded-[3rem] border border-slate-200 bg-white p-3 transition-all duration-500 hover:border-orange-500/30 hover:shadow-[0_30px_60px_-15px_rgba(249,115,22,0.1)] dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-orange-400/30"
              >
                <div className="relative h-56 w-full overflow-hidden rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/50">
                  <div className={`absolute inset-0 bg-gradient-to-br ${office.imageClass} opacity-100`} />
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:scale-125 group-hover:opacity-20 transition-all duration-700">
                    <IconComponent size={100} />
                  </div>

                  <div className="absolute bottom-6 left-6">
                    <span className="backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border border-white/20 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white shadow-xl">
                      {office.type}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col flex-grow p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 transition-transform group-hover:rotate-6 shadow-lg">
                      <IconComponent size={16} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">
                      {office.title}
                    </h3>
                  </div>

                  <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 flex-grow font-medium italic mb-8">
                    "{office.description}"
                  </p>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-orange-500" size={14} />
                      <span className="text-xs font-black uppercase tracking-tighter text-slate-700 dark:text-slate-300">
                        {office.location}
                      </span>
                    </div>
                    <button className="p-3 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                      <FaArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
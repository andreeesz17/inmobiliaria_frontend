export default function ServicesSection() {
  const services = [
    {
      title: "Publicación de propiedades",
      description: "Crea fichas completas, fotos, ubicación y estado en segundos.",
      icon: (
        <svg className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5L12 3l9 7.5V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V10.5z" />
        </svg>
      )
    },
    {
      title: "Gestión y reportes",
      description: "Control de visitas, clientes y métricas claras por agente.",
      icon: (
        <svg className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8M8 11h8M8 15h5M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
        </svg>
      )
    },
    {
      title: "Seguridad",
      description: "Roles, permisos y acceso controlado para cada usuario.",
      icon: (
        <svg className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 4v6c0 5-3 8-7 9-4-1-7-4-7-9V7l7-4z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-orange-600 dark:text-orange-400">Servicios</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl break-words">
            Todo lo que necesitas para gestionar inmuebles.
          </p>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400 break-words">
            Publicación, control, seguimiento y seguridad, con una interfaz limpia.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group flex flex-col rounded-3xl border border-slate-200 bg-slate-50 p-8 transition hover:border-orange-500/60 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-orange-400/60"
            >
              <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-cyan-500/10 text-orange-600 dark:bg-cyan-500/20 dark:text-orange-400 flex-shrink-0">
                {service.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white break-words">{service.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400 flex-grow break-words">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
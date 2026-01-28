import { Link } from "react-router-dom";

type Props = {
  property: any;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
};

export default function PropertyCard({
  property,
  isFavorite = false,
  onToggleFavorite,
}: Props) {
  const id = Number(property.id ?? property._id);

  return (
    <div className="group flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-cyan-500/50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-cyan-400/50">
      {/* Card media placeholder - flexible height */}
      <div className="relative min-h-[144px] flex-shrink-0 border-b border-slate-200 bg-gradient-to-br from-cyan-500/10 via-white to-emerald-500/10 dark:border-slate-700 dark:from-cyan-900/20 dark:via-slate-800 dark:to-emerald-900/20">
        <button
          type="button"
          onClick={() => onToggleFavorite?.(id)}
          className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-cyan-600 shadow-sm border border-cyan-500/30 hover:bg-cyan-500/10 transition-colors dark:bg-slate-800/90 dark:text-cyan-400 dark:border-cyan-400/30"
          aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          {isFavorite ? "★" : "☆"}
        </button>
      </div>
      
      {/* Content section with flexible layout */}
      <div className="flex flex-col flex-grow p-5 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h2 className="font-semibold text-lg text-slate-900 dark:text-white flex-grow min-w-0">
            <span className="break-words">{property.title ?? "Propiedad"}</span>
          </h2>
          <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-600 border border-cyan-500/20 whitespace-nowrap dark:text-cyan-400 dark:border-cyan-400/30 dark:bg-cyan-500/20">
            Oferta
          </span>
        </div>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 break-words min-h-[1.25rem]">
          {property.address ?? "Sin dirección"}
        </p>

        <div className="flex items-center justify-between mt-auto pt-2">
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            ${property.price ?? "0"}
          </p>
          <Link
            to={`/dashboard/property/${id}`}
            className="text-sm font-semibold text-cyan-600 group-hover:text-cyan-700 transition-colors dark:text-cyan-400 dark:group-hover:text-cyan-300 whitespace-nowrap"
          >
            Ver detalle →
          </Link>
        </div>
      </div>
    </div>
  );
}

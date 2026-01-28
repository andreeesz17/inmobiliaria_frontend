import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaHeart,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaBed,
  FaBath,
  FaExpand,
  FaArrowRight,
  FaBuilding,
} from "react-icons/fa";
import ServicesSection from "../../components/ServicesSection";
import ProjectsSection from "../../components/ProjectsSection";

interface HomeProperty {
  id: number;
  title: string;
  address: string;
  price: number;
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  featured?: boolean;
}

const mockProperties: HomeProperty[] = [
  {
    id: 1,
    title: "Departamento Moderno Centro",
    address: "Av. Amazonas y Naciones Unidas",
    price: 185000,
    type: "Venta",
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    featured: true
  },
  {
    id: 2,
    title: "Casa Familiar Las Terrazas",
    address: "Sector Las Terrazas, Quito",
    price: 275000,
    type: "Venta",
    bedrooms: 4,
    bathrooms: 3,
    area: 200
  },
  {
    id: 3,
    title: "Oficina Ejecutiva Piso 15",
    address: "Av. República, Edificio Premium",
    price: 3500,
    type: "Alquiler",
    bedrooms: 2,
    bathrooms: 2,
    area: 85
  }
];

function HomePropertyCard({
  property,
  isFavorite,
  onToggleFavorite,
}: {
  property: HomeProperty;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}) {
  return (
    <div className="group relative flex flex-col rounded-3xl bg-white border border-slate-200 transition-all duration-300 hover:shadow-xl dark:bg-slate-900 dark:border-slate-800">
      {/* Image Wrapper */}
      <div className="relative h-64 overflow-hidden rounded-t-3xl">
        <img
          src="/images/casa_home.png"
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {property.featured && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500 text-black text-[10px] font-bold uppercase tracking-wider">
              <FaStar className="w-2.5 h-2.5" /> Destacado
            </span>
          )}
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white ${property.type === "Venta" ? "bg-sky-500" : "bg-sky-500"
            }`}>
            {property.type}
          </span>
        </div>

        <button
          onClick={() => onToggleFavorite(property.id)}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all ${isFavorite ? "bg-orange-500 text-white" : "bg-white/20 text-white hover:bg-white/40"
            }`}
        >
          <FaHeart className={isFavorite ? "fill-current" : ""} />
        </button>

        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-2xl font-bold">
            ${property.price.toLocaleString()}
            {property.type === "Alquiler" && <span className="text-sm font-normal">/mes</span>}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white line-clamp-1 mb-1">
          {property.title}
        </h3>
        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm mb-4">
          <FaMapMarkerAlt className="text-orange-500" />
          <span className="truncate">{property.address}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex flex-col items-center">
            <FaBed className="text-slate-400 mb-1" />
            <span className="text-xs font-semibold">{property.bedrooms || 2} Hab</span>
          </div>
          <div className="flex flex-col items-center">
            <FaBath className="text-slate-400 mb-1" />
            <span className="text-xs font-semibold">{property.bathrooms || 1} Baños</span>
          </div>
          <div className="flex flex-col items-center">
            <FaExpand className="text-slate-400 mb-1" />
            <span className="text-xs font-semibold">{property.area || 80} m²</span>
          </div>
        </div>

        <Link
          to={`/property/${property.id}`}
          className="mt-auto w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-orange-500 hover:text-white transition-colors group/btn"
        >
          Ver Propiedad
          <FaArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [loading] = useState(false);

  // Filter logic
  const filtered = useMemo(() => {
    return mockProperties.filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = locationFilter === "" || property.address.toLowerCase().includes(locationFilter.toLowerCase());
      const matchesCategory = categoryFilter === "" || property.type === categoryFilter;
      return matchesSearch && matchesLocation && matchesCategory;
    });
  }, [searchTerm, locationFilter, categoryFilter]);

  // Pagination
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paged = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Metrics
  const total = mockProperties.length;
  const totalFiltered = filtered.length;
  const avgPrice = filtered.length > 0
    ? filtered.reduce((sum, p) => sum + p.price, 0) / filtered.length
    : 0;

  const handleToggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setLocationFilter("");
    setCategoryFilter("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">

      {/* Hero Section Refactorizado */}
      <section className="relative pt-20 pb-32 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-br from-orange-500/20 to-sky-500/10 blur-[120px] rounded-full" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-bold tracking-widest text-slate-600 dark:text-slate-300 uppercase">Explora propiedades exclusivas</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight">
            Tu hogar ideal, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-sky-500">sin complicaciones.</span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Filtra por zona, precio y tipo. Una experiencia diseñada para que encuentres tu próximo espacio en tiempo récord.
          </p>

          {/* Floating Search Bar */}
          <div className="max-w-4xl mx-auto mt-12 p-3 rounded-[2rem] bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-2">
            <div className="relative flex items-center px-4 py-2 border-r border-slate-100 dark:border-slate-800">
              <FaSearch className="text-orange-500 mr-3" />
              <input
                type="text"
                placeholder="¿Qué buscas?"
                className="bg-transparent border-none outline-none w-full text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative flex items-center px-4 py-2 border-r border-slate-100 dark:border-slate-800">
              <FaMapMarkerAlt className="text-orange-500 mr-3" />
              <input
                type="text"
                placeholder="Ubicación"
                className="bg-transparent border-none outline-none w-full text-sm"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
            <div className="relative flex items-center px-4 py-2 border-r border-slate-100 dark:border-slate-800">
              <FaBuilding className="text-orange-500 mr-3" />
              <select
                className="bg-transparent border-none outline-none w-full text-sm appearance-none"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">Tipo: Todos</option>
                <option value="Venta">Venta</option>
                <option value="Alquiler">Alquiler</option>
              </select>
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-lg shadow-orange-500/25">
              Buscar Ahora
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-20 space-y-24">

        {/* Malla de Propiedades */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Propiedades Destacadas</h2>
              <p className="text-slate-500 mt-1">Mostrando {totalFiltered} de {total} resultados</p>
            </div>
            <div className="flex gap-2">
              {/* Chips de filtros rápidos opcionales */}
              {["Venta", "Alquiler"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${categoryFilter === cat ? "bg-orange-500 border-orange-500 text-white shadow-md" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="h-96 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-3xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-300">
              <p className="text-xl font-bold">No encontramos coincidencias</p>
              <button onClick={clearFilters} className="text-orange-500 underline mt-2">Limpiar filtros</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paged.map((p) => (
                <HomePropertyCard
                  key={p.id}
                  property={p}
                  isFavorite={favorites.includes(p.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <FaChevronLeft />
            </button>
            <span className="font-bold text-sm">Página {page} de {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <FaChevronRight />
            </button>
          </div>
        </section>

        {/* Dashboard de Métricas (Más elegante y menos intrusivo) */}
        <section className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 blur-[100px]" />
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-black text-sky-400">{total}</p>
              <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-bold">Propiedades</p>
            </div>
            <div>
              <p className="text-4xl font-black text-sky-400">{favorites.length}</p>
              <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-bold">Mis Favoritos</p>
            </div>
            <div>
              <p className="text-4xl font-black text-cyan-400">{avgPrice ? `$${(avgPrice / 1000).toFixed(1)}k` : "—"}</p>
              <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-bold">Precio Prom.</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Link to="/dashboard/properties" className="px-6 py-2 bg-white text-slate-900 rounded-xl font-bold text-xs hover:bg-cyan-400 transition-colors">
                DASHBOARD
              </Link>
            </div>
          </div>
        </section>

        <ServicesSection />
        <ProjectsSection />
      </div>
    </div>
  );
}
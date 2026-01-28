import { useState, useEffect } from "react";
import type { Property } from "../types/property.types";
import { Search, SlidersHorizontal, X, DollarSign, Bed, Bath } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";

interface PropertyFilters {
  searchTerm: string;
  minPrice: number | null;
  maxPrice: number | null;
  propertyType: string;
  bedrooms: number | null;
  bathrooms: number | null;
}

interface PropertySearchProps {
  properties: Property[];
  onResultsChange: (filteredProperties: Property[]) => void;
  placeholder?: string;
  showFilters?: boolean;
}

export function PropertySearch({
  properties,
  onResultsChange,
  placeholder = "Buscar propiedades...",
  showFilters = true
}: PropertySearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<PropertyFilters>({
    searchTerm: "",
    minPrice: null,
    maxPrice: null,
    propertyType: "",
    bedrooms: null,
    bathrooms: null
  });
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Apply filters whenever they change
  useEffect(() => {
    const filtered = properties.filter(property => {
      // Text search
      if (searchTerm && !property.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !property.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !property.address.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Price filters
      if (filters.minPrice !== null && property.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== null && property.price > filters.maxPrice) {
        return false;
      }

      // Property type
      if (filters.propertyType && property.type !== filters.propertyType) {
        return false;
      }

      return true;
    });

    onResultsChange(filtered);
  }, [properties, searchTerm, filters, onResultsChange]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, searchTerm }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      searchTerm: "",
      minPrice: null,
      maxPrice: null,
      propertyType: "",
      bedrooms: null,
      bathrooms: null
    });
  };

  const hasActiveFilters = filters.minPrice !== null || 
                          filters.maxPrice !== null || 
                          filters.propertyType !== "";

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Filters Toggle */}
      {showFilters && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            icon={showFilterPanel ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
            iconPosition="left"
          >
            {showFilterPanel ? "Cerrar Filtros" : "Filtros"}
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                Activo
              </span>
            )}
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              icon={<X className="h-4 w-4" />}
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      )}

      {/* Filter Panel */}
      {showFilterPanel && showFilters && (
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Rango de Precio</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    placeholder="Mínimo"
                    value={filters.minPrice || ""}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      minPrice: e.target.value ? Number(e.target.value) : null 
                    }))}
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="relative flex-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    placeholder="Máximo"
                    value={filters.maxPrice || ""}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      maxPrice: e.target.value ? Number(e.target.value) : null 
                    }))}
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>

            {/* Property Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tipo de Propiedad</label>
              <select
                value={filters.propertyType}
                onChange={(e) => setFilters(prev => ({ ...prev, propertyType: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Todos los tipos</option>
                <option value="casa">Casa</option>
                <option value="departamento">Departamento</option>
                <option value="terreno">Terreno</option>
                <option value="local">Local comercial</option>
              </select>
            </div>

            {/* Bedrooms */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Dormitorios</label>
              <div className="relative">
                <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  value={filters.bedrooms || ""}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    bedrooms: e.target.value ? Number(e.target.value) : null 
                  }))}
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Cualquier cantidad</option>
                  <option value="1">1 dormitorio</option>
                  <option value="2">2 dormitorios</option>
                  <option value="3">3 dormitorios</option>
                  <option value="4">4+ dormitorios</option>
                </select>
              </div>
            </div>

            {/* Bathrooms */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Baños</label>
              <div className="relative">
                <Bath className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  value={filters.bathrooms || ""}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    bathrooms: e.target.value ? Number(e.target.value) : null 
                  }))}
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Cualquier cantidad</option>
                  <option value="1">1 baño</option>
                  <option value="2">2 baños</option>
                  <option value="3">3+ baños</option>
                </select>
              </div>
            </div>
          </div>

          {/* Apply Filters Button */}
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowFilterPanel(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowFilterPanel(false)}>
              Aplicar Filtros
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

// Hook for search and filter state management
export function usePropertySearch(initialProperties: Property[] = []) {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(initialProperties);
  const [isLoading, setIsLoading] = useState(false);

  const updateProperties = (newProperties: Property[]) => {
    setProperties(newProperties);
    setFilteredProperties(newProperties);
  };

  const searchAndFilter = (_filters: Partial<PropertyFilters>) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const filtered = properties.filter(_property => {
        // Implement your filtering logic here
        return true; // Placeholder
      });
      
      setFilteredProperties(filtered);
      setIsLoading(false);
    }, 300);
  };

  return {
    properties,
    filteredProperties,
    isLoading,
    updateProperties,
    searchAndFilter
  };
}
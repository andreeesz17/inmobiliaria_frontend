import { useEffect, useState } from "react";
import { getProperties } from "../../api/properties.api";
import type { Property } from "../../types/property.types";
import { Button } from "../../components/Button";
import { Skeleton } from "../../components/Skeleton";
import PropertyCard from "../../components/PropertyCard";
import { Heart } from "lucide-react";
import { getFavorites, toggleFavorite } from "../../utils/favorites";

export default function FavoritesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        
        // Load favorites from localStorage
        const savedFavorites = getFavorites();
        setFavorites(savedFavorites);
        
        if (savedFavorites.length === 0) {
          setProperties([]);
          return;
        }
        
        // Load all properties to find the favorited ones
        const propsResponse = await getProperties({ page: 1, limit: 1000 });
        const allProperties = Array.isArray(propsResponse) ? propsResponse : propsResponse.data || [];
        
        // Filter only favorited properties
        const favoriteProperties = allProperties.filter(prop => 
          savedFavorites.includes(prop.id)
        );
        
        setProperties(favoriteProperties);
        
      } catch (error) {
        console.error("Error loading favorites:", error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const handleFavoriteToggle = (propertyId: number) => {
    const newFavorites = toggleFavorite(propertyId);
    setFavorites(newFavorites);
    
    // Update the properties list
    setProperties(prev => prev.filter(prop => newFavorites.includes(prop.id)));
  };

  const filteredProperties = properties.filter(property => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesTitle = property.title?.toLowerCase().includes(term);
      const matchesDescription = property.description?.toLowerCase().includes(term);
      const matchesAddress = property.address?.toLowerCase().includes(term);
      
      return matchesTitle || matchesDescription || matchesAddress;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="h-8 w-8 text-red-500" />
          <h1 className="text-3xl font-bold text-foreground">Mis Propiedades Favoritas</h1>
        </div>
        <p className="text-muted-foreground">
          Tus propiedades guardadas para consulta rápida
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Buscar en favoritos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-muted-foreground">
          Mostrando {filteredProperties.length} de {favorites.length} favoritos
        </p>
        {searchTerm && (
          <Button
            variant="outline"
            onClick={() => setSearchTerm('')}
          >
            Limpiar búsqueda
          </Button>
        )}
      </div>

      {/* Properties Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isFavorite={true}
              onToggleFavorite={handleFavoriteToggle}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
            <Heart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {favorites.length === 0 
              ? 'Aún no tienes favoritos' 
              : 'No se encontraron favoritos'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {favorites.length === 0
              ? 'Agrega propiedades a tus favoritos para verlas aquí'
              : searchTerm
                ? 'Intenta con otros términos de búsqueda'
                : 'Todas tus propiedades favoritas aparecerán aquí'}
          </p>
          {favorites.length === 0 && (
            <a href="/properties">
              <Button>
                Explorar propiedades
              </Button>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
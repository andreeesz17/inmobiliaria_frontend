import { useEffect, useState } from "react";
import { getProperties } from "../../api/properties.api";
import type { Property } from "../../types/property.types";
import { Button } from "../../components/Button";
import { Skeleton } from "../../components/Skeleton";
import PropertyCard from "../../components/PropertyCard";
import { Filter } from "lucide-react";
import { getFavorites, toggleFavorite } from "../../utils/favorites";

export default function PublicPropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);

                // Load favorites from localStorage
                const savedFavorites = getFavorites();
                setFavorites(savedFavorites);

                // Load properties
                const props = await getProperties({ page: 1, limit: 1000 });
                setProperties(Array.isArray(props) ? props : props.data || []);

                // Images will be loaded per property as needed

            } catch (error) {
                console.error("Error loading data:", error);
                setProperties([]);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    const handleFavoriteToggle = (propertyId: number) => {
        const newFavorites = toggleFavorite(propertyId);
        setFavorites(newFavorites);
    };

    const filteredProperties = properties.filter(property => {
        // Search term filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const matchesTitle = property.title?.toLowerCase().includes(term);
            const matchesDescription = property.description?.toLowerCase().includes(term);
            const matchesAddress = property.address?.toLowerCase().includes(term);

            if (!matchesTitle && !matchesDescription && !matchesAddress) {
                return false;
            }
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
                <h1 className="text-3xl font-bold text-foreground mb-2 break-words">Propiedades Disponibles</h1>
                <p className="text-muted-foreground break-words">
                    Explora nuestras propiedades disponibles para venta y renta
                </p>
            </div>

            {/* Search and Filters */}
            {/* Simple search */}
            <div className="mb-8">
                <div className="max-w-md w-full">
                    <input
                        type="text"
                        placeholder="Buscar propiedades..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-0"
                    />
                </div>
            </div>

            {/* Results Info */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-muted-foreground break-words">
                    Mostrando {filteredProperties.length} de {properties.length} propiedades
                </p>
                {searchTerm && (
                    <Button
                        variant="outline"
                        onClick={() => setSearchTerm('')}
                        className="whitespace-nowrap"
                    >
                        Limpiar búsqueda
                    </Button>
                )}
            </div>

            {/* Properties Grid */}
            {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.map((property) => (
                        <PropertyCard
                            key={property.id}
                            property={property}
                            isFavorite={favorites.includes(property.id)}
                            onToggleFavorite={handleFavoriteToggle}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                        <Filter className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 break-words">
                        No se encontraron propiedades
                    </h3>
                    <p className="text-muted-foreground mb-6 break-words">
                        {searchTerm
                            ? 'Intenta con otros criterios de búsqueda'
                            : 'No hay propiedades disponibles en este momento'}
                    </p>
                    {searchTerm && (
                        <Button
                            onClick={() => setSearchTerm('')}
                            className="whitespace-nowrap"
                        >
                            Limpiar filtros
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
import { useEffect, useState } from "react";
import { getCategories, getLocations, getPropertyFeatures } from "../../api/catalogs.api";
import { Card } from "../../components/Card";
import { Skeleton } from "../../components/Skeleton";
import { Tag, MapPin, Star } from "lucide-react";

interface CatalogItem {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
}

export default function PublicCatalogsPage() {
  const [categories, setCategories] = useState<CatalogItem[]>([]);
  const [locations, setLocations] = useState<CatalogItem[]>([]);
  const [features, setFeatures] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'categories' | 'locations' | 'features'>('categories');

  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        setLoading(true);
        const [cats, locs, feats] = await Promise.all([
          getCategories(),
          getLocations(),
          getPropertyFeatures()
        ]);

        setCategories(Array.isArray(cats) ? cats : (cats as any)?.items || []);
        setLocations(Array.isArray(locs) ? locs : (locs as any)?.items || []);
        setFeatures(Array.isArray(feats) ? feats : (feats as any)?.items || []);
      } catch (error) {
        console.error("Error loading catalogs:", error);
        setCategories([]);
        setLocations([]);
        setFeatures([]);
      } finally {
        setLoading(false);
      }
    };

    loadCatalogs();
  }, []);

  const getCurrentItems = () => {
    switch (activeTab) {
      case 'categories': return categories;
      case 'locations': return locations;
      case 'features': return features;
      default: return [];
    }
  };

  const getCurrentTitle = () => {
    switch (activeTab) {
      case 'categories': return 'Categorías';
      case 'locations': return 'Ubicaciones';
      case 'features': return 'Características';
      default: return '';
    }
  };

  const getIcon = () => {
    switch (activeTab) {
      case 'categories': return Tag;
      case 'locations': return MapPin;
      case 'features': return Star;
      default: return Tag;
    }
  };

  const stats = {
    categories: categories.length,
    locations: locations.length,
    features: features.length
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-80" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const IconComponent = getIcon();
  const items = getCurrentItems();

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Catálogos del Sistema</h1>
        <p className="text-muted-foreground">
          Explora las categorías, ubicaciones y características disponibles
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card
          hover
          className={activeTab === 'categories' ? 'border-primary ring-2 ring-primary/20' : ''}
          onClick={() => setActiveTab('categories')}
        >
          <div className="p-4 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Categorías</p>
                <p className="text-2xl font-bold text-foreground">{stats.categories}</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Tag className="h-5 w-5" />
              </div>
            </div>
          </div>
        </Card>

        <Card
          hover
          className={activeTab === 'locations' ? 'border-primary ring-2 ring-primary/20' : ''}
          onClick={() => setActiveTab('locations')}
        >
          <div className="p-4 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Ubicaciones</p>
                <p className="text-2xl font-bold text-foreground">{stats.locations}</p>
              </div>
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-500">
                <MapPin className="h-5 w-5" />
              </div>
            </div>
          </div>
        </Card>

        <Card
          hover
          className={activeTab === 'features' ? 'border-primary ring-2 ring-primary/20' : ''}
          onClick={() => setActiveTab('features')}
        >
          <div className="p-4 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Características</p>
                <p className="text-2xl font-bold text-foreground">{stats.features}</p>
              </div>
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                <Star className="h-5 w-5" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <IconComponent className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">{getCurrentTitle()}</h2>
            </div>
            <p className="text-muted-foreground">
              {items.length} elemento{items.length !== 1 ? 's' : ''} disponible{items.length !== 1 ? 's' : ''}
            </p>
          </div>

          {items.length > 0 ? (
            <div className="grid gap-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-foreground truncate">{item.name}</h3>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1 truncate">{item.description}</p>
                      )}
                      {item.createdAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Creado: {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <IconComponent className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No hay {getCurrentTitle().toLowerCase()} disponibles
              </h3>
              <p className="text-muted-foreground">
                Las {getCurrentTitle().toLowerCase()} aparecerán aquí una vez creadas
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
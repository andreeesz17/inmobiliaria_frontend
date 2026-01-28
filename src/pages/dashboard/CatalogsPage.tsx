import { useEffect, useState, useMemo } from "react";
import {
  getCategories,
  getLocations,
  getPropertyFeatures,
  createCategory,
  createLocation,
  createPropertyFeature,
  updateCategory,
  updateLocation,
  updatePropertyFeature,
  deleteCategory,
  deleteLocation,
  deletePropertyFeature
} from "../../api/catalogs.api";
import { getImages } from "../../api/images.api";
import type { Image } from "../../types/image.types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/Card";
import { Button } from "../../components/Button";
import { Skeleton } from "../../components/Skeleton";
import { SimpleModal } from "../../components/SimpleModal";
import { buildImageUrl } from "../../utils/imageUtils";
import { validateAuthStatus, isTokenValid } from "../../auth/auth.utils";
import {
  Tag,
  MapPin,
  Star,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter
} from "lucide-react";

interface CatalogItem {
  id: string;
  name: string;
  description?: string;
  imageId?: string;
  createdAt?: string;
}

export default function CatalogsPage() {
  const [categories, setCategories] = useState<CatalogItem[]>([]);
  const [locations, setLocations] = useState<CatalogItem[]>([]);
  const [features, setFeatures] = useState<CatalogItem[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'categories' | 'locations' | 'features'>('categories');
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CatalogItem | null>(null);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [formData, setFormData] = useState({
    name: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = (item: CatalogItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name
    });
    setShowModal(true);
  };

  const handleDeleteClick = (item: CatalogItem) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    try {
      const shouldRedirect = validateAuthStatus();
      if (shouldRedirect) {
        window.location.href = '/login';
        return;
      }

      const token = localStorage.getItem('token');
      if (!token || !isTokenValid(token)) {
        throw new Error('Sesión inválida. Por favor, inicia sesión nuevamente.');
      }

      // Call appropriate delete function based on active tab
      switch (activeTab) {
        case 'categories':
          await deleteCategory(itemToDelete.id);
          setCategories(prev => prev.filter(item => item.id !== itemToDelete.id));
          break;
        case 'locations':
          await deleteLocation(itemToDelete.id);
          setLocations(prev => prev.filter(item => item.id !== itemToDelete.id));
          break;
        case 'features':
          await deletePropertyFeature(itemToDelete.id);
          setFeatures(prev => prev.filter(item => item.id !== itemToDelete.id));
          break;
        default:
          throw new Error('Tipo de catálogo no válido');
      }

      // Reload data to ensure consistency
      const [cats, locs, feats] = await Promise.all([
        getCategories(),
        getLocations(),
        getPropertyFeatures()
      ]);
      setCategories(cats as CatalogItem[]);
      setLocations(locs as CatalogItem[]);
      setFeatures(feats as CatalogItem[]);

      // Close confirmation modal
      setShowDeleteConfirm(false);
      setItemToDelete(null);

    } catch (error: any) {
      console.error('Error deleting item:', error);
      alert('Error al eliminar el elemento: ' + (error.message || 'Error desconocido'));
      // Close confirmation modal even on error
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      setError('El nombre es requerido');
      return;
    }

    if (formData.name.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const shouldRedirect = validateAuthStatus();
      if (shouldRedirect) {
        window.location.href = '/login';
        return;
      }

      const token = localStorage.getItem('token');
      if (!token || !isTokenValid(token)) {
        throw new Error('Sesión inválida. Por favor, inicia sesión nuevamente.');
      }

      const payload: { name: string } = {
        name: formData.name.trim()
      };

      console.log('Enviando payload:', payload);
      console.log('Payload JSON:', JSON.stringify(payload, null, 2));

      let result: CatalogItem;
      
      if (editingItem) {
        // Update existing item
        switch (activeTab) {
          case 'categories':
            result = await updateCategory(editingItem.id, payload) as CatalogItem;
            setCategories(prev => prev.map(item => item.id === editingItem.id ? result : item));
            break;
          case 'locations':
            result = await updateLocation(editingItem.id, payload) as CatalogItem;
            setLocations(prev => prev.map(item => item.id === editingItem.id ? result : item));
            break;
          case 'features':
            result = await updatePropertyFeature(editingItem.id, payload) as CatalogItem;
            setFeatures(prev => prev.map(item => item.id === editingItem.id ? result : item));
            break;
          default:
            throw new Error('Tipo de catálogo no válido');
        }
      } else {
        // Create new item
        switch (activeTab) {
          case 'categories':
            result = await createCategory(payload) as CatalogItem;
            setCategories(prev => [...prev, result]);
            break;
          case 'locations':
            result = await createLocation(payload) as CatalogItem;
            setLocations(prev => [...prev, result]);
            break;
          case 'features':
            result = await createPropertyFeature(payload) as CatalogItem;
            setFeatures(prev => [...prev, result]);
            break;
          default:
            throw new Error('Tipo de catálogo no válido');
        }
      }

      setShowModal(false);

      setTimeout(async () => {
        try {
          const [cats, locs, feats] = await Promise.all([
            getCategories(),
            getLocations(),
            getPropertyFeatures()
          ]);
          setCategories(cats as CatalogItem[]);
          setLocations(locs as CatalogItem[]);
          setFeatures(feats as CatalogItem[]);

          setFormData({ name: '' });
        } catch (refreshError) {
          console.error('Error al refrescar datos:', refreshError);
        }
      }, 150);

    } catch (error: any) {
      console.error('Error creating item:', error);
      console.error('Error completo:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });

      let errorMessage = 'Error al crear el elemento';

      if (error.response?.status === 400) {
        console.log('=== DETALLES DEL ERROR 400 ===');
        console.log('Response data completo:', error.response.data);
        console.log('Response status:', error.response.status);
        console.log('Response headers:', error.response.headers);
        console.log('Tipo de data.message:', typeof error.response.data.message);
        console.log('Contenido de data.message:', error.response.data.message);
        console.log('===============================');

        errorMessage = 'Datos inválidos. Verifica que todos los campos requeridos estén completos.';

        if (error.response?.data?.errors) {
          const fieldErrors = Object.entries(error.response.data.errors)
            .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`)
            .join('; ');
          errorMessage = `Errores de validación: ${fieldErrors}`;
        } else if (Array.isArray(error.response?.data?.message)) {
          errorMessage = error.response.data.message.join(', ');
        } else if (typeof error.response?.data?.message === 'string') {
          errorMessage = error.response.data.message;
        } else if (error.response?.data) {
          errorMessage = `Error del servidor: ${JSON.stringify(error.response.data, null, 2)}`;
        }
      } else if (error.response?.status === 401) {
        errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
      } else if (error.response?.status === 403) {
        errorMessage = 'No tienes permisos para realizar esta acción.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        setLoading(true);
        const [cats, locs, feats, imgs] = await Promise.all([
          getCategories(),
          getLocations(),
          getPropertyFeatures(),
          getImages()
        ]);

        setCategories(cats as CatalogItem[]);
        setLocations(locs as CatalogItem[]);
        setFeatures(feats as CatalogItem[]);
        setImages(imgs as Image[]);
      } catch (error) {
        console.error("Error loading catalogs:", error);
        setCategories([]);
        setLocations([]);
        setFeatures([]);
        setImages([]);
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

  const filteredItems = useMemo(() => {
    const items = getCurrentItems();
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activeTab, searchTerm, categories, locations, features]);

  const stats = useMemo(() => ({
    categories: categories.length,
    locations: locations.length,
    features: features.length
  }), [categories.length, locations.length, features.length]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-10 w-32" />
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Catálogos del Sistema</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona las categorías, ubicaciones y características de las propiedades
          </p>
        </div>
        <Button onClick={() => {
          setEditingItem(null);
          setFormData({ name: '' });
          setShowModal(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Elemento
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card
          hover
          className={activeTab === 'categories' ? 'border-primary ring-2 ring-primary/20' : ''}
          onClick={() => setActiveTab('categories')}
        >
          <CardContent className="p-4 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Categorías</p>
                <p className="text-2xl font-bold text-foreground">{stats.categories}</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Tag className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          hover
          className={activeTab === 'locations' ? 'border-primary ring-2 ring-primary/20' : ''}
          onClick={() => setActiveTab('locations')}
        >
          <CardContent className="p-4 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Ubicaciones</p>
                <p className="text-2xl font-bold text-foreground">{stats.locations}</p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <MapPin className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          hover
          className={activeTab === 'features' ? 'border-primary ring-2 ring-primary/20' : ''}
          onClick={() => setActiveTab('features')}
        >
          <CardContent className="p-4 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Características</p>
                <p className="text-2xl font-bold text-foreground">{stats.features}</p>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                <Star className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <IconComponent className="h-5 w-5" />
                {getCurrentTitle()}
              </CardTitle>
              <CardDescription>
                {filteredItems.length} elemento{filteredItems.length !== 1 ? 's' : ''} encontrado{filteredItems.length !== 1 ? 's' : ''}
                {searchTerm && ` para "${searchTerm}"`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={`Buscar en ${getCurrentTitle().toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-64"
                />
              </div>
              <Button variant="outline" icon={<Filter className="h-4 w-4" />}>
                Filtrar
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredItems.length > 0 ? (
            <div className="grid gap-3">
              {filteredItems.map((item) => {
                const image = images.find(img => img._id === item.imageId);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      {image?.path && (
                        <div className="flex-shrink-0">
                          <img
                            src={buildImageUrl(image.path, image.filename)}
                            alt={item.name}
                            className="h-12 w-12 object-cover rounded-lg border border-border"
                            onError={(e) => {
                              e.currentTarget.parentElement!.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
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

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        onClick={() => handleDeleteClick(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <IconComponent className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchTerm
                  ? `No se encontraron ${getCurrentTitle().toLowerCase()}`
                  : `No hay ${getCurrentTitle().toLowerCase()} registradas`}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? 'Intenta con otros términos de búsqueda'
                  : `Las ${getCurrentTitle().toLowerCase()} aparecerán aquí una vez creadas`}
              </p>
              <Button onClick={() => {
                setEditingItem(null);
                setFormData({ name: '' });
                setShowModal(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar {getCurrentTitle().slice(0, -1)}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <SimpleModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingItem(null);
          setError(null);
          setFormData({ name: '' });
        }}
        title={editingItem ? `Editar ${getCurrentTitle().slice(0, -1)}` : `Agregar ${getCurrentTitle().slice(0, -1)}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Nombre *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder={editingItem 
                ? `Nuevo nombre para ${getCurrentTitle().slice(0, -1).toLowerCase()}` 
                : `Nombre de la ${getCurrentTitle().slice(0, -1).toLowerCase()}`
              }
              required
            />
          </div>

          <div className="space-y-2">
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false);
                setEditingItem(null);
                setError(null);
                setFormData({ name: '' });
              }}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting || !formData.name.trim()}
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  {editingItem ? 'Actualizando...' : 'Guardando...'}
                </>
              ) : (
                <>
                  {editingItem ? (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Actualizar
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Guardar
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </form>
      </SimpleModal>

      {/* Modal de confirmación de eliminación */}
      <SimpleModal
        isOpen={showDeleteConfirm}
        onClose={handleDeleteCancel}
        title="Confirmar eliminación"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              ¿Eliminar {getCurrentTitle().slice(0, -1).toLowerCase()}?
            </h3>
            <p className="text-muted-foreground">
              {itemToDelete && (
                <span>
                  Estás a punto de eliminar <strong>"{itemToDelete.name}"</strong>. Esta acción no se puede deshacer.
                </span>
              )}
            </p>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleDeleteCancel}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
      </SimpleModal>
    </div>
  );
}

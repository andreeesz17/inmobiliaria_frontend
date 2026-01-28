import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/useAuth";
import { getRequests } from "../../api/requests.api";
import { getAppointments } from "../../api/appointments.api";
import { getProperties } from "../../api/properties.api";
import { getCategories, getLocations, getPropertyFeatures } from "../../api/catalogs.api";
import type { Request } from "../../types/request.types";
import type { Appointment } from "../../types/appointment.types";
import type { Property } from "../../types/property.types";
import PropertyCard from "../../components/PropertyCard";
import { getFavorites, toggleFavorite } from "../../utils/favorites";
import RequestForm from "../../components/RequestForm";
import { showNotification } from "../../components/Notifications";
import ThemeToggle from "../../components/ThemeToggle";
import { Tabs, TabPanel } from "../../components/Tabs";
import { Button } from "../../components/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/Card";
import { 
  Calendar, 
  FileText, 
  Heart, 
  Clock, 
  CheckCircle, 
  XCircle,
  Filter,
  Download,
  Home,
  Tag,
  MapPin,
  Star,
  Search
} from "lucide-react";

export default function UserHome() {
  const { username } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [favorites, setFavorites] = useState<number[]>(() => getFavorites());
  const [properties, setProperties] = useState<Property[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');
  const [propertySearchTerm, setPropertySearchTerm] = useState('');
  const [catalogSearchTerm, setCatalogSearchTerm] = useState('');
  const [activeCatalogTab, setActiveCatalogTab] = useState<'categories' | 'locations' | 'features'>('categories');

  useEffect(() => {
    loadRequests();
    getAppointments().then(setAppointments).catch(() => setAppointments([]));
    getProperties({ page: 1, limit: 1000 })
      .then((res) => setProperties(Array.isArray(res) ? res : res.data || []))
      .catch(() => setProperties([]));
    
    // Load catalogs
    Promise.all([
      getCategories(),
      getLocations(),
      getPropertyFeatures()
    ]).then(([cats, locs, feats]) => {
      setCategories(Array.isArray(cats) ? cats : (cats as any)?.items || []);
      setLocations(Array.isArray(locs) ? locs : (locs as any)?.items || []);
      setFeatures(Array.isArray(feats) ? feats : (feats as any)?.items || []);
    }).catch(() => {
      setCategories([]);
      setLocations([]);
      setFeatures([]);
    });
    
    // Poll for request updates every 30 seconds
    const interval = setInterval(loadRequests, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadRequests = async () => {
    try {
      const data = await getRequests();
      setRequests(data as Request[]);
    } catch (error) {
      console.error("Error loading requests:", error);
      setRequests([]);
    }
  };

  const handleRequestSuccess = () => {
    setShowRequestForm(false);
    loadRequests();
    showNotification("Solicitud creada exitosamente", "success");
  };

  const handleRequestCancel = () => {
    setShowRequestForm(false);
  };

  const myRequests = useMemo(() => {
    if (!username) return [];
    return (requests as Request[]).filter(
      (r) => r.email_cliente?.toLowerCase() === username.toLowerCase()
    );
  }, [requests, username]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved': 
        return { 
          bg: 'bg-emerald-100 dark:bg-emerald-900/30', 
          text: 'text-emerald-700 dark:text-emerald-300',
          border: 'border-emerald-200 dark:border-emerald-800/50',
          icon: CheckCircle,
          label: 'Aprobada'
        };
      case 'declined': 
        return { 
          bg: 'bg-red-100 dark:bg-red-900/30', 
          text: 'text-red-700 dark:text-red-300',
          border: 'border-red-200 dark:border-red-800/50',
          icon: XCircle,
          label: 'Rechazada'
        };
      default: 
        return { 
          bg: 'bg-amber-100 dark:bg-amber-900/30', 
          text: 'text-amber-700 dark:text-amber-300',
          border: 'border-amber-200 dark:border-amber-800/50',
          icon: Clock,
          label: 'Pendiente'
        };
    }
  };

  const myAppointments = useMemo(() => {
    if (!username) return [];
    return appointments.filter(
      (a) => a.email?.toLowerCase() === username.toLowerCase()
    );
  }, [appointments, username]);

  const favoriteProperties = useMemo(
    () => properties.filter((p) => favorites.includes(p.id)),
    [properties, favorites]
  );
  
  const filteredProperties = useMemo(() => {
    if (!propertySearchTerm) return properties;
    const term = propertySearchTerm.toLowerCase();
    return properties.filter(property => 
      property.title?.toLowerCase().includes(term) ||
      property.description?.toLowerCase().includes(term) ||
      property.address?.toLowerCase().includes(term)
    );
  }, [properties, propertySearchTerm]);
  
  const getCurrentCatalogItems = () => {
    switch (activeCatalogTab) {
      case 'categories': return categories;
      case 'locations': return locations;
      case 'features': return features;
      default: return [];
    }
  };
  
  const getCurrentCatalogTitle = () => {
    switch (activeCatalogTab) {
      case 'categories': return 'Categorías';
      case 'locations': return 'Ubicaciones';
      case 'features': return 'Características';
      default: return '';
    }
  };
  
  const getCatalogIcon = () => {
    switch (activeCatalogTab) {
      case 'categories': return Tag;
      case 'locations': return MapPin;
      case 'features': return Star;
      default: return Tag;
    }
  };
  
  const filteredCatalogItems = useMemo(() => {
    const items = getCurrentCatalogItems();
    if (!catalogSearchTerm) return items;
    const term = catalogSearchTerm.toLowerCase();
    return items.filter(item => 
      item.name?.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term)
    );
  }, [activeCatalogTab, catalogSearchTerm, categories, locations, features]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mi Espacio Personal</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona tus solicitudes, citas y propiedades favoritas
          </p>
        </div>
        <ThemeToggle />
      </div>

      <Tabs 
        tabs={[
          { id: 'properties', label: 'Propiedades', icon: <Home className="h-4 w-4" /> },
          { id: 'catalogs', label: 'Catálogos', icon: <Tag className="h-4 w-4" /> },
          { id: 'requests', label: 'Solicitudes', icon: <FileText className="h-4 w-4" /> },
          { id: 'appointments', label: 'Citas', icon: <Calendar className="h-4 w-4" /> },
          { id: 'favorites', label: 'Favoritos', icon: <Heart className="h-4 w-4" /> }
        ]}
        defaultActiveTab="properties"
      >

        <TabPanel tabId="properties">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <CardTitle>Todas las Propiedades</CardTitle>
                    <CardDescription>
                      Explora todas las propiedades disponibles
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Buscar propiedades..."
                        value={propertySearchTerm}
                        onChange={(e) => setPropertySearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-64"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Home className="h-4 w-4" />
                      <span>Total: {filteredProperties.length}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {filteredProperties.length > 0 ? (
                    filteredProperties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        isFavorite={favorites.includes(property.id)}
                        onToggleFavorite={(id) => setFavorites(toggleFavorite(id))}

                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        {propertySearchTerm ? 'No se encontraron propiedades' : 'No hay propiedades disponibles'}
                      </h3>
                      <p className="text-muted-foreground">
                        {propertySearchTerm 
                          ? 'Intenta con otros términos de búsqueda' 
                          : 'Las propiedades aparecerán aquí una vez creadas'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabPanel>

        <TabPanel tabId="catalogs">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <CardTitle>Catálogos del Sistema</CardTitle>
                    <CardDescription>
                      Categorías, ubicaciones y características disponibles
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder={`Buscar en ${getCurrentCatalogTitle().toLowerCase()}...`}
                        value={catalogSearchTerm}
                        onChange={(e) => setCatalogSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Catalog Tabs */}
                <div className="flex gap-1 mb-6 p-1 bg-muted rounded-lg w-fit">
                  <button
                    onClick={() => setActiveCatalogTab('categories')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeCatalogTab === 'categories' 
                        ? 'bg-background text-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Categorías ({categories.length})
                  </button>
                  <button
                    onClick={() => setActiveCatalogTab('locations')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeCatalogTab === 'locations' 
                        ? 'bg-background text-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Ubicaciones ({locations.length})
                  </button>
                  <button
                    onClick={() => setActiveCatalogTab('features')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeCatalogTab === 'features' 
                        ? 'bg-background text-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Características ({features.length})
                  </button>
                </div>

                {/* Catalog Items */}
                <div className="grid gap-3">
                  {filteredCatalogItems.length > 0 ? (
                    filteredCatalogItems.map((item) => {
                      const IconComponent = getCatalogIcon();
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4 min-w-0 flex-1">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                              <IconComponent className="h-5 w-5" />
                            </div>
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
                      );
                    })
                  ) : (
                    <div className="text-center py-12">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mx-auto mb-4">
                        {(() => {
                          const IconComponent = getCatalogIcon();
                          return <IconComponent className="h-8 w-8" />;
                        })()}
                      </div>
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        {catalogSearchTerm
                          ? `No se encontraron ${getCurrentCatalogTitle().toLowerCase()}`
                          : `No hay ${getCurrentCatalogTitle().toLowerCase()} registradas`}
                      </h3>
                      <p className="text-muted-foreground">
                        {catalogSearchTerm
                          ? 'Intenta con otros términos de búsqueda'
                          : `Las ${getCurrentCatalogTitle().toLowerCase()} aparecerán aquí una vez creadas`}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabPanel>

        <TabPanel tabId="requests">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <CardTitle>Mis Solicitudes</CardTitle>
                    <CardDescription>
                      Gestiona tus solicitudes de propiedades
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Total: {myRequests.length}</span>
                      <span>•</span>
                      <span className="text-emerald-600">Aprobadas: {myRequests.filter(r => r.status === 'approved').length}</span>
                      <span>•</span>
                      <span className="text-amber-600">Pendientes: {myRequests.filter(r => r.status === 'pending').length}</span>
                    </div>
                    <Button 
                      onClick={() => setShowRequestForm(true)}
                      icon={<FileText className="h-4 w-4" />}
                    >
                      Nueva Solicitud
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
          
                {/* View Toggle */}
                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg w-fit mb-6">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-background text-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Lista
                  </button>
                  <button
                    onClick={() => setViewMode('timeline')}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                      viewMode === 'timeline' 
                        ? 'bg-background text-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Timeline
                  </button>
                </div>
        
                {/* Timeline View */}
                {viewMode === 'timeline' && (
                  <div className="space-y-4">
                    {myRequests.length > 0 ? (
                      <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
                        
                        {myRequests
                          .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
                          .map((request) => {
                            const statusConfig = getStatusConfig(request.status);
                            const Icon = statusConfig.icon;
                            
                            return (
                              <div key={request._id} className="relative pl-12 pb-8">
                                {/* Timeline dot */}
                                <div className="absolute left-2.5 top-2 w-3 h-3 rounded-full bg-primary border-4 border-background"></div>
                                
                                <Card>
                                  <CardContent>
                                    <div className="flex items-start justify-between mb-3">
                                      <div>
                                        <h3 className="font-semibold text-foreground">{request.nombre_cliente}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">{request.direccion}</p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Icon className="h-4 w-4 text-muted-foreground" />
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                                          {statusConfig.label}
                                        </span>
                                      </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                                      <div className="flex items-center gap-2 text-muted-foreground">
                                        <FileText className="h-4 w-4" />
                                        <span>{request.tipo_operacion}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-muted-foreground">
                                        <span className="font-medium">${request.precio?.toLocaleString()}</span>
                                      </div>
                                    </div>
                                    
                                    <div className="text-xs text-muted-foreground">
                                      Creado: {request.createdAt 
                                        ? new Date(request.createdAt).toLocaleDateString('es-EC', { 
                                            year: 'numeric', 
                                            month: 'short', 
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })
                                        : 'Fecha no disponible'}
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            );
                          })
                        }
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No tienes solicitudes</h3>
                        <p className="text-muted-foreground mb-4">Crea tu primera solicitud para comenzar</p>
                        <Button 
                          onClick={() => setShowRequestForm(true)}
                          icon={<FileText className="h-4 w-4" />}
                        >
                          Crear Solicitud
                        </Button>
                      </div>
                    )}
                  </div>
                )}
        
                {/* List View */}
                {viewMode === 'list' && (
                  <>
                    {showRequestForm ? (
                      <RequestForm 
                        onSuccess={handleRequestSuccess}
                        onCancel={handleRequestCancel}
                      />
                    ) : (
                      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {myRequests.map((request) => {
                          const statusConfig = getStatusConfig(request.status);
                          const Icon = statusConfig.icon;
                          
                          return (
                            <Card key={request._id} hover>
                              <CardContent>
                                <div>
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <h3 className="font-semibold text-foreground truncate">{request.nombre_cliente}</h3>
                                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{request.direccion}</p>
                                    </div>
                                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                                      <Icon className="h-3 w-3" />
                                      {statusConfig.label}
                                    </span>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                      <FileText className="h-3.5 w-3.5" />
                                      <span>{request.tipo_operacion}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                      <span className="font-medium">${request.precio?.toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="text-xs text-muted-foreground pt-3 border-t border-border">
                                  {request.createdAt 
                                    ? `Creado: ${new Date(request.createdAt).toLocaleDateString('es-EC')}`
                                    : 'Fecha no disponible'}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                        
                        {myRequests.length === 0 && (
                          <div className="col-span-full text-center py-12">
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-foreground mb-2">No tienes solicitudes</h3>
                            <p className="text-muted-foreground mb-4">Crea tu primera solicitud para comenzar</p>
                            <Button 
                              onClick={() => setShowRequestForm(true)}
                              icon={<FileText className="h-4 w-4" />}
                            >
                              Crear Solicitud
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabPanel>

        <TabPanel tabId="appointments">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Mis Citas</CardTitle>
                    <CardDescription>
                      Tus citas programadas con agentes
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Total: {myAppointments.length}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {myAppointments.length > 0 ? (
                    myAppointments.map((appointment) => (
                      <Card key={appointment.id} hover>
                        <CardContent>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-foreground">{appointment.clientName}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{appointment.email}</p>
                            </div>
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                              <Calendar className="h-4 w-4" />
                            </div>
                          </div>
                          
                          <div className="text-sm text-muted-foreground">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="h-4 w-4" />
                              <span>
                                {new Date(appointment.appointmentDate).toLocaleDateString('es-EC', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>
                                {new Date(appointment.appointmentDate).toLocaleTimeString('es-EC', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No tienes citas programadas</h3>
                      <p className="text-muted-foreground">Las citas aparecerán aquí una vez programadas</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabPanel>

        <TabPanel tabId="favorites">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <CardTitle>Mis Favoritos</CardTitle>
                    <CardDescription>
                      Propiedades guardadas para consulta posterior
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Heart className="h-4 w-4 text-rose-500" />
                      <span>Total: {favoriteProperties.length}</span>
                    </div>
                    {favoriteProperties.length > 1 && (
                      <Button 
                        variant="outline" 
                        icon={<Filter className="h-4 w-4" />}
                      />
                    )}
                    {favoriteProperties.length > 0 && (
                      <Button 
                        variant="outline" 
                        icon={<Download className="h-4 w-4" />}
                      />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {favoriteProperties.length > 0 ? (
                    favoriteProperties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        isFavorite={favorites.includes(property.id)}
                        onToggleFavorite={(id) => setFavorites(toggleFavorite(id))}

                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No tienes favoritos</h3>
                      <p className="text-muted-foreground mb-4">Guarda propiedades que te interesen para compararlas fácilmente</p>
                      <Button 
                        icon={<Heart className="h-4 w-4" />}
                      >
                        Explorar Propiedades
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}

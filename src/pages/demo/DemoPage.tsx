import { useState } from "react";
import { 
  Search, 
  Filter, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  Home,
  Users,
  FileText,
  Calendar
} from "lucide-react";
import { Button } from "../../components/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/Card";
import { Modal, ConfirmDialog } from "../../components/Modal";
import { PropertySearch } from "../../components/PropertySearch";
import { SimpleBarChart, SimpleLineChart, StatCard } from "../../components/Charts";
import { Tabs, TabPanel } from "../../components/Tabs";
import { MessagingContainer } from "../../components/Messaging";
import { DocumentManager } from "../../components/DocumentManager";
import { showNotification } from "../../components/Notifications";
import ThemeToggle from "../../components/ThemeToggle";
import type { Property } from "../../types/property.types";

// Mock data
const mockProperties: Property[] = [
  { id: 1, title: "Casa familiar en zona residencial", description: "Hermosa casa con 3 dormitorios", type: "casa", price: 150000, address: "Av. Principal 123" },
  { id: 2, title: "Departamento moderno", description: "Departamento de 2 ambientes", type: "departamento", price: 85000, address: "Calle Secundaria 456" },
  { id: 3, title: "Terreno comercial", description: "Terreno ideal para negocio", type: "terreno", price: 200000, address: "Zona Industrial 789" },
  { id: 4, title: "Local comercial céntrico", description: "Local en zona de alto tráfico", type: "local", price: 120000, address: "Centro Comercial 321" }
];

const mockChartData = [
  { label: "Casas", value: 45, color: "bg-blue-500" },
  { label: "Deptos", value: 32, color: "bg-emerald-500" },
  { label: "Terrenos", value: 18, color: "bg-amber-500" },
  { label: "Locales", value: 5, color: "bg-rose-500" }
];

const mockLineData = [
  { x: "Ene", y: 120 },
  { x: "Feb", y: 135 },
  { x: "Mar", y: 142 },
  { x: "Abr", y: 168 },
  { x: "May", y: 155 },
  { x: "Jun", y: 178 }
];

// Mock messaging data
const mockContacts = [
  { id: '1', name: 'Carlos Rodríguez', lastMessage: 'Hola, ¿cómo estás?', lastMessageTime: new Date(Date.now() - 3600000), unreadCount: 2, isOnline: true },
  { id: '2', name: 'María González', lastMessage: 'Gracias por la información', lastMessageTime: new Date(Date.now() - 86400000), isOnline: false },
  { id: '3', name: 'Jorge Pérez', lastMessage: 'Te envío los documentos', lastMessageTime: new Date(Date.now() - 172800000), unreadCount: 1, isOnline: true },
];

const mockMessages = [
  { id: '1', sender: { id: '2', name: 'María González' }, content: 'Hola buenos días', timestamp: new Date(Date.now() - 3600000), status: 'read' as const },
  { id: '2', sender: { id: 'current', name: 'Tú' }, content: 'Hola María, ¿cómo estás?', timestamp: new Date(Date.now() - 3500000), status: 'read' as const },
];

// Mock documents data
const mockDocuments = [
  { id: '1', name: 'Contrato_Venta.pdf', type: 'application/pdf', size: '2.4 MB', uploadedAt: new Date(), owner: 'Carlos R.', category: 'Contratos', url: '#' },
  { id: '2', name: 'Plano_Casa.jpg', type: 'image/jpeg', size: '1.8 MB', uploadedAt: new Date(Date.now() - 86400000), owner: 'María G.', category: 'Planos', url: '#' },
  { id: '3', name: 'Presupuesto.xlsx', type: 'application/vnd.excel', size: '0.8 MB', uploadedAt: new Date(Date.now() - 172800000), owner: 'Jorge P.', category: 'Finanzas', url: '#' },
];

export default function DemoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(mockProperties);

  const handleConfirmAction = () => {
    showNotification("Acción confirmada exitosamente", "success", "Confirmación");
  };

  const statCards = [
    {
      title: "Propiedades Totales",
      value: "142",
      description: "En nuestro catálogo",
      trend: { value: 12, isPositive: true, label: "vs mes anterior" },
      icon: <Home className="h-5 w-5" />
    },
    {
      title: "Usuarios Activos",
      value: "1,248",
      description: "Clientes registrados",
      trend: { value: 8, isPositive: true, label: "crecimiento mensual" },
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Solicitudes",
      value: "89",
      description: "Esta semana",
      trend: { value: 5, isPositive: false, label: "menos que la semana pasada" },
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: "Citas Programadas",
      value: "24",
      description: "Para hoy",
      trend: { value: 15, isPositive: true, label: "incremento diario" },
      icon: <Calendar className="h-5 w-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Demo de Componentes</h1>
          <p className="text-muted-foreground mt-2">
            Showcase de todos los componentes implementados
          </p>
        </div>
        <ThemeToggle />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Button 
          onClick={() => setIsModalOpen(true)}
          icon={<Search className="h-4 w-4" />}
        >
          Abrir Modal
        </Button>
        
        <Button 
          variant="danger"
          onClick={() => setIsConfirmOpen(true)}
          icon={<Filter className="h-4 w-4" />}
        >
          Confirm Dialog
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => showNotification("Notificación de prueba", "info", "Información")}
        >
          Mostrar Notificación
        </Button>
      </div>

      <Tabs 
        tabs={[{ id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="h-4 w-4" /> },
          { id: 'search', label: 'Búsqueda', icon: <Search className="h-4 w-4" /> },
          { id: 'charts', label: 'Gráficos', icon: <PieChart className="h-4 w-4" /> },
          { id: 'messaging', label: 'Mensajería', icon: <Users className="h-4 w-4" /> },
          { id: 'documents', label: 'Documentos', icon: <FileText className="h-4 w-4" /> }
        ]}
        defaultActiveTab="dashboard"
      >
        {/* Dashboard Tab */}
        <TabPanel tabId="dashboard">
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {statCards.map((card, index) => (
                <StatCard key={index} {...card} />
              ))}
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Propiedades</CardTitle>
                  <CardDescription>Por tipo de propiedad</CardDescription>
                </CardHeader>
                <CardContent>
                  <SimpleBarChart 
                    data={mockChartData} 
                    height={250}
                    showValues={true}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Crecimiento Mensual</CardTitle>
                  <CardDescription>Tendencia de los últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <SimpleLineChart 
                    data={mockLineData}
                    height={250}
                    color="text-emerald-500"
                    showPoints={true}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabPanel>

        {/* Search Tab */}
        <TabPanel tabId="search">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Búsqueda de Propiedades</CardTitle>
                <CardDescription>Filtra y busca propiedades según tus criterios</CardDescription>
              </CardHeader>
              <CardContent>
                <PropertySearch
                  properties={mockProperties}
                  onResultsChange={setFilteredProperties}
                  placeholder="Buscar por ubicación, tipo o características..."
                />
              </CardContent>
            </Card>

            {/* Results */}
            {filteredProperties.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredProperties.map(property => (
                  <Card key={property.id} hover>
                    <CardContent>
                      <h3 className="font-semibold text-foreground mb-2">{property.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{property.description}</p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Tipo:</span>
                          <span className="font-medium capitalize">{property.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Precio:</span>
                          <span className="font-medium">${property.price?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ubicación:</span>
                          <span className="font-medium">{property.address}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No se encontraron resultados</h3>
                  <p className="text-muted-foreground">Intenta con otros términos de búsqueda</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabPanel>

        {/* Charts Tab */}
        <TabPanel tabId="charts">
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Gráfico de Barras</CardTitle>
                  <CardDescription>Ejemplo de visualización de datos</CardDescription>
                </CardHeader>
                <CardContent>
                  <SimpleBarChart 
                    data={[
                      { label: "Enero", value: 65 },
                      { label: "Febrero", value: 78 },
                      { label: "Marzo", value: 92 },
                      { label: "Abril", value: 85 },
                      { label: "Mayo", value: 98 },
                      { label: "Junio", value: 110 }
                    ]}
                    height={300}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gráfico de Líneas</CardTitle>
                  <CardDescription>Tendencias a lo largo del tiempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <SimpleLineChart
                    data={[
                      { x: "Sem 1", y: 45 },
                      { x: "Sem 2", y: 52 },
                      { x: "Sem 3", y: 48 },
                      { x: "Sem 4", y: 61 },
                      { x: "Sem 5", y: 55 },
                      { x: "Sem 6", y: 67 },
                      { x: "Sem 7", y: 72 },
                      { x: "Sem 8", y: 68 }
                    ]}
                    height={300}
                    color="text-blue-500"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Tasa de Conversión"
                value="24.8%"
                description="Visitas a contactos"
                trend={{ value: 3.2, isPositive: true, label: "mejora mensual" }}
                icon={<TrendingUp className="h-5 w-5" />}
              />
              <StatCard
                title="Tiempo Promedio"
                value="2.4 min"
                description="En el sitio"
                trend={{ value: 0.8, isPositive: true, label: "aumento" }}
                icon={<TrendingUp className="h-5 w-5" />}
              />
              <StatCard
                title="Retención"
                value="78.3%"
                description="Usuarios recurrentes"
                trend={{ value: 2.1, isPositive: true, label: "crecimiento" }}
                icon={<TrendingUp className="h-5 w-5" />}
              />
              <StatCard
                title="Satisfacción"
                value="4.8/5"
                description="Calificación promedio"
                trend={{ value: 0.3, isPositive: true, label: "mejora" }}
                icon={<TrendingUp className="h-5 w-5" />}
              />
            </div>
          </div>
        </TabPanel>

        {/* Messaging Tab */}
        <TabPanel tabId="messaging">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sistema de Mensajería</CardTitle>
                <CardDescription>Chat en tiempo real con tus contactos</CardDescription>
              </CardHeader>
              <CardContent className="p-0 h-96">
                <MessagingContainer
                  contacts={mockContacts}
                  messages={mockMessages}
                  currentUser={{ id: 'current', name: 'Tú' }}
                  onContactSelect={(id) => console.log('Selected contact:', id)}
                  onSendMessage={(content) => console.log('Sending message:', content)}
                />
              </CardContent>
            </Card>
          </div>
        </TabPanel>

        {/* Documents Tab */}
        <TabPanel tabId="documents">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestor de Documentos</CardTitle>
                <CardDescription>Administra todos tus archivos y documentos</CardDescription>
              </CardHeader>
              <CardContent>
                <DocumentManager
                  documents={mockDocuments}
                  onUpload={(files) => console.log('Uploading files:', files)}
                  onDownload={(id) => console.log('Downloading document:', id)}
                  onDelete={(id) => console.log('Deleting document:', id)}
                  onView={(id) => console.log('Viewing document:', id)}
                />
              </CardContent>
            </Card>
          </div>
        </TabPanel>
      </Tabs>

      {/* Modals */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Modal de Ejemplo"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Este es un ejemplo de modal reutilizable con diferentes tamaños y opciones.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="primary">Acción Principal</Button>
            <Button variant="outline">Acción Secundaria</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmAction}
        title="¿Confirmar acción?"
        message="Esta acción no se puede deshacer. ¿Deseas continuar?"
        confirmText="Sí, confirmar"
        cancelText="Cancelar"
        confirmVariant="danger"
      />
    </div>
  );
}
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPropertyById } from "../../api/properties.api";
import { createRequest } from "../../api/requests.api";
import { createAppointment } from "../../api/appointments.api";
import type { Property } from "../../types/property.types";
import { Button } from "../../components/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/Card";
import { Skeleton } from "../../components/Skeleton";
import { getFavorites, toggleFavorite } from "../../utils/favorites";
import { showNotification } from "../../components/Notifications";
import { 
  Home, 
  Mail, 
  Calendar, 
  User, 
  MapPin
} from "lucide-react";

export default function DashboardPropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>(() => getFavorites());
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [appointmentStatus, setAppointmentStatus] = useState<string | null>(null);
  const [requestForm, setRequestForm] = useState({
    nombre_cliente: "",
    email_cliente: "",
    tipo_operacion: "Venta",
    num_habitaciones: "",
  });
  const [appointmentForm, setAppointmentForm] = useState({
    clientName: "",
    email: "",
    appointmentDate: "",
    description: "",
  });

  useEffect(() => {
    if (id) {
      getPropertyById(Number(id))
        .then(data => {
          setProperty(data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error loading property:", error);
          setLoading(false);
        });
    }
  }, [id]);

  const handleFavoriteToggle = (propertyId: number) => {
    const newFavorites = toggleFavorite(propertyId);
    setFavorites(newFavorites);
    showNotification(
      newFavorites.includes(propertyId) 
        ? "Agregado a favoritos" 
        : "Eliminado de favoritos", 
      "success"
    );
  };

  const submitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestStatus(null);

    const payload = {
      direccion: property?.address || "",
      precio: Number(property?.price) || 0,
      num_habitaciones: Number(requestForm.num_habitaciones),
      tipo_operacion: requestForm.tipo_operacion,
      nombre_cliente: requestForm.nombre_cliente.trim(),
      email_cliente: requestForm.email_cliente.trim(),
    };

    if (!payload.nombre_cliente || !payload.email_cliente || !payload.num_habitaciones) {
      setRequestStatus("Completa todos los campos de solicitud.");
      return;
    }

    try {
      await createRequest(payload);
      setRequestStatus("Solicitud enviada correctamente.");
      showNotification("Solicitud enviada exitosamente", "success");
      setRequestForm({
        nombre_cliente: "",
        email_cliente: "",
        tipo_operacion: "Venta",
        num_habitaciones: "",
      });
    } catch (error) {
      setRequestStatus("No se pudo enviar la solicitud.");
      showNotification("Error al enviar la solicitud", "error");
    }
  };

  const submitAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setAppointmentStatus(null);

    if (
      !appointmentForm.clientName.trim() ||
      !appointmentForm.email.trim() ||
      !appointmentForm.appointmentDate.trim() ||
      !appointmentForm.description.trim()
    ) {
      setAppointmentStatus("Completa todos los campos de la cita.");
      return;
    }

    const appointmentDateIso = new Date(
      appointmentForm.appointmentDate
    ).toISOString();

    try {
      await createAppointment({
        clientName: appointmentForm.clientName.trim(),
        email: appointmentForm.email.trim(),
        appointmentDate: appointmentDateIso,
        description: appointmentForm.description.trim(),
      });
      setAppointmentStatus("Cita registrada correctamente.");
      showNotification("Cita agendada exitosamente", "success");
      setAppointmentForm({
        clientName: "",
        email: "",
        appointmentDate: "",
        description: "",
      });
    } catch (error) {
      setAppointmentStatus("No se pudo registrar la cita.");
      showNotification("Error al agendar la cita", "error");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-96 rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
          <Home className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Propiedad no encontrada
        </h3>
        <p className="text-muted-foreground">
          La propiedad que buscas no existe o ya no está disponible
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with favorite button */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{property.title}</h1>
          <div className="flex items-center gap-2 mt-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{property.address}</span>
          </div>
        </div>
        
        <Button
          variant={favorites.includes(property.id) ? "danger" : "outline"}
          onClick={() => handleFavoriteToggle(property.id)}
          icon={favorites.includes(property.id) ? "★" : "☆"}
        >
          {favorites.includes(property.id) ? "Eliminar de favoritos" : "Agregar a favoritos"}
        </Button>
      </div>

      {/* Property details */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles de la propiedad</CardTitle>
          <CardDescription>
            Información completa sobre esta propiedad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="text-foreground">{property.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-primary">${property.price?.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Precio</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <Home className="h-6 w-6 text-primary mx-auto mb-1" />
                <p className="text-lg font-semibold">{property.type || 'Residencial'}</p>
                <p className="text-sm text-muted-foreground">Tipo</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forms grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Request form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Solicitar información
            </CardTitle>
            <CardDescription>
              Envía una solicitud para obtener más información sobre esta propiedad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitRequest} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Tu nombre"
                      value={requestForm.nombre_cliente}
                      onChange={(e) =>
                        setRequestForm({ ...requestForm, nombre_cliente: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="tu@email.com"
                      value={requestForm.email_cliente}
                      onChange={(e) =>
                        setRequestForm({ ...requestForm, email_cliente: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Tipo de operación
                </label>
                <select
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={requestForm.tipo_operacion}
                  onChange={(e) =>
                    setRequestForm({ ...requestForm, tipo_operacion: e.target.value })
                  }
                >
                  <option value="Venta">Venta</option>
                  <option value="Alquiler">Alquiler</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Número de habitaciones
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Número de habitaciones deseadas"
                  value={requestForm.num_habitaciones}
                  onChange={(e) =>
                    setRequestForm({ ...requestForm, num_habitaciones: e.target.value })
                  }
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Enviar solicitud
              </Button>

              {requestStatus && (
                <div className={`p-3 rounded-lg text-sm ${
                  requestStatus.includes('correctamente') 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {requestStatus}
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Appointment form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Agendar cita
            </CardTitle>
            <CardDescription>
              Programa una visita presencial para conocer la propiedad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Nombre completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Tu nombre"
                    value={appointmentForm.clientName}
                    onChange={(e) =>
                      setAppointmentForm({ ...appointmentForm, clientName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="tu@email.com"
                    value={appointmentForm.email}
                    onChange={(e) =>
                      setAppointmentForm({ ...appointmentForm, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Fecha y hora de la cita
                </label>
                <input
                  type="datetime-local"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={appointmentForm.appointmentDate}
                  onChange={(e) =>
                    setAppointmentForm({ ...appointmentForm, appointmentDate: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Mensaje adicional
                </label>
                <textarea
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Información adicional sobre tu visita..."
                  value={appointmentForm.description}
                  onChange={(e) =>
                    setAppointmentForm({ ...appointmentForm, description: e.target.value })
                  }
                  rows={3}
                  required
                />
              </div>

              <Button type="submit" variant="secondary" className="w-full">
                Agendar cita
              </Button>

              {appointmentStatus && (
                <div className={`p-3 rounded-lg text-sm ${
                  appointmentStatus.includes('correctamente') 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {appointmentStatus}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
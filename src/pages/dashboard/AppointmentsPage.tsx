import { useEffect, useState, useMemo } from "react";
import { getAppointments } from "../../api/appointments.api";
import type { Appointment } from "../../types/appointment.types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/Card";
import { Button } from "../../components/Button";
import { Skeleton } from "../../components/Skeleton";
import {
  Calendar,
  Clock,
  CheckCircle,
  Clock as ClockIcon,
  XCircle,
  Plus,
  Search
} from "lucide-react";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        const data = await getAppointments();
        setAppointments(data as Appointment[]);
      } catch (error) {
        console.error("Error loading appointments:", error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'confirmada':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-900/30',
          text: 'text-emerald-700 dark:text-emerald-300',
          border: 'border-emerald-200 dark:border-emerald-800/50',
          icon: CheckCircle,
          label: 'Confirmada'
        };
      case 'pending':
      case 'pendiente':
        return {
          bg: 'bg-amber-100 dark:bg-amber-900/30',
          text: 'text-amber-700 dark:text-amber-300',
          border: 'border-amber-200 dark:border-amber-800/50',
          icon: ClockIcon,
          label: 'Pendiente'
        };
      case 'cancelled':
      case 'cancelada':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-700 dark:text-red-300',
          border: 'border-red-200 dark:border-red-800/50',
          icon: XCircle,
          label: 'Cancelada'
        };
      default:
        return {
          bg: 'bg-slate-100 dark:bg-slate-900/30',
          text: 'text-slate-700 dark:text-slate-300',
          border: 'border-slate-200 dark:border-slate-800/50',
          icon: Calendar,
          label: status || 'Desconocido'
        };
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const matchesSearch = appointment.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.email?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [appointments, searchTerm]);

  const stats = useMemo(() => {
    const total = appointments.length;
    return { total, confirmed: 0, pending: total, cancelled: 0 };
  }, [appointments]);

  const groupedByDate = useMemo(() => {
    const groups: Record<string, Appointment[]> = {};
    filteredAppointments.forEach(appointment => {
      const date = new Date(appointment.appointmentDate).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(appointment);
    });
    return groups;
  }, [filteredAppointments]);

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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>

        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Citas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Organiza y gestiona las citas con tus clientes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Total: {stats.total}</span>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Cita
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Confirmadas</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.confirmed}</p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                <ClockIcon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Canceladas</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                <XCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* View Toggle */}
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg border border-border">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${viewMode === 'list'
                    ? 'bg-primary text-primary-foreground shadow-sm scale-105'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
              >
                <Calendar className="h-4 w-4" />
                Lista
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${viewMode === 'calendar'
                    ? 'bg-primary text-primary-foreground shadow-sm scale-105'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
              >
                <ClockIcon className="h-4 w-4" />
                Calendario
              </button>
            </div>

            {/* Search */}
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por cliente o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all duration-200 shadow-sm hover:shadow-md"
              />
            </div>


          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Citas</CardTitle>
              <CardDescription>
                {filteredAppointments.length} cita{filteredAppointments.length !== 1 ? 's' : ''} encontrado{filteredAppointments.length !== 1 ? 's' : ''}
                {searchTerm && ` para "${searchTerm}"`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length > 0 ? (
            viewMode === 'list' ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredAppointments.map((appointment) => {
                  const statusConfig = getStatusConfig('pending');
                  const Icon = statusConfig.icon;

                  return (
                    <Card key={appointment.id} hover>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-foreground truncate">
                                {appointment.clientName}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {appointment.email}
                              </p>
                            </div>
                            <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ml-2 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                              <Icon className="h-3 w-3" />
                              {statusConfig.label}
                            </span>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(appointment.appointmentDate).toLocaleDateString('es-EC', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{new Date(appointment.appointmentDate).toLocaleTimeString('es-EC', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</span>
                            </div>

                          </div>

                          <div className="flex gap-2 pt-3 border-t border-border">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
                            >
                              Ver Detalles
                            </Button>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all duration-200"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-red-500 hover:text-red-600 hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-200"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              /* Calendar View */
              <div className="space-y-6">
                {Object.entries(groupedByDate)
                  .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                  .map(([date, dateAppointments]) => (
                    <div key={date}>
                      <h3 className="font-semibold text-foreground mb-3 pb-2 border-b border-border">
                        {new Date(date).toLocaleDateString('es-EC', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </h3>
                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {dateAppointments.map((appointment) => {
                          const statusConfig = getStatusConfig('pending');

                          return (
                            <div
                              key={appointment.id}
                              className="p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h4 className="font-medium text-foreground">{appointment.clientName}</h4>
                                  <p className="text-sm text-muted-foreground">{appointment.email}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                                  {statusConfig.label}
                                </span>
                              </div>

                              <div className="space-y-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  <span>{new Date(appointment.appointmentDate).toLocaleTimeString('es-EC', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            )
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Calendar className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {searchTerm
                  ? 'No se encontraron citas'
                  : 'No hay citas programadas'}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchTerm
                  ? 'Intenta con otros términos de búsqueda o elimina el filtro para ver todas las citas'
                  : 'Programa tu primera cita para comenzar a gestionar tus reuniones'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" className="px-6 py-3">
                  <Plus className="h-5 w-5 mr-2" />
                  Programar Cita
                </Button>
                {searchTerm && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm('')}
                    className="px-6 py-3"
                  >
                    Limpiar Búsqueda
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

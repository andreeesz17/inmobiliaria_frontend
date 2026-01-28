import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/useAuth";
import { getRequests } from "../../api/requests.api";
import { getAppointments } from "../../api/appointments.api";
import { getProperties } from "../../api/properties.api";
import type { Request } from "../../types/request.types";
import type { Appointment } from "../../types/appointment.types";
import type { Property } from "../../types/property.types";
import ThemeToggle from "../../components/ThemeToggle";
import { showNotification } from "../../components/Notifications";
import { 
  Briefcase, 
  FileText, 
  Calendar, 
  Building2, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  UserCheck 
} from "lucide-react";

interface AgentStats {
  requests: { total: number; pending: number; approved: number; declined: number };
  appointments: { total: number; today: number; week: number; upcoming: number };
  properties: { total: number; active: number; featured: number };
  performance: { approvalRate: number; responseTime: string };
}

export default function AgentHome() {
  const { username } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgentData();
  }, []);

  const loadAgentData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [requestsRes, appointmentsRes, propertiesRes] = await Promise.all([
        getRequests(),
        getAppointments(),
        getProperties({ page: 1, limit: 1000 })
      ]);

      setRequests(requestsRes as Request[]);
      setAppointments(appointmentsRes as Appointment[]);
      setProperties(propertiesRes.data as Property[]);
    } catch (error) {
      console.error("Error loading agent data:", error);
      showNotification("Error al cargar datos", "error");
    } finally {
      setLoading(false);
    }
  };

  // Filter data for this agent (simulate assignment by email)
  const agentRequests = useMemo(() => {
    if (!username) return [];
    return (requests as Request[]).filter(
      (r) => r.email_cliente?.toLowerCase().includes(username.toLowerCase()) ||
             r.nombre_cliente?.toLowerCase().includes(username.toLowerCase())
    );
  }, [requests, username]);

  const agentAppointments = useMemo(() => {
    if (!username) return [];
    return appointments.filter(
      (a) => a.email?.toLowerCase().includes(username.toLowerCase()) ||
             a.clientName?.toLowerCase().includes(username.toLowerCase())
    );
  }, [appointments, username]);

  // Calculate stats
  const stats: AgentStats = {
    requests: {
      total: agentRequests.length,
      pending: agentRequests.filter(r => r.status === "pending").length,
      approved: agentRequests.filter(r => r.status === "approved").length,
      declined: agentRequests.filter(r => r.status === "declined").length
    },
    appointments: {
      total: agentAppointments.length,
      today: agentAppointments.filter(a => {
        const today = new Date().toDateString();
        return new Date(a.appointmentDate).toDateString() === today;
      }).length,
      week: agentAppointments.filter(a => {
        const apptDate = new Date(a.appointmentDate);
        const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        return apptDate >= new Date() && apptDate <= weekFromNow;
      }).length,
      upcoming: agentAppointments.filter(a => new Date(a.appointmentDate) > new Date()).length
    },
    properties: {
      total: properties.length,
      active: properties.length, // All properties considered active
      featured: Math.min(5, Math.floor(properties.length * 0.2))
    },
    performance: {
      approvalRate: agentRequests.length > 0 
        ? Math.round((agentRequests.filter(r => r.status === "approved").length / agentRequests.length) * 100)
        : 0,
      responseTime: "2.3 hrs" // Simulated average response time
    }
  };

  const statCards = [
    {
      title: "Solicitudes",
      value: stats.requests.total,
      change: `${stats.requests.pending} pendientes`,
      icon: FileText,
      color: "blue",
      details: [
        { label: "Aprobadas", value: stats.requests.approved, color: "text-emerald-500" },
        { label: "Pendientes", value: stats.requests.pending, color: "text-amber-500" },
        { label: "Rechazadas", value: stats.requests.declined, color: "text-red-500" }
      ]
    },
    {
      title: "Citas Programadas",
      value: stats.appointments.total,
      change: `${stats.appointments.today} hoy`,
      icon: Calendar,
      color: "emerald",
      details: [
        { label: "Hoy", value: stats.appointments.today, color: "text-emerald-500" },
        { label: "Próximos 7 días", value: stats.appointments.week, color: "text-blue-500" },
        { label: "Próximas", value: stats.appointments.upcoming, color: "text-violet-500" }
      ]
    },
    {
      title: "Propiedades",
      value: stats.properties.total,
      change: `${stats.properties.featured} destacadas`,
      icon: Building2,
      color: "amber",
      details: [
        { label: "Activas", value: stats.properties.active, color: "text-emerald-500" },
        { label: "Destacadas", value: stats.properties.featured, color: "text-amber-500" }
      ]
    },
    {
      title: "Rendimiento",
      value: `${stats.performance.approvalRate}%`,
      change: stats.performance.responseTime,
      icon: TrendingUp,
      color: "rose",
      details: [
        { label: "Tasa de aprobación", value: `${stats.performance.approvalRate}%`, color: "text-emerald-500" },
        { label: "Tiempo respuesta", value: stats.performance.responseTime, color: "text-blue-500" }
      ]
    }
  ];

  // Get recent activity
  const recentActivity = [
    ...agentRequests.slice(0, 3).map(r => ({
      id: r._id,
      type: "request" as const,
      title: `Nueva solicitud de ${r.nombre_cliente}`,
      description: r.direccion,
      status: r.status,
      date: r.createdAt || new Date().toISOString(),
      icon: FileText
    })),
    ...agentAppointments.slice(0, 2).map(a => ({
      id: a.id.toString(),
      type: "appointment" as const,
      title: `Cita con ${a.clientName}`,
      description: a.email,
      status: "scheduled" as const,
      date: a.appointmentDate,
      icon: Calendar
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-80 bg-muted rounded mt-2 animate-pulse"></div>
          </div>
          <div className="h-10 w-10 bg-muted rounded-lg animate-pulse"></div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="h-6 w-24 bg-muted rounded animate-pulse"></div>
                <div className="h-10 w-10 bg-muted rounded-xl animate-pulse"></div>
              </div>
              <div className="h-8 w-16 bg-muted rounded mt-4 animate-pulse"></div>
              <div className="h-4 w-32 bg-muted rounded mt-2 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Panel de Agente</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona tus clientes, solicitudes y citas asignadas
          </p>
        </div>
        <ThemeToggle />
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const colorClasses = {
            blue: "bg-blue-500/10 text-blue-500",
            emerald: "bg-emerald-500/10 text-emerald-500",
            amber: "bg-amber-500/10 text-amber-500",
            rose: "bg-rose-500/10 text-rose-500"
          }[card.color];

          return (
            <div 
              key={index}
              className="rounded-3xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{card.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{card.change}</p>
                </div>
                <div className={`p-3 rounded-xl ${colorClasses}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <div className="space-y-2">
                  {card.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{detail.label}</span>
                      <span className={`font-medium ${detail.color}`}>{detail.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Work Dashboard */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Actividad Reciente</h2>
            <Briefcase className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => {
                const Icon = activity.icon;
                const statusColors = {
                  pending: "bg-amber-500/10 text-amber-500",
                  approved: "bg-emerald-500/10 text-emerald-500",
                  declined: "bg-red-500/10 text-red-500",
                  scheduled: "bg-blue-500/10 text-blue-500"
                };
                
                return (
                  <div key={activity.id} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50">
                    <div className={`p-2 rounded-xl ${statusColors[activity.status as keyof typeof statusColors] || 'bg-muted/10'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">
                        {new Date(activity.date).toLocaleDateString('es-EC')}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No hay actividad reciente</p>
                <p className="text-sm text-muted-foreground mt-1">Tus asignaciones aparecerán aquí</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Client Summary */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4">Acciones Rápidas</h2>
            
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 rounded-2xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                <FileText className="h-5 w-5" />
                <span className="font-medium">Ver Solicitudes</span>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">Gestionar Citas</span>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 rounded-2xl bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors">
                <Building2 className="h-5 w-5" />
                <span className="font-medium">Explorar Propiedades</span>
              </button>
            </div>
          </div>

          {/* Client Summary */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4">Resumen de Clientes</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Clientes activos</span>
                </div>
                <span className="font-semibold text-foreground">
                  {new Set([
                    ...agentRequests.map(r => r.email_cliente),
                    ...agentAppointments.map(a => a.email)
                  ]).size}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-muted-foreground">Requieren atención</span>
                </div>
                <span className="font-semibold text-amber-600">
                  {stats.requests.pending + stats.appointments.today}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-muted-foreground">Completados hoy</span>
                </div>
                <span className="font-semibold text-emerald-600">
                  {stats.requests.approved + stats.requests.declined}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Insights de Rendimiento</h2>
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-500/10">
            <Clock className="h-5 w-5 text-blue-500" />
            <div>
              <p className="font-medium text-blue-700">Tiempo Promedio</p>
              <p className="text-sm text-blue-600">{stats.performance.responseTime} por solicitud</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="font-medium text-emerald-700">Tasa de Éxito</p>
              <p className="text-sm text-emerald-600">{stats.performance.approvalRate}% de solicitudes aprobadas</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10">
            <UserCheck className="h-5 w-5 text-amber-500" />
            <div>
              <p className="font-medium text-amber-700">Clientes Activos</p>
              <p className="text-sm text-amber-600">{stats.requests.total} relaciones en curso</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-violet-500/10">
            <Calendar className="h-5 w-5 text-violet-500" />
            <div>
              <p className="font-medium text-violet-700">Productividad</p>
              <p className="text-sm text-violet-600">{stats.appointments.week} citas próximos 7 días</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

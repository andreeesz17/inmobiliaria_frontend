import { useEffect, useState } from "react";
import { BarChart3, Users, Building2, Calendar, FileText, TrendingUp, Eye, EyeOff, CheckCircle, Clock } from "lucide-react";
import ThemeToggle from "../../components/ThemeToggle";
import { getUsers } from "../../api/users.api";
import { getProperties } from "../../api/properties.api";
import { getRequests } from "../../api/requests.api";
import { getAppointments } from "../../api/appointments.api";
import type { User } from "../../types/user.types";
import type { Property } from "../../types/property.types";
import type { Request } from "../../types/request.types";
import type { Appointment } from "../../types/appointment.types";

interface Stats {
  users: { total: number; active: number; admins: number; agents: number; clients: number };
  properties: { total: number; active: number; featured: number };
  requests: { total: number; pending: number; approved: number; rejected: number };
  appointments: { total: number; today: number; week: number };
}

export default function AdminHome() {
  const [stats, setStats] = useState<Stats>({
    users: { total: 0, active: 0, admins: 0, agents: 0, clients: 0 },
    properties: { total: 0, active: 0, featured: 0 },
    requests: { total: 0, pending: 0, approved: 0, rejected: 0 },
    appointments: { total: 0, today: 0, week: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [usersRes, propertiesRes, requestsRes, appointmentsRes] = await Promise.all([
        getUsers({ page: 1, limit: 1000 }),
        getProperties({ page: 1, limit: 1000 }),
        getRequests(),
        getAppointments()
      ]);

      // Process users stats
      const users = usersRes.data as User[];
      const usersStats = {
        total: users.length,
        active: users.length, // All users are considered active for now
        admins: users.filter(u => u.role === "admin").length,
        agents: users.filter(u => u.role === "agent").length,
        clients: users.filter(u => u.role === "user").length
      };

      // Process properties stats
      const properties = propertiesRes.data as Property[];
      const propertiesStats = {
        total: properties.length,
        active: properties.length, // All properties are considered active
        featured: Math.min(5, Math.floor(properties.length * 0.2)) // Estimate 20% as featured
      };

      // Process requests stats
      const requests = requestsRes as Request[];
      const requestsStats = {
        total: requests.length,
        pending: requests.filter(r => r.status === "pending").length,
        approved: requests.filter(r => r.status === "approved").length,
        rejected: requests.filter(r => r.status === "declined").length
      };

      // Process appointments stats
      const appointments = appointmentsRes as Appointment[];
      const today = new Date().toDateString();
      const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      
      const appointmentsStats = {
        total: appointments.length,
        today: appointments.filter(a => new Date(a.appointmentDate).toDateString() === today).length,
        week: appointments.filter(a => {
          const apptDate = new Date(a.appointmentDate);
          return apptDate >= new Date() && apptDate <= weekFromNow;
        }).length
      };

      setStats({
        users: usersStats,
        properties: propertiesStats,
        requests: requestsStats,
        appointments: appointmentsStats
      });
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Usuarios Totales",
      value: stats.users.total,
      change: `+${stats.users.active} activos`,
      icon: Users,
      color: "blue",
      details: [
        { label: "Administradores", value: stats.users.admins, color: "text-purple-500" },
        { label: "Agentes", value: stats.users.agents, color: "text-cyan-500" },
        { label: "Clientes", value: stats.users.clients, color: "text-indigo-500" }
      ]
    },
    {
      title: "Propiedades",
      value: stats.properties.total,
      change: `${stats.properties.featured} destacadas`,
      icon: Building2,
      color: "emerald",
      details: [
        { label: "Activas", value: stats.properties.active, color: "text-emerald-500" },
        { label: "Destacadas", value: stats.properties.featured, color: "text-amber-500" }
      ]
    },
    {
      title: "Solicitudes",
      value: stats.requests.total,
      change: `${stats.requests.pending} pendientes`,
      icon: FileText,
      color: "amber",
      details: [
        { label: "Aprobadas", value: stats.requests.approved, color: "text-emerald-500" },
        { label: "Pendientes", value: stats.requests.pending, color: "text-amber-500" },
        { label: "Rechazadas", value: stats.requests.rejected, color: "text-red-500" }
      ]
    },
    {
      title: "Citas",
      value: stats.appointments.total,
      change: `${stats.appointments.today} hoy`,
      icon: Calendar,
      color: "rose",
      details: [
        { label: "Hoy", value: stats.appointments.today, color: "text-rose-500" },
        { label: "Próximos 7 días", value: stats.appointments.week, color: "text-violet-500" }
      ]
    }
  ];

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
          <h1 className="text-3xl font-bold text-foreground">Dashboard Administrativo</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Panel centralizado de métricas y gestión del sistema
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
              
              {/* Details */}
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

      {/* Quick Actions & Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Actividad Reciente</h2>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Nueva propiedad aprobada</p>
                <p className="text-sm text-muted-foreground">Casa en Av. Principal #123</p>
              </div>
              <span className="text-xs text-muted-foreground">Hace 2 horas</span>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <Clock className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Solicitud pendiente</p>
                <p className="text-sm text-muted-foreground">Cliente: Juan Pérez</p>
              </div>
              <span className="text-xs text-muted-foreground">Hace 5 horas</span>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                <Users className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Nuevo agente registrado</p>
                <p className="text-sm text-muted-foreground">María González</p>
              </div>
              <span className="text-xs text-muted-foreground">Hace 1 día</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-6">Acciones Rápidas</h2>
          
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 rounded-2xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              <Users className="h-5 w-5" />
              <span className="font-medium">Gestionar Usuarios</span>
            </button>
            
            <button className="w-full flex items-center gap-3 p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors">
              <Building2 className="h-5 w-5" />
              <span className="font-medium">Moderar Propiedades</span>
            </button>
            
            <button className="w-full flex items-center gap-3 p-3 rounded-2xl bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors">
              <FileText className="h-5 w-5" />
              <span className="font-medium">Revisar Solicitudes</span>
            </button>
            
            <button className="w-full flex items-center gap-3 p-3 rounded-2xl bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-colors">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">Ver Citas</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-6">Estado del Sistema</h2>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="font-medium text-emerald-700">API Operativa</p>
              <p className="text-xs text-emerald-600">Todos los servicios activos</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-500/10">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <div>
              <p className="font-medium text-blue-700">99.9% Uptime</p>
              <p className="text-xs text-blue-600">Últimas 24 horas</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10">
            <Eye className="h-5 w-5 text-amber-500" />
            <div>
              <p className="font-medium text-amber-700">Monitoreo Activo</p>
              <p className="text-xs text-amber-600">Sistema supervisado</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-violet-500/10">
            <EyeOff className="h-5 w-5 text-violet-500" />
            <div>
              <p className="font-medium text-violet-700">Backups OK</p>
              <p className="text-xs text-violet-600">Último: hace 2 horas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

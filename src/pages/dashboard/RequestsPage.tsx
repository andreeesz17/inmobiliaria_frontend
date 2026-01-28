import { useEffect, useState } from "react";
import { getRequests, updateRequestStatus } from "../../api/requests.api";
import type { Request } from "../../types/request.types";
import { useAuth } from "../../auth/useAuth";
import { showNotification } from "../../components/Notifications";
import {
  ClipboardList,
  RefreshCw,
  Check,
  X,
  Loader2,
  MapPin,
  DollarSign,
  BedDouble,
  Calendar,
  Mail,
  User,
  Clock,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function RequestsPage() {
  const { username, isAdmin, isAgent } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages] = useState(1);

  // Only admins and agents can approve/decline requests
  const canManageRequests = isAdmin || isAgent;

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await getRequests();
      setRequests(data as Request[]);
    } catch (error) {
      console.error("Error loading requests:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    requestId: string,
    status: "approved" | "declined"
  ) => {
    if (!username) return;

    setActionLoading(requestId);
    try {
      await updateRequestStatus(requestId, status);

      // Refresh requests
      await loadRequests();

      showNotification(
        `Solicitud ${status === "approved" ? "aprobada" : "rechazada"} exitosamente`,
        "success"
      );
    } catch (error: any) {
      console.error("Error updating request status:", error);

      // Show detailed error message
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        `Error al ${status === "approved" ? "aprobar" : "rechazar"} la solicitud`;

      showNotification(errorMessage, "error");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "approved":
        return {
          bg: "bg-emerald-100 dark:bg-emerald-900/30",
          text: "text-emerald-700 dark:text-emerald-300",
          border: "border-emerald-200 dark:border-emerald-800/50",
          dot: "bg-emerald-500",
          label: "Aprobada",
        };
      case "declined":
        return {
          bg: "bg-red-100 dark:bg-red-900/30",
          text: "text-red-700 dark:text-red-300",
          border: "border-red-200 dark:border-red-800/50",
          dot: "bg-red-500",
          label: "Rechazada",
        };
      default:
        return {
          bg: "bg-amber-100 dark:bg-amber-900/30",
          text: "text-amber-700 dark:text-amber-300",
          border: "border-amber-200 dark:border-amber-800/50",
          dot: "bg-amber-500",
          label: "Pendiente",
        };
    }
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const declinedCount = requests.filter((r) => r.status === "declined").length;

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent rounded-full blur-3xl dark:from-cyan-400/10 dark:to-blue-400/10" />
        <div className="absolute -bottom-1/2 -right-1/2 w-[200%] h-[200%] bg-gradient-to-tl from-blue-500/5 via-transparent to-transparent rounded-full blur-3xl dark:from-blue-400/10 dark:to-cyan-400/10" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">

        <section className="relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50/50 to-transparent p-8 shadow-lg shadow-slate-300/20 dark:border-slate-700 dark:bg-gradient-to-b dark:from-slate-800/30 dark:to-transparent dark:shadow-black/30">
          <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[80px] dark:bg-cyan-400/20" />
          <div className="absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-blue-500/10 blur-[80px] dark:bg-blue-400/20" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500 shadow-lg shadow-cyan-500/30">
                <ClipboardList className="h-7 w-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Solicitudes
                  </h1>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-600 dark:border-cyan-400/30 dark:bg-cyan-500/20 dark:text-cyan-300">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75 dark:bg-cyan-300" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                    </span>
                    Live
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Gestiona las solicitudes de clientes interesados.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">

              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pendientes
                  </p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {pendingCount}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Aprobadas
                  </p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {approvedCount}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                  <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Rechazadas
                  </p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {declinedCount}
                  </p>
                </div>
              </div>

              <button
                onClick={loadRequests}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all hover:bg-cyan-600 hover:shadow-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-slate-800"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Actualizar
              </button>
            </div>
          </div>
        </section>


        <section className="relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-300/20 dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/30">
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-blue-500/5 blur-[80px] dark:bg-blue-400/10" />

          <div className="relative">

            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-5 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Listado de solicitudes
              </h2>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <button
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </button>

                  <span className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                    Página <span className="font-bold">{page}</span> de{" "}
                    <span className="font-bold">{totalPages}</span>
                  </span>

                  <button
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center gap-3 rounded-xl bg-slate-100 px-6 py-3 text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Cargando solicitudes...
                </div>
              </div>
            ) : requests.length === 0 ? (
              <div className="p-12 text-center">
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 dark:border-slate-600 dark:bg-slate-800/50">
                  <ClipboardList className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
                  <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
                    No hay solicitudes
                  </h3>
                  <p className="mt-2 text-slate-500 dark:text-slate-400">
                    Las nuevas solicitudes aparecerán aquí
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
                {requests.map((request) => {
                  const statusConfig = getStatusConfig(request.status);
                  return (
                    <div
                      key={request._id}
                      className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
                    >

                      <div className="mb-4 flex items-start gap-3 min-w-0">

                        <div className="flex-1 min-w-0">
                          <div className="mb-1 flex items-center gap-2 min-w-0">
                            <User className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" />
                            <span className="truncate font-semibold text-slate-900 dark:text-white">
                              {request.nombre_cliente || "Cliente sin nombre"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 min-w-0 text-sm text-slate-600 dark:text-slate-400">
                            <Mail className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">
                              {request.email_cliente || "Sin email"}
                            </span>
                          </div>
                        </div>


                        <span
                          className={`shrink-0 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                        >
                          <span className={`h-2 w-2 rounded-full ${statusConfig.dot}`} />
                          {statusConfig.label}
                        </span>
                      </div>


                      <div className="mb-4 space-y-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" />
                          <p className="line-clamp-2 text-sm font-medium text-slate-900 dark:text-white">
                            {request.direccion || "Dirección no especificada"}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                            <FileText className="h-3.5 w-3.5 shrink-0" />
                            <span>{request.tipo_operacion || "N/A"}</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                            <DollarSign className="h-3.5 w-3.5 shrink-0" />
                            <span>${(request.precio ?? 0).toLocaleString()}</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                            <BedDouble className="h-3.5 w-3.5 shrink-0" />
                            <span>{request.num_habitaciones ?? 0} hab.</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                            <Calendar className="h-3.5 w-3.5 shrink-0" />
                            <span>
                              {request.createdAt
                                ? new Date(request.createdAt).toLocaleDateString("es-EC")
                                : "Sin fecha"}
                            </span>
                          </div>
                        </div>
                      </div>


                      {request.status === "pending" && canManageRequests && (
                        <div className="mt-auto flex gap-2 border-t border-slate-200 pt-4 dark:border-slate-700">
                          <button
                            onClick={() => handleStatusChange(request._id, "approved")}
                            disabled={actionLoading === request._id}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
                          >
                            {actionLoading === request._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                            Aprobar
                          </button>

                          <button
                            onClick={() => handleStatusChange(request._id, "declined")}
                            disabled={actionLoading === request._id}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                          >
                            {actionLoading === request._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                            Rechazar
                          </button>
                        </div>
                      )}


                      {request.status === "pending" && !canManageRequests && (
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Pendiente de aprobación por administrador/agent
                          </span>
                        </div>
                      )}


                      {(request.status === "approved" || request.status === "declined") &&
                        request.notes && (
                          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                              Notas:
                            </div>
                            <div className="text-sm text-slate-700 bg-slate-50 p-2 rounded-lg dark:bg-slate-700/50 dark:text-slate-300">
                              {request.notes}
                            </div>
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
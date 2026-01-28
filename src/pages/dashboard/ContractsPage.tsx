import { useEffect, useState, useMemo } from "react";
import { getContracts } from "../../api/contracts.api";
import type { Contract } from "../../types/contract.types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/Card";
import { Button } from "../../components/Button";
import { Skeleton } from "../../components/Skeleton";
import { 
  FileText, 
  Calendar, 
  Hash,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Eye,
  Filter
} from "lucide-react";

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadContracts = async () => {
      try {
        setLoading(true);
        const data = await getContracts();
        setContracts(data as Contract[]);
      } catch (error) {
        console.error("Error loading contracts:", error);
        setContracts([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadContracts();
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'signed': 
      case 'completado':
      case 'finalizado':
        return { 
          bg: 'bg-emerald-100 dark:bg-emerald-900/30', 
          text: 'text-emerald-700 dark:text-emerald-300',
          border: 'border-emerald-200 dark:border-emerald-800/50',
          icon: CheckCircle,
          label: 'Firmado'
        };
      case 'pending': 
      case 'pendiente':
      case 'en proceso':
        return { 
          bg: 'bg-amber-100 dark:bg-amber-900/30', 
          text: 'text-amber-700 dark:text-amber-300',
          border: 'border-amber-200 dark:border-amber-800/50',
          icon: Clock,
          label: 'Pendiente'
        };
      case 'cancelled': 
      case 'cancelado':
      case 'rechazado':
        return { 
          bg: 'bg-red-100 dark:bg-red-900/30', 
          text: 'text-red-700 dark:text-red-300',
          border: 'border-red-200 dark:border-red-800/50',
          icon: XCircle,
          label: 'Cancelado'
        };
      default: 
        return { 
          bg: 'bg-slate-100 dark:bg-slate-900/30', 
          text: 'text-slate-700 dark:text-slate-300',
          border: 'border-slate-200 dark:border-slate-800/50',
          icon: FileText,
          label: status || 'Desconocido'
        };
    }
  };

  const filteredContracts = useMemo(() => {
    return contracts.filter(contract => {
      const matchesSearch = contract.contractNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contract.transactionId?.toString().includes(searchTerm);
      const matchesStatus = filterStatus === 'all' || contract.status?.toLowerCase() === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [contracts, searchTerm, filterStatus]);

  const stats = useMemo(() => {
    const total = contracts.length;
    const signed = contracts.filter(c => c.status?.toLowerCase() === 'signed' || c.status?.toLowerCase() === 'completado').length;
    const pending = contracts.filter(c => c.status?.toLowerCase() === 'pending' || c.status?.toLowerCase() === 'pendiente').length;
    const cancelled = contracts.filter(c => c.status?.toLowerCase() === 'cancelled' || c.status?.toLowerCase() === 'cancelado').length;
    
    return { total, signed, pending, cancelled };
  }, [contracts]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Contratos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Seguimiento de contratos activos y su transacción asociada
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>Total: {stats.total}</span>
          </div>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Nuevo Contrato
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
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Firmados</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.signed}</p>
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
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Cancelados</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                <XCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por número de contrato o ID de transacción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">Todos los estados</option>
                <option value="signed">Firmados</option>
                <option value="pending">Pendientes</option>
                <option value="cancelled">Cancelados</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contracts List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Contratos</CardTitle>
              <CardDescription>
                {filteredContracts.length} contrato{filteredContracts.length !== 1 ? 's' : ''} encontrado{filteredContracts.length !== 1 ? 's' : ''}
                {searchTerm && ` para "${searchTerm}"`}
              </CardDescription>
            </div>
            {filteredContracts.length > 0 && (
              <Button variant="outline" icon={<Download className="h-4 w-4" />}>
                Exportar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {filteredContracts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredContracts.map((contract) => {
                const statusConfig = getStatusConfig(contract.status);
                const Icon = statusConfig.icon;
                
                return (
                  <Card key={contract.id} hover>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-foreground truncate">
                              Contrato #{contract.contractNumber}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Transacción: {contract.transactionId}
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
                            <span>Fecha: {contract.createdAt ? new Date(contract.createdAt).toLocaleDateString() : 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Hash className="h-4 w-4" />
                            <span>ID: {contract.id}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-2 border-t border-border">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            icon={<Eye className="h-4 w-4" />}
                          >
                            Ver Detalles
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            icon={<Download className="h-4 w-4" />}
                          >
                            PDF
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchTerm || filterStatus !== 'all' 
                  ? 'No se encontraron contratos' 
                  : 'No hay contratos registrados'}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || filterStatus !== 'all'
                  ? 'Intenta con otros términos de búsqueda o filtros'
                  : 'Los contratos aparecerán aquí una vez creados'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

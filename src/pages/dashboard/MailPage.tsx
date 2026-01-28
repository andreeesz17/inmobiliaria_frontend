import { useState, useEffect } from "react";
import { sendMail } from "../../api/mail.api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/Card";
import { Button } from "../../components/Button";

import { 
  Mail, 
  Send, 
  User, 
  Hash,
  Calendar,
  CheckCircle,
  AlertCircle,
  History,
  Filter
} from "lucide-react";

interface EmailLog {
  id: string;
  to: string;
  subject: string;
  status: 'sent' | 'failed' | 'pending';
  sentAt: string;
  errorMessage?: string;
}

export default function MailPage() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock email logs for demonstration
  useEffect(() => {
    const mockLogs: EmailLog[] = [
      {
        id: '1',
        to: 'cliente1@ejemplo.com',
        subject: 'Confirmación de cita',
        status: 'sent',
        sentAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '2',
        to: 'cliente2@ejemplo.com',
        subject: 'Información de propiedad',
        status: 'sent',
        sentAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '3',
        to: 'cliente3@ejemplo.com',
        subject: 'Oferta especial',
        status: 'failed',
        sentAt: new Date(Date.now() - 172800000).toISOString(),
        errorMessage: 'Dirección de correo inválida'
      }
    ];
    setEmailLogs(mockLogs);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    const payload = {
      to: to.trim(),
      subject: subject.trim(),
      message: message.trim(),
    };

    if (!payload.to || !payload.subject || !payload.message) {
      setStatus({text: "Completa todos los campos.", type: 'error'});
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.to)) {
      setStatus({text: "Ingresa una dirección de correo válida.", type: 'error'});
      return;
    }

    setLoading(true);
    try {
      await sendMail(payload);
      setStatus({text: "Correo enviado correctamente.", type: 'success'});
      
      // Add to logs
      const newLog: EmailLog = {
        id: Math.random().toString(36).substr(2, 9),
        to: payload.to,
        subject: payload.subject,
        status: 'sent',
        sentAt: new Date().toISOString()
      };
      setEmailLogs(prev => [newLog, ...prev]);
      
      // Clear form
      setTo("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Send mail error:", error);
      setStatus({text: "No se pudo enviar el correo. Verifica los datos.", type: 'error'});
      
      // Add failed log
      const failedLog: EmailLog = {
        id: Math.random().toString(36).substr(2, 9),
        to: payload.to,
        subject: payload.subject,
        status: 'failed',
        sentAt: new Date().toISOString(),
        errorMessage: 'Error al enviar'
      };
      setEmailLogs(prev => [failedLog, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'sent': 
        return { 
          bg: 'bg-emerald-100 dark:bg-emerald-900/30', 
          text: 'text-emerald-700 dark:text-emerald-300',
          border: 'border-emerald-200 dark:border-emerald-800/50',
          icon: CheckCircle,
          label: 'Enviado'
        };
      case 'failed': 
        return { 
          bg: 'bg-red-100 dark:bg-red-900/30', 
          text: 'text-red-700 dark:text-red-300',
          border: 'border-red-200 dark:border-red-800/50',
          icon: AlertCircle,
          label: 'Fallido'
        };
      default: 
        return { 
          bg: 'bg-amber-100 dark:bg-amber-900/30', 
          text: 'text-amber-700 dark:text-amber-300',
          border: 'border-amber-200 dark:border-amber-800/50',
          icon: Mail,
          label: 'Pendiente'
        };
    }
  };

  const filteredLogs = emailLogs.filter(log => 
    filterStatus === 'all' || log.status === filterStatus
  );

  const stats = {
    total: emailLogs.length,
    sent: emailLogs.filter(log => log.status === 'sent').length,
    failed: emailLogs.filter(log => log.status === 'failed').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sistema de Correos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona el envío y seguimiento de correos electrónicos
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>Total: {stats.total}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Enviados</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.sent}</p>
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
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Fallidos</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('compose')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'compose' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Redactar
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'history' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <History className="h-4 w-4" />
          Historial
        </button>
      </div>

      {activeTab === 'compose' ? (
        /* Compose Email Form */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Nuevo Mensaje
            </CardTitle>
            <CardDescription>
              Envía correos electrónicos a tus clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Para *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    type="email"
                    placeholder="direccion@ejemplo.com"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Asunto *</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Asunto del mensaje"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Mensaje *</label>
                <textarea
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[200px]"
                  placeholder="Escribe tu mensaje aquí..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button 
                  type="submit" 
                  loading={loading}
                  icon={<Send className="h-4 w-4" />}
                  className="min-w-[120px]"
                >
                  {loading ? 'Enviando...' : 'Enviar Correo'}
                </Button>
                
                {status && (
                  <div className={`px-4 py-2 rounded-lg text-sm ${
                    status.type === 'success' 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {status.text}
                  </div>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        /* Email History */
        <>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="sent">Enviados</option>
                    <option value="failed">Fallidos</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Historial de Correos</CardTitle>
              <CardDescription>
                {filteredLogs.length} correo{filteredLogs.length !== 1 ? 's' : ''} encontrado{filteredLogs.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredLogs.length > 0 ? (
                <div className="space-y-3">
                  {filteredLogs.map((log) => {
                    const statusConfig = getStatusConfig(log.status);
                    const Icon = statusConfig.icon;
                    
                    return (
                      <div 
                        key={log.id} 
                        className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium text-foreground truncate flex-1 mr-3">{log.subject}</h3>
                            <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                              <Icon className="h-3 w-3" />
                              {statusConfig.label}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span className="truncate">{log.to}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(log.sentAt).toLocaleString()}</span>
                            </div>
                          </div>
                          
                          {log.errorMessage && (
                            <div className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                              Error: {log.errorMessage}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No hay correos registrados
                  </h3>
                  <p className="text-muted-foreground">
                    Los correos enviados aparecerán aquí
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

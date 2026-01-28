import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { cn } from "../utils/cn";

interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  title?: string;
  timestamp: number;
  duration?: number;
}

let notificationId = 0;

const notificationsStore: Notification[] = [];

export function showNotification(
  message: string, 
  type: Notification['type'] = "info",
  title?: string,
  duration: number = 4000
) {
  const id = `notif_${++notificationId}`;
  const notification: Notification = {
    id,
    message,
    type,
    title,
    timestamp: Date.now(),
    duration
  };
  
  notificationsStore.push(notification);
  
  // Auto-remove after duration
  setTimeout(() => {
    const index = notificationsStore.findIndex(n => n.id === id);
    if (index > -1) {
      notificationsStore.splice(index, 1);
    }
  }, duration);
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const updateNotifications = () => {
      setNotifications([...notificationsStore]);
    };

    // Check for updates every 100ms
    const interval = setInterval(updateNotifications, 100);
    
    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning': return <XCircle className="h-5 w-5 text-amber-500" />;
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTypeStyles = (type: Notification['type']) => {
    const base = "px-4 py-3 rounded-xl shadow-lg animate-fade-in flex items-start gap-3 max-w-sm";
    
    switch (type) {
      case 'success': 
        return cn(base, "bg-emerald-500/10 border border-emerald-500/20");
      case 'error': 
        return cn(base, "bg-red-500/10 border border-red-500/20");
      case 'warning': 
        return cn(base, "bg-amber-500/10 border border-amber-500/20");
      case 'info': 
        return cn(base, "bg-blue-500/10 border border-blue-500/20");
      default:
        return cn(base, "bg-gray-500/10 border border-gray-500/20");
    }
  };

  const getTitleColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return "text-emerald-100";
      case 'error': return "text-red-100";
      case 'warning': return "text-amber-100";
      case 'info': return "text-blue-100";
      default: return "text-gray-100";
    }
  };

  const getMessageColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return "text-emerald-200";
      case 'error': return "text-red-200";
      case 'warning': return "text-amber-200";
      case 'info': return "text-blue-200";
      default: return "text-gray-200";
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={getTypeStyles(notification.type)}
        >
          <div className="flex-shrink-0 mt-0.5">
            {getIcon(notification.type)}
          </div>
          
          <div className="flex-1 min-w-0 pointer-events-auto">
            {notification.title && (
              <h4 className={cn("text-sm font-semibold", getTitleColor(notification.type))}>
                {notification.title}
              </h4>
            )}
            <p className={cn("text-sm mt-1", getMessageColor(notification.type))}>
              {notification.message}
            </p>
          </div>
          
          <button
            onClick={() => {
              const index = notificationsStore.findIndex(n => n.id === notification.id);
              if (index > -1) {
                notificationsStore.splice(index, 1);
                setNotifications([...notificationsStore]);
              }
            }}
            className="flex-shrink-0 ml-2 mt-0.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
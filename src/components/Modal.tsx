import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "../utils/cn";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true
}: ModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEscape && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4"
  };

  return (
    // Portal-like behavior with simpler DOM structure
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      {/* Modal container */}
      <div 
        className={cn(
          "relative w-full bg-card rounded-2xl shadow-2xl border border-border max-h-[90vh] overflow-hidden z-10",
          sizeClasses[size]
        )}
      >
        {/* Header - Always rendered for consistent structure */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          {title && (
            <h2 className="text-xl font-semibold text-foreground">
              {title}
            </h2>
          )}
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
          
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
          {children}
        </div>
      </div>
    </div>
  );
}

// Hook for modal state management
export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const toggleModal = () => setIsOpen(!isOpen);
  
  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal
  };
}

// Confirmation Dialog Component
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "primary" | "danger";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmVariant = "primary"
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title}
      size="sm"
      showCloseButton={false}
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          {message}
        </p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors",
              confirmVariant === "danger" 
                ? "bg-red-600 hover:bg-red-700" 
                : "bg-primary hover:bg-primary/90"
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
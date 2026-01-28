import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../utils/cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variantClasses = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/50",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary/50",
      danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive/50",
      ghost: "text-foreground hover:bg-accent hover:text-accent-foreground focus:ring-accent/50",
      outline: "border border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground focus:ring-accent/50"
    };
    
    const sizeClasses = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
      icon: "p-2"
    };
    
    const showLeftIcon = !loading && icon && iconPosition === "left";
    const showRightIcon = !loading && icon && iconPosition === "right";
    
    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className={cn(
            "h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent",
            iconPosition === "left" ? "mr-2" : "ml-2"
          )} />
        )}
        
        {showLeftIcon && (
          <span className="mr-2">{icon}</span>
        )}
        
        <span>{children}</span>
        
        {showRightIcon && (
          <span className="ml-2">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
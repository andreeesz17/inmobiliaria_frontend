import { useRef } from "react";
import { cn } from "../utils/cn";

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface SimpleBarChartProps {
  data: ChartDataPoint[];
  title?: string;
  height?: number;
  showValues?: boolean;
  className?: string;
}

export function SimpleBarChart({
  data,
  title,
  height = 300,
  showValues = true,
  className
}: SimpleBarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const chartRef = useRef<HTMLDivElement>(null);

  // Colors for bars if not provided
  const defaultColors = [
    "bg-blue-500",
    "bg-emerald-500", 
    "bg-amber-500",
    "bg-rose-500",
    "bg-violet-500",
    "bg-cyan-500"
  ];

  return (
    <div className={cn("space-y-4", className)}>
      {title && (
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      )}
      
      <div 
        ref={chartRef}
        className="relative"
        style={{ height: `${height}px` }}
      >
        <div className="absolute inset-0 flex items-end justify-between gap-2 px-2">
          {data.map((item, index) => {
            const barHeight = maxValue > 0 ? (item.value / maxValue) * (height - 60) : 0;
            const barColor = item.color || defaultColors[index % defaultColors.length];
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                {/* Bar */}
                <div 
                  className="relative w-full flex justify-center mb-2"
                  style={{ height: `${barHeight}px` }}
                >
                  <div 
                    className={cn(
                      "w-3/4 rounded-t-lg transition-all duration-500 ease-out",
                      barColor
                    )}
                    style={{ 
                      height: '100%',
                      transform: 'translateY(100%)',
                      animation: `growUp 0.8s ease-out ${index * 0.1}s forwards`
                    }}
                  />
                  
                  {/* Value label */}
                  {showValues && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-foreground">
                      {item.value}
                    </div>
                  )}
                </div>
                
                {/* Label */}
                <div className="text-xs text-center text-muted-foreground truncate w-full px-1">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Y-axis */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-border"></div>
        
        {/* X-axis */}
        <div className="absolute left-0 right-0 bottom-0 h-px bg-border"></div>
      </div>
    </div>
  );
}

interface SimpleLineChartProps {
  data: { x: string; y: number }[];
  title?: string;
  height?: number;
  color?: string;
  showPoints?: boolean;
  className?: string;
}

export function SimpleLineChart({
  data,
  title,
  height = 300,
  color = "text-blue-500",
  showPoints = true,
  className
}: SimpleLineChartProps) {
  const maxValue = Math.max(...data.map(d => d.y));
  const minValue = Math.min(...data.map(d => d.y));
  const range = maxValue - minValue || 1;

  return (
    <div className={cn("space-y-4", className)}>
      {title && (
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      )}
      
      <div className="relative" style={{ height: `${height}px` }}>
        <svg className="w-full h-full" viewBox={`0 0 100 ${height}`}>
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(percent => (
            <line
              key={percent}
              x1="0"
              y1={`${percent}%`}
              x2="100%"
              y2={`${percent}%`}
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-border"
              strokeDasharray="2,2"
            />
          ))}
          
          {/* Line path */}
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={color}
            points={data.map((point, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = ((maxValue - point.y) / range) * (height - 40) + 20;
              return `${x},${y}`;
            }).join(" ")}
          />
          
          {/* Points */}
          {showPoints && data.map((point, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = ((maxValue - point.y) / range) * (height - 40) + 20;
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="currentColor"
                className={color}
              />
            );
          })}
        </svg>
        
        {/* Labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground px-2">
          {data.map((point, index) => (
            <span key={index} className="truncate">
              {point.x}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  trend,
  icon,
  className
}: StatCardProps) {
  return (
    <div className={cn(
      "rounded-2xl border border-border bg-card p-6 shadow-sm",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
          <p className="text-2xl font-bold text-foreground">
            {value}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        
        {icon && (
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
      
      {trend && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-emerald-600" : "text-red-600"
            )}>
              {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground">
              {trend.label}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes growUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);
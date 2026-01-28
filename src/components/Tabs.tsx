import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { cn } from "../utils/cn";

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultActiveTab?: string;
  onTabChange?: (tabId: string) => void;
  children: ReactNode;
  className?: string;
}

interface TabPanelProps {
  tabId: string;
  children: ReactNode;
  className?: string;
}

export function Tabs({ 
  tabs, 
  defaultActiveTab, 
  onTabChange, 
  children,
  className 
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id || "");

  useEffect(() => {
    if (onTabChange) {
      onTabChange(activeTab);
    }
  }, [activeTab, onTabChange]);

  const handleTabClick = (tabId: string, disabled: boolean = false) => {
    if (!disabled) {
      setActiveTab(tabId);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Tab List */}
      <div className="flex flex-wrap gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id, tab.disabled)}
            disabled={tab.disabled}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-2",
              tab.disabled 
                ? "text-muted-foreground opacity-50 cursor-not-allowed" 
                : activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div>
        {children}
      </div>
    </div>
  );
}

export function TabPanel({ tabId, children, className }: TabPanelProps) {
  return (
    <div 
      role="tabpanel" 
      className={cn(className)}
      data-tab-id={tabId}
    >
      {children}
    </div>
  );
}

// Hook for controlling tabs programmatically
export function useTabs(defaultTab: string) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  return {
    activeTab,
    setActiveTab,
    isActive: (tabId: string) => activeTab === tabId
  };
}
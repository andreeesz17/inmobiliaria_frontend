import { cn } from "../utils/cn";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className, width, height }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
      style={{ width, height }}
    />
  );
}

interface StatCardSkeletonProps {
  showDetails?: boolean;
}

export function StatCardSkeleton({ showDetails = true }: StatCardSkeletonProps) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
      
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-8" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-6" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-18" />
              <Skeleton className="h-3 w-7" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ListItemSkeletonProps {
  count?: number;
  hasImage?: boolean;
}

export function ListItemSkeleton({ count = 3, hasImage = false }: ListItemSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50">
          {hasImage && <Skeleton className="h-12 w-12 rounded-xl" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Content Sections */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-5 rounded" />
            </div>
            <ListItemSkeleton count={3} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <Skeleton className="h-6 w-24 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-10 w-full rounded-2xl" />
              <Skeleton className="h-10 w-full rounded-2xl" />
              <Skeleton className="h-10 w-full rounded-2xl" />
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-6" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-8" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-22" />
                <Skeleton className="h-4 w-7" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
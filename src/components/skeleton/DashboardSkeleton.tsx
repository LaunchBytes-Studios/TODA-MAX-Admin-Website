import { Skeleton } from '../ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg border bg-white p-4 shadow-sm">
            <Skeleton className="h-4 w-28 mb-3" />
            <Skeleton className="h-10 w-16 mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <Skeleton className="h-5 w-36 mb-4" />
          <Skeleton className="h-44 w-full rounded-lg" />
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <Skeleton className="h-5 w-40 mb-4" />
          <Skeleton className="h-44 w-full rounded-lg" />
        </div>
      </div>
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <Skeleton className="h-5 w-48 mb-4" />
        <Skeleton className="h-56 w-full rounded-lg" />
      </div>
    </div>
  );
}

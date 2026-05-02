import { Skeleton } from '../ui/skeleton';

export function InventoryStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border bg-white p-4 shadow-sm space-y-3"
        >
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

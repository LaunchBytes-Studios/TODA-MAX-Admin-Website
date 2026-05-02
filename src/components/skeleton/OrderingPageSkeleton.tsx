import { Skeleton } from '../ui/skeleton';

export function OrderListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="w-full">
              <Skeleton className="h-5 w-32 mb-2 rounded-lg" />
              <Skeleton className="h-6 w-40 mb-2 rounded-lg" />
              <Skeleton className="h-4 w-48 rounded-lg" />
            </div>
            <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
              <Skeleton className="h-7 w-24 rounded-lg" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-lg" />
                <Skeleton className="h-6 w-24 rounded-lg" />
                <Skeleton className="h-9 w-16 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function OrderingPageSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Skeleton className="h-9 w-36 rounded-lg" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-lg border bg-white p-4 shadow-sm">
            <Skeleton className="h-5 w-24 mb-3" />
            <Skeleton className="h-10 w-16 mb-2" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Skeleton className="max-w-sm w-full h-10 rounded-lg" />
          <Skeleton className="w-full sm:w-96 h-10 rounded-lg" />
        </div>
      </div>

      <OrderListSkeleton />
    </div>
  );
}

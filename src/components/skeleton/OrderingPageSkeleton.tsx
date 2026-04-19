import { Skeleton } from '../ui/skeleton';

export function OrderingPageSkeleton() {
  return (
    <div className="container mx-auto p-6">
      {/* Title Skeleton */}
      <Skeleton className="h-10 w-32 mb-6 rounded-lg" />

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <Skeleton className="h-6 w-24 mb-3 rounded" />
            <Skeleton className="h-10 w-16 rounded" />
          </div>
        ))}
      </div>

      {/* Search + Tabs Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Skeleton className="max-w-sm w-full h-10 rounded-lg" />
        <Skeleton className="w-full sm:w-96 h-10 rounded-lg" />
      </div>

      {/* Order List Skeleton */}
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="w-full">
                <Skeleton className="h-5 w-32 mb-2 rounded" />
                <Skeleton className="h-6 w-40 mb-2 rounded" />
                <Skeleton className="h-4 w-48 rounded" />
              </div>
              <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                <Skeleton className="h-7 w-24 rounded" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 rounded" />
                  <Skeleton className="h-6 w-24 rounded" />
                  <Skeleton className="h-9 w-16 rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Skeleton } from '../ui/skeleton';

export function SupportChatSkeleton() {
  return (
    <div className="flex flex-1 gap-6 min-h-0">
      {/* Left Panel Skeleton */}
      <div className="w-1/3 border rounded-xl p-4">
        <Skeleton className="h-6 w-1/2 mb-4 rounded" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded" />
          ))}
        </div>
      </div>

      {/* Right Panel Skeleton */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-lg border min-h-0">
        {/* Header Skeleton */}
        <div className="border-b p-4">
          <Skeleton className="h-6 w-1/3 mb-2 rounded" />
          <Skeleton className="h-4 w-1/4 rounded" />
        </div>
        {/* Messages Skeleton */}
        <div className="flex-1 p-4 space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              className={`h-20 w-[45%] rounded ${i % 2 === 0 ? 'ml-auto' : 'mr-auto'}`}
            />
          ))}
        </div>
        {/* Input Area Skeleton */}
        <div className="border-t p-4">
          <Skeleton className="h-10 w-full rounded" />
        </div>
      </div>
    </div>
  );
}

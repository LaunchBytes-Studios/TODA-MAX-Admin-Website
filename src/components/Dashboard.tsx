import { StatsCards } from './StatsCard';
import { LowStockTable } from './LowStock';
import { RegistrationCodes } from './RegistrationCodes';
import { BroadcastAlert } from './BroadcastAlert';
import { Skeleton } from './ui/skeleton';
import { useState, useEffect } from 'react';

export function Dashboard() {
  // Simulate loading state for skeleton demo (replace with actual loading logic as needed)
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6 overflow-y-auto scrollbar-none">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <StatsCards />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <Skeleton className="h-72 w-full rounded-xl" />
        ) : (
          <LowStockTable />
        )}
        {loading ? (
          <Skeleton className="h-72 w-full rounded-xl" />
        ) : (
          <RegistrationCodes />
        )}
      </div>

      {loading ? (
        <Skeleton className="h-56 w-full rounded-xl" />
      ) : (
        <BroadcastAlert />
      )}
    </div>
  );
}
